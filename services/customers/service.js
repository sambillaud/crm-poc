const { v4: uuidv4 } = require('uuid');
const s3 = require('../../lib/s3');

const RAW_BUCKET = process.env.RAW_BUCKET;
const PREFIX = 'customers/';

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

module.exports = {
    createCustomer,
    getCustomer,
    listCustomers,
};