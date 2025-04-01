import fs from "fs";
import path from "path";
import s3Client from "../config/s3.config";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const AWS_S3_BUCKET = Bun.env.AWS_S3_BUCKET;
const AWS_REGION = Bun.env.AWS_REGION;

const uploadToS3 = async (directory, s3Prefix, episodeName) => {
  try {
    const uploadPromises = [];
    const uploadResults = [];
    const files = fs.readdirSync(directory);

    const m3u8FilePath = path.join(directory, `${episodeName}.m3u8`);
    if (fs.existsSync(m3u8FilePath)) {
      let m3u8Content = fs.readFileSync(m3u8FilePath, "utf8");

      const tsFilePattern = new RegExp(`${episodeName}-(\\d+\\.ts)`, "g");
      m3u8Content = m3u8Content.replace(tsFilePattern, `${episodeName}-$1`);

      fs.writeFileSync(m3u8FilePath, m3u8Content);
    }

    const s3PrefixWithSlug = `${s3Prefix}/${episodeName}`;

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileContent = fs.readFileSync(filePath);

      let fileKey;
      const contentType = file.endsWith(".m3u8")
        ? "application/x-mpegURL"
        : "video/MP2T";

      if (file.endsWith(".m3u8")) {
        fileKey = `${s3PrefixWithSlug}/${episodeName}.m3u8`;
      } else {
        fileKey = `${s3PrefixWithSlug}/${file}`;
      }

      const params = {
        Bucket: AWS_S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: contentType,
      };

      const command = new PutObjectCommand(params);

      const uploadPromise = s3Client.send(command).then(() => {
        uploadResults.push({
          file,
          s3Url: `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${fileKey}`,
        });
      });

      uploadPromises.push(uploadPromise);
    }

    await Promise.all(uploadPromises);

    const m3u8File = uploadResults.find((item) => item.file.endsWith(".m3u8"));
    return m3u8File ? m3u8File.s3Url : null;
  } catch (err) {
    throw err;
  }
};

const deleteFromS3 = async (s3Prefix) => {
  try {
    const listParams = {
      Bucket: AWS_S3_BUCKET,
      Prefix: s3Prefix
    };
    
    const listCommand = new ListObjectsV2Command(listParams);
    const listedObjects = await s3Client.send(listCommand);
    
    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return;
    }
    
    for (const object of listedObjects.Contents) {
      const deleteParams = {
        Bucket: AWS_S3_BUCKET,
        Key: object.Key
      };
      
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand);
    }
    
    if (listedObjects.IsTruncated) {
      await deleteFromS3(s3Prefix);
    }
  } catch (err) {
    throw err;
  }
};

export { uploadToS3, deleteFromS3 };
