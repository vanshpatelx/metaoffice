import { Storage } from '@google-cloud/storage';

// Initialize the Storage client
const storage = new Storage({
  keyFilename: '/path/to/your-service-account-key.json',
  projectId: 'your-google-cloud-project-id',
});

// Generate a signed URL for uploading an image
export const uploadImage = async (bucketName: string, fileName: string, contentType: string): Promise<string> => {
  const bucket = storage.bucket(bucketName);

  // Options for generating a signed URL
  const options = {
    version: 'v4' as const,
    action: 'write' as const,
    expires: Date.now() + 15 * 60 * 1000, // URL valid for 15 minutes
    contentType: contentType,
  };

  // Get a signed URL for the file
  const [url] = await bucket.file(fileName).getSignedUrl(options);

  return url;
};

// // Usage example
// (async () => {
//   const bucketName = 'your-bucket-name';
//   const fileName = 'path/to/image.jpg';
//   const contentType = 'image/jpeg';

//   try {
//     const url = await uploadImage(bucketName, fileName, contentType);
//     console.log(`The signed URL for upload is: ${url}`);
//   } catch (error) {
//     console.error('Error generating signed URL:', error);
//   }
// })();
