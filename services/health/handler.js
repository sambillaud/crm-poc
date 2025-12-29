const logger = require('../../lib/logger');

module.exports.health = async () => {
    logger.info('Health check requested');
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: 'ok',
            service: 'crm-poc',
            timestamp: new Date().toISOString(),
        }),
    };
};
