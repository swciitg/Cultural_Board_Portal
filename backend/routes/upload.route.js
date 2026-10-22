import path from 'path';
import express from 'express';
import multer from 'multer';
import uploadController from '../controllers/upload.controller.js';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

function sanitizeImageName(name) {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const providedName = req.body.imageName ? sanitizeImageName(req.body.imageName) : Date.now();
    const newFileName = providedName + path.extname(file.originalname);
    cb(null, newFileName);
  }
});

const upload = multer({ storage });

// Protected Routes
router.get('/', authController.isAuthenticated, uploadController.getUploadPage);
router.post('/', authController.isAuthenticated, upload.single('myFile'), uploadController.uploadFile);
router.get('/delete/:filename', authController.isAuthenticated, uploadController.deleteFile);
router.delete('/delete/:filename', authController.isAuthenticated, uploadController.deleteFile);

export default router;
