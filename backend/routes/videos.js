const router = require('express').Router();
const path = require('path');
const { nanoid } = require('nanoid');

module.exports = (db) => {
  router.get('/', async (req, res) => {
    try {
      const videos = db.get('videos').value();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching videos' });
    }
  });

  router.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const video = req.files.video;

    const fileExtension = path.extname(video.name);
    const newFileName = `${nanoid()}.${fileExtension}`;

    video.mv(path.join(__dirname, '../uploads', newFileName), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error uploading video' });
      }

      const videoObj = {
        id: nanoid(),
        title: video.name,
        fileName: newFileName,
      };

      db.get('videos').push(videoObj).write();

      res.json(videoObj);
    });
  });

  return router;
};
