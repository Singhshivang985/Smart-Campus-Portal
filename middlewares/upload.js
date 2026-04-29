const multer = require('multer');
const AppError = require('../utils/appError');
const fs = require('fs');

const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `resource-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image') ||
    file.mimetype === 'application/pdf' ||
    file.mimetype.includes('document') ||
    file.mimetype.includes('zip') ||
    file.mimetype.includes('msword') ||
    file.mimetype.includes('presentation') ||
    file.mimetype.includes('spreadsheet') ||
    file.mimetype.includes('csv')
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Not a supported file type! Please upload only PDFs, documents, images or zip files.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

exports.uploadResourceFile = upload.single('file');
