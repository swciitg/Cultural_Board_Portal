import fs from 'fs';
import path from 'path';

export const getUploadPage = (req, res) => {
  const uploadedFiles = fs.readdirSync('uploads');
  res.render('index', { files: uploadedFiles, user: req.session.user });
};

export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.redirect('/cultural-board/api/upload');
};

export const deleteFile = (req, res) => {
  const filename = path.basename(req.params.filename || '');
  const uploadsDir = path.resolve('uploads');
  const filePath = path.join(uploadsDir, filename);
  if (!filePath.startsWith(uploadsDir)) {
    return res.status(400).send('Invalid filename.');
  }
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  res.redirect('/cultural-board/api/upload');
};

// Add a default export that aggregates the functions:
export default {
  getUploadPage,
  uploadFile,
  deleteFile,
};
