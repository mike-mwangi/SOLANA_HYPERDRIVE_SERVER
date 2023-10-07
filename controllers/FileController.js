// write a controller for downloading files from s3 bucket
import { GetObjectCommand } from "@aws-sdk/client-s3";
import getS3Client from "../utils/s3Client.js";

export const DownloadFile = async (req, res) => {
  try {
    const s3 = getS3Client();

    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.key,
    };

    const fileStream = await s3.send(new GetObjectCommand(s3Params));

    const parts = req.body.key.split("/");
    const filename = parts[parts.length - 1];

    res.setHeader("Content-Type", fileStream.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    fileStream.Body.pipe(res);
  } catch (err) {
    console.error("Error downloading file:", err);
    return res.status(500).send({ error: err.message });
  }
};
