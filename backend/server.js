const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const routes = require('./routes');


const app = express();
const session = require('express-session');
app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/api', routes);
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
  })
);

const ffmpeg = require('fluent-ffmpeg');


const uri = 'mongodb+srv://mrouhana:cocomango@adweb.1r55vzl.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

(async () => {
  try {
    await client.connect();
    const db = client.db('video_requests');
    const requestsCollection = db.collection('requests');
    const publishersCollection = db.collection('publishers');
    const stationsCollection = db.collection('stations');


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

app.put('/requests/deny/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const deniedRequest = {
      ...req.body,
      denied: true
    };
    delete deniedRequest._id; // Exclude the _id field from the update
    await db.collection('requests').updateOne({ _id: id }, { $set: deniedRequest });
    res.status(200).send('Request denied successfully');
  } catch (error) {
    console.error('Error denying request:', error);
    res.status(500).send('Error denying request');
  }
});


app.delete('/requests/denied/:id', async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await requestsCollection.deleteOne({ _id: id });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Denied request deleted.' });
    } else {
      res.status(404).json({ success: false, message: 'Denied request not found.' });
    }
  } catch (error) {
    console.error('Error deleting denied request:', error);
    res.status(500).send('Error deleting denied request');
  }
});


app.post('/time-slots', async (req, res) => {
  try {
    const timeSlot = { timeOption: req.body.timeOption, pricePerAd: req.body.pricePerAd};
    await db.collection('time_slots').insertOne(timeSlot);
    res.json({ success: true, message: 'Time slot added.' });
  } catch (error) {
    console.error('Error adding time slot:', error);
    res.status(500).send('Error adding time slot');
  }
});


app.get('/time-slots', async (req, res) => {
  try {
    const timeSlots = await db.collection('time_slots').find({}).toArray();
    res.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).send('Error fetching time slots');
  }
});

app.delete('/time-slots/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.collection('time_slots').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Time slot deleted.' });
    } else {
      res.status(404).json({ success: false, message: 'Time slot not found.' });
    }
  } catch (error) {
    console.error('Error deleting time slot:', error);
    res.status(500).send('Error deleting time slot');
  }
});

app.post('/requests', async (req, res) => {
  try {
    // Check if the requested time slot is available
    const requestedDate = req.body.date;
    const requestedStartTime = req.body.startTime;
    const requestedEndTime = req.body.endTime;

    const availableTimeSlots = await db.collection('time_slots').find({ date: requestedDate }).toArray();
    const isRequestedTimeSlotAvailable = availableTimeSlots.some(slot => slot.startTime <= requestedStartTime && slot.endTime >= requestedEndTime);

    if (!isRequestedTimeSlotAvailable) {
      res.status(400).json({ success: false, message: 'Requested time slot is not available.' });
      return;
    }

    const request = { video: req.body.video, date: req.body.date, startTime: req.body.startTime, endTime: req.body.endTime};
    await db.collection('requests').insertOne(request);
    res.json({ success: true, message: 'Request submitted.' });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).send('Error submitting request');
  }
});
app.get('/time-options', async (req, res) => {
  try {
    const timeSlots = await db.collection('time_slots').find({}).toArray();
    res.json(timeSlots);
  } catch (error) {
    console.error('Error fetching time slots:', error);
    res.status(500).send('Error fetching time slots');
  }
});

   // Add publisher
   app.post('/publishers', async (req, res) => {
    try {
      const publisher = { name: req.body.name, username: req.body.username, password: req.body.password };
      const result = await publishersCollection.insertOne(publisher);
      res.json(result.ops[0]); // Return the new publisher
    } catch (error) {
      console.error('Error adding publisher:', error);
      res.status(500).send('Error adding publisher');
    }
  });

  // Get publishers
  app.get('/publishers', async (req, res) => {
    try {
      const publishers = await publishersCollection.find({}).toArray();
      res.json(publishers);
    } catch (error) {
      console.error('Error fetching publishers:', error);
      res.status(500).send('Error fetching publishers');
    }
  });

  // Add station
  app.post('/stations', async (req, res) => {
    try {
      const station = { name: req.body.name, username: req.body.username, password: req.body.password };
      const result = await stationsCollection.insertOne(station);
      res.json(result.ops[0]); // Return the new station
    } catch (error) {
      console.error('Error adding station:', error);
      res.status(500).send('Error adding station');
    }
  });

  // Get stations
  app.get('/stations', async (req, res) => {
    try {
      const stations = await stationsCollection.find({}).toArray();
      res.json(stations);
    } catch (error) {
      console.error('Error fetching stations:', error);
      res.status(500).send('Error fetching stations');
    }
  });
    // Delete publisher
    app.delete('/publishers/:id', async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const result = await publishersCollection.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
          res.json({ success: true, message: 'Publisher deleted.' });
        } else {
          res.status(404).json({ success: false, message: 'Publisher not found.' });
        }
      } catch (error) {
        console.error('Error deleting publisher:', error);
        res.status(500).send('Error deleting publisher');
      }
    });
  
    // Delete station
    app.delete('/stations/:id', async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const result = await stationsCollection.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
          res.json({ success: true, message: 'Station deleted.' });
        } else {
          res.status(404).json({ success: false, message: 'Station not found.' });
        }
      } catch (error) {
        console.error('Error deleting station:', error);
        res.status(500).send('Error deleting station');
      }
    });
  
    app.post('/login', async (req, res) => {
      try {
        const {username, password} = req.body;
        const publisher = await publishersCollection.findOne({username: username, password: password});
        
        if (publisher) {
          res.json({ success: true, message: 'Logged in successfully.' });
        } else {
          res.status(401).json({ success: false, message: 'Username or password is incorrect.' });
        }
      } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Error during login');
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
