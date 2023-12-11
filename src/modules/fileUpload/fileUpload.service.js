const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../../config/config');

const spacesEndpoint = new AWS.Endpoint(`https://${process.env.DO_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY,
});
 
const uploadFileToS3 = async (file) => {
    try {
        const fileName = file.originalname;
        const params = {
            Bucket: process.env.DO_SPACES_NAME,
            Key: fileName,
            Body: file.buffer,
            ACL: 'public-read',
        };
        const uploadData = await s3.upload(params).promise();
        return uploadData.Location;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw new Error('Error uploading file.');
    }
};
 

module.exports = {
  uploadFileToS3
};