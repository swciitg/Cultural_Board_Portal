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
  const raw = req.params.filename || '';
  const filename = path.basename(raw);
  if (!filename || filename === '.' || filename === '..') {
    return res.status(400).send('Invalid filename.');
  }
  const uploadsDir = path.resolve('uploads');
  const filePath = path.join(uploadsDir, filename);
  if (filePath !== path.join(uploadsDir, filename) || !filePath.startsWith(uploadsDir)) {
    return res.status(400).send('Invalid filename.');
  }
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    return res.status(400).send('Invalid filename.');
  }
  if (req.method === 'DELETE') {
    return res.status(200).json({ success: true, filename });
  }
  res.redirect('/cultural-board/api/upload');
};

// Add a default export that aggregates the functions:
export default {
  getUploadPage,
  uploadFile,
  deleteFile,
};
