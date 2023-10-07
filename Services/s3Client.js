import { S3Client } from "@aws-sdk/client-s3";
const getS3Client = () => {
 const s3 = new S3Client({
    endpoint: process.env.BUCKET_ENDPOINT,
    region: process.env.AWS_REGION,
    forcePathStyle: false,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  return s3;
}
export default getS3Client;


