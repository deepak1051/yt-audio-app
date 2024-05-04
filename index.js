import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import ytdl from 'ytdl-core';
import mongoose from 'mongoose';
import Audio from './Audio.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,

  api_secret: process.env.API_SECRET,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/api/audio', async (req, res) => {
  try {
    const audio = await Audio.find({});

    return res.json(audio);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/upload', async (req, res) => {
  // try {
  const { videoUrl, title } = req.body;

  if (!videoUrl || !title) {
    return res.status(400).json({ error: 'Video URL and title are required' });
  }

  try {
    const audioFilePath = await downloadAndExtractAudio(videoUrl);
    const audioUrl = await uploadToCloudinary(audioFilePath);
    console.log('Audio URL:', audioUrl);

    const audio = await Audio.create({
      title: title,
      url: audioUrl,
    });

    res.json(audio);
  } catch (error) {
    console.error('Error:', error);
  }
});
const downloadAndExtractAudio = async (videoUrl) => {
  return new Promise((resolve, reject) => {
    const audioStream = ytdl(videoUrl, { filter: 'audioonly' });

    const audioFilePath = 'audio.mp3';
    const outputStream = fs.createWriteStream(audioFilePath);

    audioStream.pipe(outputStream);

    outputStream.on('finish', () => {
      console.log('Audio downloaded successfully');
      resolve(audioFilePath);
    });

    outputStream.on('error', (error) => {
      console.error('Error downloading audio:', error);
      reject(error);
    });
  });
};

const uploadToCloudinary = async (audioFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(audioFilePath, {
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Failed to upload audio to Cloudinary: ${error.message}`);
  }
};

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  console.log(__dirname);
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  // const __dirname = path.resolve();
  // app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
