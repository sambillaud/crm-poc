const logger = require('../../lib/logger');
const customerService = require('../customers/service');

module.exports.run = async (event) => {
    const { customerId, requestId } = JSON.parse(event.Records[0].body);

    logger.info('Enrichment handler started', { customerId, requestId });

    const enrichCustomer = await customerService.enrichCustomer(customerId);
    
    logger.info('Enrichment handler completed', {
        customerId,
        riskBand: enrichCustomer.riskBand,
        version: enrichCustomer.version
    });
};