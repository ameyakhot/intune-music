const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const fs = require("fs");
const path = require("path");
const util = require("util");
const stream = require("stream");
const s3Client = require("./s3-config");

// Convert callback-based stream.pipeline to promise-based
const pipeline = util.promisify(stream.pipeline);

exports.uploadFile = async (filePath, bucketName, key) => {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
  };

  await s3Client.send(new PutObjectCommand(params));
  console.log("Upload Success", key);
};

exports.downloadFile = async (bucketName, objectKey) => {
  // this has to be one folder behind
  var downloadPath = path.join(__dirname, "..", "public");
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
    console.log("Public directory created at:", downloadPath);
  }

  downloadPath = path.join(downloadPath, objectKey)

  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };

  const { Body } = await s3Client.send(new GetObjectCommand(params));

  if (Body instanceof stream.Readable) {
    await pipeline(Body, fs.createWriteStream(downloadPath));
    console.log(`File downloaded successfully to ${downloadPath}`);
    return true
  } else {
    throw new Error("Downloaded Body is not a readable stream.");
    return false
  }
};

exports.generatePresignedUrl = async (
  fileName,
  bucketName,
  expiration = 3600
) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: expiration,
  };

  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(s3Client, command, { expiresIn: expiration });
  console.log(`Pre-Signed URL: ${url}`);
  return url;
};
