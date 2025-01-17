import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure storage for photos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    const userDir = path.join('upload/photo', userId);
    
    // Create user directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.body.userId;
    const userDir = path.join('upload/videos', userId);
    
    // Create user directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filters
const photoFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
  }
};

const videoFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM and QuickTime videos are allowed.'), false);
  }
};

// Configure multer for photos
const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: photoFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Configure multer for videos
const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Photo upload endpoint
router.post('/photo', uploadPhoto.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/photo/${req.body.userId}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Video upload endpoint
router.post('/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const fileUrl = `/uploads/videos/${req.body.userId}/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;