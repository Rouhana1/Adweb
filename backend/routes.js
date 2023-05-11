const express = require('express');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const router = express.Router();

router.post('/convert-video', async (req, res) => {
  const { videoName } = req.body;

  if (!videoName) {
    return res.status(400).json({ error: 'Video name is required' });
  }

  const inputFile = `./uploads/${videoName}`;
  const outputFile = `./uploads/${videoName.split('.')[0]}.mov`;

  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputFile)
        .output(outputFile)
        .on('end', () => {
          fs.unlink(inputFile, (err) => {
            if (err) {
              console.error('Error deleting original video file:', err);
            } else {
              console.log('Original video file deleted');
              resolve();
            }
          });
        })
        .on('error', reject)
        .run();
    });

    res.json({ success: true, message: 'Conversion complete', newVideoName: `${videoName.split('.')[0]}.mov` });
  } catch (error) {
    res.status(500).json({ error: 'Error converting video' });
    console.error('Error converting video:', error);
  }
});

router.post('/delete-video', async (req, res) => {
  const { videoName } = req.body;
  if (!videoName) {
    return res.status(400).json({ error: 'Video name is required' });
  }

  const filePath = `./uploads/${videoName}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting video file:', err);
      return res.status(500).json({ error: 'Error deleting video' });
    } else {
      console.log('Video file deleted');
      return res.json({ success: true, message: 'Video deleted successfully' });
    }
  });
});


module.exports = router;
