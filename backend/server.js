const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const UPLOADS_DIR = 'uploads';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video'), (req, res) => {
  res.status(200).send('Video uploaded successfully');
});

app.get('/uploads', (req, res) => {
  fs.readdir(UPLOADS_DIR, (err, files) => {
    if (err) {
      console.error('Error reading uploads directory:', err);
      res.status(500).send('Error reading uploads directory');
      return;
    }

    res.status(200).send(files);
  });
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename.replace(/%20/g, ' ');
  res.download(path.join(UPLOADS_DIR, filename));
});

// Requests
let requests = [];

app.get('/requests', (req, res) => {
  res.status(200).send(requests);
});

app.post('/requests', (req, res) => {
  const newRequest = {
    video: req.body.video,
    date: req.body.date,
  };

  requests.push(newRequest);
  res.status(201).send('Request submitted successfully');
});

app.delete('/requests/:index', (req, res) => {
  const index = req.params.index;
  if (index < requests.length && index >= 0) {
    requests.splice(index, 1);
    res.status(200).send('Request deleted successfully');
  } else {
    res.status(404).send('Request not found');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
