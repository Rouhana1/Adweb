const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors()); // To allow requests from the React app

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('video'), (req, res) => {
  res.status(200).send({ message: 'Video uploaded successfully!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
