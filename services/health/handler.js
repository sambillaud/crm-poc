module.exports.health = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      service: 'crm-poc',
      timestamp: new Date().toISOString(),
    }),
  };
};
