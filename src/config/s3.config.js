import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY = Bun.env.AWS_ACCESS_KEY;
const AWS_SECRET_ACCESS_KEY = Bun.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = Bun.env.AWS_REGION;

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export default s3Client;
