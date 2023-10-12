import {
    DeleteObjectCommand,
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsCommand,
    PutObjectCommand
} from "@aws-sdk/client-s3";
import getS3Client from "./s3Client.js";

export async function deleteAllDocumentFiles(prefix) {
  const s3 = getS3Client();
  console.log("prefix", prefix);
  console.log("process.env.BUCKET_NAME", process.env.BUCKET_NAME);
  const listObjectsCommand = new ListObjectsCommand({
    Bucket: process.env.BUCKET_NAME,
    Prefix: prefix,
  });

  const listedObjects = await s3.send(listObjectsCommand);
  console.log("here");
  if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: process.env.BUCKET_NAME,
    Delete: { Objects: [] },
    Quiet: true,
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  await s3.send(deleteCommand);

  if (listedObjects.IsTruncated) await deleteAllProjectFiles(prefix);
}

export const uploadFilesToS3 = async (files, path = "") => {
  try {
    const s3 = getS3Client();
    const PUBLIC_FIELDS = ["images"];
    const MULTIPLE_FILES_FIELDS = ["images"];

    if (!files) {
      return;
    }

    const fileUploadPromises = [];
    const fieldName2Key = {};

    for (const [fieldname, filedata] of Object.entries(files)) {
      const isPublic = PUBLIC_FIELDS.includes(fieldname);
      const isMultipleFiles = MULTIPLE_FILES_FIELDS.includes(fieldname);
      // check if filedata is an array
      if (isMultipleFiles) {
        fieldName2Key[fieldname] = [];
      }
      for (const file of filedata) {
        const filename = file.originalname;
        const key = path !== "" ? `${path}/${filename}` : filename;

        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: isPublic ? "public-read" : "private",
        });

        const bucketEndpoint = process.env.BUCKET_ENDPOINT;
        const url = `${bucketEndpoint}/${process.env.BUCKET_NAME}/${key}`;

        // if the field has multiple files , return a list of objects, else return a single object
        if (isMultipleFiles) {
          fieldName2Key[fieldname] = [
            ...fieldName2Key[fieldname],
            {
              bucket: process.env.BUCKET_NAME,
              key,
              url,
              status: "uploaded",
              name: filename,
            },
          ];
        } else {
          fieldName2Key[fieldname] = {
            bucket: process.env.BUCKET_NAME,
            key,
            url,
            status: "uploaded",
            name: filename,
          };
        }
        fileUploadPromises.push(s3.send(command));
      }
    }

    await Promise.all(fileUploadPromises);
    return fieldName2Key;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getDeleteFileCommand = async (field) => {
  const isMultipleFiles = Array.isArray(field);
  let deleteCommand = null;
  if (isMultipleFiles) {
    // use DeleteObjectsCommand if the field has multiple files
    const objects = field.map((file) => {
      return { Key: file.key };
    });
    deleteCommand = new DeleteObjectsCommand({
      Bucket: process.env.BUCKET_NAME,
      Delete: {
        Objects: objects,
      },
    });
  } else {
    deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: field.key,
    });
  }

  return deleteCommand;
};

export const uploadOrReplaceFilesOnS3 = async (doc, files, path) => {
  if (!files) {
    console.error("No files provided");
    return;
  }

  const fileDeletePromises = doc
    ? Object.entries(files)
        .filter(([fieldname]) => doc[fieldname])
        .map(([fieldname]) => getDeleteFileCommand(doc[fieldname]))
    : [];

  try {
    await Promise.all(fileDeletePromises);
    return await uploadFilesToS3(files, path);
  } catch (error) {
    console.error("Error during S3 operation:", error);
    throw error;
  }
};

export const DownloadFile = async (req, res) => {
  try {
    const s3 = getS3Client();

    const s3Params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.filePath,
    };

    // Retrieve the file from S3
    const fileStream = await s3.send(new GetObjectCommand(s3Params));
    const parts = req.body.filePath.split("/");
    const filename = parts[parts.length - 1];

    res.setHeader("Content-Type", fileStream.ContentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    fileStream.Body.pipe(res);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
};
