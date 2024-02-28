const { S3Client } = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config({ path: "./aws.env" });

const s3Client = new S3Client({
  region: process.env.AWS_REGION, // Ensure you have this in your aws.env
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3Client;
