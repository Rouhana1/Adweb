const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const routes = require('./routes');


const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/api', routes);



const uri = 'mongodb+srv://mrouhana:cocomango@adweb.1r55vzl.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    const db = client.db('video_requests');
    const requestsCollection = db.collection('requests');

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const upload = multer({ storage: storage });

    app.post('/upload', upload.single('video'), (req, res) => {
      res.json({ success: true, message: 'Video uploaded successfully.' });
    });

    app.get('/uploads', async (req, res) => {
      fs.readdir('./uploads', (err, files) => {
        if (err) {
          console.error('Error reading uploads directory:', err);
          res.status(500).send('Error reading uploads directory');
        } else {
          res.json(files);
        }
      });
    });

    app.get('/uploads/:video', (req, res) => {
      const video = req.params.video;
      const filePath = path.join(__dirname, 'uploads', video);
      res.download(filePath);
    });

    app.post('/requests', async (req, res) => {
      try {
        const request = { video: req.body.video, date: req.body.date, peakTime:req.body.peakTime};
        await requestsCollection.insertOne(request);
        res.json({ success: true, message: 'Request submitted.' });
      } catch (error) {
        console.error('Error submitting request:', error);
        res.status(500).send('Error submitting request');
      }
    });

    app.get('/requests', async (req, res) => {
      try {
        const requests = await requestsCollection.find({}).toArray();
        res.json(requests);
      } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).send('Error fetching requests');
      }
    });

    app.delete('/requests/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await requestsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.json({ success: true, message: 'Request deleted.' });
        } else {
          res.status(404).json({ success: false, message: 'Request not found.' });
        }
      } catch (error) {
        console.error('Error deleting request:', error);
        res.status(500).send('Error deleting request');
      }
    });

// Add this route after the DELETE request route
app.put('/requests/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const updatedRequest = req.body;
    delete updatedRequest._id; // Exclude the _id field from the update
    await db.collection('requests').updateOne({ _id: id }, { $set: updatedRequest });
    res.status(200).send('Request updated successfully');
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).send('Error updating request');
  }
});


    

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
})();  