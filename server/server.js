// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const verifyToken = require('./middleware/verifyToken');

const Item = require('./models/item');
const User = require('./models/user');
const Content = require('./models/dashboardModel');
const Pests = require('./models/seasonPest');
const Vendor = require('./models/vendors');
const { error } = require('console');



const app = express();


//predefind email and password for admin login
const users = [{ email: 'admin@example.com', password: 'Admin@123' }]; // Dummy user data
const sudos = [{ email: 'developers@example.com', password: 'Green@123' }]
app.use(cors());
app.use(bodyParser.json());


//database connection 

const mongoURI = 'mongodb://0.0.0.0:27017/DevRk';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('mongodb connected.....'))
  .catch(err => {
    console.log('mongodb connection error:', err);
    process.exit(1);
  });

const secretkey = 'secretkey';



const upload = multer({ storage: multer.memoryStorage() });


//GET methods
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (e) {
    console.error('error fetching users', e);
    res.status(500).send('error fetching users');
  }
}); //fetch the data of mobile app - usersDetails

app.get('/api/pests', async (req, res) => {
  try {
    console.log('Recived request for pests data');
    const pests = await Pests.find({});
    if(!pests || Pests.length === 0){
      return res.status(404).json({error:"no pests found"});
    }
    console.log('Fetched pests data:', pests);
    res.json(pests);
  } catch (e) {
    console.error('Error Fetching pests', e);
    res.status(500).send('Error fetching pests');
  }
}); 
//show the season based pests in Admin panel
// app.get('/api/pests', async (req,res)=>{

//   console.log('Received request for pests data');
//   const pests = await Pests.find({} , (err, pests)=>{
//     if(err){
//       console.error('Error fetching pests data:', err);
//       return res.status(500).json({error:"Error fetching pests data"});
//     }
//     console.log('Fetched pest data:', pests);
//     res.json(pests);
//   });
// });

app.get('/api/pests/:cardId/image/:imageId', async (req, res) => {
  try {
    const { cardId, imageId } = req.params;
    const pest = await Pests.findById(cardId);

    if (pest) {
      const image = pest.images.id(imageId);
    


      if(image){
        res.contentType(image.contentType);
        res.send(image.data);
        return res.status(404).send('Image not found');
      }else{
        if(!res.headersSent){
          res.status(404).send('Image not found');
        }
        
      }

    }else{
        if(!res.headersSent){
          res.status(404).send('pest not found');
        }
     
    }
  
  } catch (e) {
    console.error('Error fetching image:', e);
    if(!res.headersSent){
      res.status(500).send('Error fetching image');
    }
  }
});

app.get('/api/vendors', verifyToken, async (req, res) => {

  try {
    const vendor = await Vendor.find({});
    res.json(vendor);
  } catch (e) {
    console.error('Error fetching vendors:', e);
    res.status(500).send('Error fetching vendors');
  }
}); // get all vendors

app.get('/api/vendors/:id', verifyToken, async (req, res) => {

  try {
    const vendor = await Vendor.findById(req.params.id);
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).send('vendor not found');
    }

  } catch (e) {
    console.error('Error fetching vendors:', e);
    res.status(500).send('Error fetching vendor');
  }

});


//PUT methods


app.put('/api/vendors/:id', verifyToken, async (req, res) => {

  const { name, imageUrl, description, rating } = req.body;

  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { name, imageUrl, description, rating },
      { new: true, runValidators: true }
    );
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).send('Vendors not found');
    }
  } catch (e) {
    console.error('Error updating vendors:', e);
    res.status(500).send('Error updating vendors');
  }
});


//POST methods

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const expirationTime = Math.floor(Date.now() / 1000) + (3 * 30 * 24 * 60 * 60);
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: expirationTime });
    res.json({ token });
    console.log({ token });
  } else {
    console.log('invaild credentials');
    res.status(401).send('Invalid credentials');
  }
}); // Admin panel login auth

app.post('/api/create-content/sudo-login', (req, res) => {
  const { email, password } = req.body;
  const user = sudos.find((u) => u.email === email && u.password === password);

  if (user) {
    const expirationTime = Math.floor(Date.now() / 1000) + (3 * 30 * 24 * 60 * 60);
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: expirationTime });
    res.json({ token });
    console.log({ token });
  } else {
    console.log('invaild credentials');
    res.status(401).send('Invalid credentials');
  }
}); //Admin panel - createcontent page login auth


app.post('/api/Content', verifyToken, upload.single('image'), (req, res) => {
  const { title, body } = req.body;
  const image = req.file ? req.file.filename : '';

  const newContent = new Content({
    title,
    body,
    image
  });

  newContent.save((err) => {
    if (err) {
      console.error('error saving content:', e);
      return res.status(500).send('Error saving..');
    }
    res.status(201).send('saved successfully');
  });
}); // Add the pests data in Admin panel


app.post('/api/pests', verifyToken, upload.array('images'), async (req, res) => {
  const { id, pestName, month } = req.body;
  const images = req.files.map(file => ({
    data: file.buffer,
    contentType: file.mimetype,
  }));

  try {
    if (id) {
      const pest = await Pests.findById(id);
      if (pest) {
        pest.pestName = pestName;
        pest.month = month;
        pest.images = images.length ? images : pest.images;
        await pest.save();
        res.json(pest);
      } else {
        res.status(404).send('Pest not found');
      }
    } else {
      const newPest = new Pests({ pestName, month, images });
      await newPest.save();
      res.json(newPest);
    }
  } catch (e) {
    console.error('Error saving pest:', e);
    res.status(500).send('Error saving pest');
  }
});


app.post('/api/vendors', verifyToken, async (req, res) => {
  const { name, imageUrl, description, rating } = req.body;

  const newVendor = new Vendor({
    name,
    imageUrl,
    description,
    rating
  });

  try {
    const savedVendor = await newVendor.save();
    res.status(201).json(savedVendor);
  } catch (e) {
    console.error('Error creating vendor:', e);
    if (e.errors) {
      const validationErrors = {};
      for (const field in e.errors) {
        validationErrors[field] = e.errors[field].message;
      }
      res.status(400).json({ message: 'validation error', errors: validationErrors });
    } else {
      res.status(500).send('Error creating vendor');
    }

  }
});



//DELETE methods
app.delete('/api/pests/:id', verifyToken, async (req, res) => {
  try {
    await Pests.findByIdAndDelete(req.params.id);
    res.json({ message: 'pest deleted' });
  } catch (e) {
    console.error('Error deleteing pest:', e);
    res.status(500).send('Error deleting pest');
  }
}); // delete the pests details 



app.delete('/api/vendors/:id', verifyToken, async (req, res) => {

  try {

    await Vendor.findByIdAndDelete(req.params.id);
    res.json({ message: 'vendor deleted' });
  } catch (e) {
    console.error('Error deleting vendor', e);
    res.status(500).send('Error deleting vendor');
  }

});




//server port status

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
