import multer from "multer";
import fs from "fs";

const UPLOAD_IMAGE_DIR = Bun.env.UPLOAD_IMAGE_DIR;
const UPLOAD_VIDEO_DIR = Bun.env.UPLOAD_VIDEO_DIR;

const initDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const removeFileTemp = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const removeFolderTemp = (path) => {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true, force: true });
  }
};

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("INVALID_FILE_TYPE"));
  }
  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_VIDEO_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const videoFilter = (req, file, cb) => {
  const validVideoTypes = [
    "video/mp4",
    "video/x-msvideo",
    "video/x-matroska",
    "video/quicktime",
    "video/x-flv",
    "video/x-ms-wmv",
    "video/mpeg",
    "video/webm",
  ];

  if (!validVideoTypes.includes(file.mimetype)) {
    return cb(new Error("INVALID_VIDEO_FORMAT"));
  }

  cb(null, true);
};

const videoUpload = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
});

export { imageUpload, videoUpload, initDir, removeFolderTemp, removeFileTemp };