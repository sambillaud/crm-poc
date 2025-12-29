const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const putJson = async (bucket, key, json) => {
    await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(json),
        ContentType: 'application/json',
    }).promise();
};

const getJson = async (bucket, key) => {
    const result = await s3.getObject({
        Bucket: bucket,
        Key: key,
    }).promise();
    return JSON.parse(result.Body.toString('utf-8'));
}

const listKeys = async (bucket, prefix) => {
    const result = await s3.listObjectsV2({
        Bucket: bucket,
        Prefix: prefix,
    }).promise();
    return result.Contents.map(item => item.Key);
}

module.exports = {
    putJson,
    getJson,
    listKeys,
};