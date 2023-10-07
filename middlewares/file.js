import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 80 * 1024 * 1024, // no larger than 80mb, you can change as needed.
  },
});
const fields = [{ name: "logo" }, { name: "certificateOfIncorporation" }];

export const uploads = upload.fields(fields);
