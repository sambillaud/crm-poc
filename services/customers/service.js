const { v4: uuidv4 } = require('uuid');
const s3 = require('../../lib/s3');

const ENRICHED_BUCKET = process.env.ENRICHED_BUCKET;
const RAW_BUCKET = process.env.RAW_BUCKET;
const PREFIX = 'customers/';
const ENRICHMENT_VERSION = 'v1';

const createCustomer = async (customerData) => {
    const customerId = uuidv4();
    const key = `${PREFIX}${customerId}.json`;

    const customer = {
        id: customerId,
        status: 'NEW',
        createdAt: new Date().toISOString(),
        ...customerData,
    };

    await s3.putJson(RAW_BUCKET, key, customer);
    return customer;
};

const getCustomer = async (customerId) => {
    const key = `${PREFIX}${customerId}.json`;
    return await s3.getJson(RAW_BUCKET, key);
};

const listCustomers = async () => {
    const keys = await s3.listKeys(RAW_BUCKET, PREFIX);
    const customers = [];
    for (const key of keys) {
        const customer = await s3.getJson(RAW_BUCKET, key);
        customers.push(customer);
    }
    return customers;
};

const enrichedExists = async (id) => {
    try {
        await s3.getJson(
            ENRICHED_BUCKET,
            `customers/${id}.json`
        );
        return true;
    } catch {
        return false;
    }
};

const enrichCustomer = async (customerId) => {

    const alreadyEnriched = await enrichedExists(customerId);
    if (alreadyEnriched) {
        return s3.getJson(
            ENRICHED_BUCKET,
            `customers/${customerId}.json`
        );
    }

    const customer = await getCustomer(customerId);

    // Simulated credit score
    const creditScore = Math.floor(Math.random() * 300) + 500;

    const riskBand =
        creditScore >= 750 ? 'LOW' :
            creditScore >= 600 ? 'MEDIUM' :
                'HIGH';

    const enrichedCustomer = {
        ...customer,
        creditScore,
        riskBand,
        status: 'ENRICHED',
        enrichmentVersion: ENRICHMENT_VERSION,
        enrichedAt: new Date().toISOString(),
    };

    const key = `${PREFIX}${customerId}.json`;
    await s3.putJson(ENRICHED_BUCKET, key, enrichedCustomer);

    return enrichedCustomer;
};

module.exports = {
    createCustomer,
    getCustomer,
    listCustomers,
    enrichCustomer,
};