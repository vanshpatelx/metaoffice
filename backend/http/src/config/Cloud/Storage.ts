import AWS from 'aws-sdk';
import { config } from '../config';

AWS.config.update({
  accessKeyId: config.AWS_S3.accessKeyId, 
  secretAccessKey: config.AWS_S3.secretAccessKey,
  region: config.AWS_S3.region,
});
const s3 = new AWS.S3();

// Generate a signed URL for uploading an image
export const uploadImage = async (bucketName: string, fileName: string): Promise<string> => {

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Expires: 900,
    ContentType: 'image/*',  // Supports any image type (jpeg, png, webp, etc.)
  };

  return s3.getSignedUrlPromise('putObject', params);
};
