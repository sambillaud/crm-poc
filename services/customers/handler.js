const logger = require('../../lib/logger');
const service = require('./service');

const jsonResponse = (statusCode, body) => ({
    statusCode,
    body: JSON.stringify(body),
});

module.exports.create = async (event) => {
    try {
        const customerData = JSON.parse(event.body);
        if (!customerData.name || !customerData.email) {
            return jsonResponse(400, { message: 'name and email required' });
        }

        const customer = await service.createCustomer(customerData);
        logger.info('Customer created', { customerId: customer.id });
        return jsonResponse(201, customer);
    } catch (error) {
        logger.error('Error creating customer', { error: error.message });
        return jsonResponse(500, { message: 'Internal server error' });
    }
};

module.exports.get = async (event) => {
    try {
        const customerId = event.pathParameters.id;
        const customer = await service.getCustomer(customerId);

        logger.info('Customer retrieved', { customerId });
        return jsonResponse(200, customer);
        
    } catch (error) {
        logger.error('Error retrieving customer', { error: error.message });
        return jsonResponse(404, { message: 'Customer not found' });
    }
;};

module.exports.list = async () => {
    try {
        const customers = await service.listCustomers();
        logger.info('Customers listed', { count: customers.length });
        return jsonResponse(200, customers);
    } catch (error) {
        logger.error('Error listing customers', { error: error.message });
        return jsonResponse(500, { message: 'Internal server error' });
    }
};

module.exports.enrich = async (event) => {
    try {
        const customerId = event.pathParameters.id;
        const enrichedCustomer = await service.enrichCustomer(customerId);

        logger.info('Customer enriched', { 
            customerId: customerId,
            riskBand: enrichedCustomer.riskBand, });
        return jsonResponse(200, enrichedCustomer);
    } catch (error) {
        logger.error('Error enriching customer', { error: error.message });
        return jsonResponse(500, { message: 'Enrichment failed' });
    }
};