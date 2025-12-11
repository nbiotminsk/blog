import multer from 'multer';
import path from 'path';
import { config } from '../config';
import { generateTempFilename } from '../utils/fileOps';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.tempStoragePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = generateTempFilename('upload', ext);
    cb(null, filename);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = ['.docx', '.html', '.htm', '.odt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${ext}. Allowed types: ${allowedExtensions.join(', ')}`
      )
    );
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
