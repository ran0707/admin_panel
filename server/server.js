// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const verifyToken = require('./middleware/verifyToken');

const Item = require('./models/item'); // Import the Item model
const User = require('./models/user');
const Content = require('./models/dashboard');
//const { upload } = require('@testing-library/user-event/dist/upload');

const app = express();


//predefind email and password for admin login
const users = [{ email: 'admin@example.com', password: 'password' }]; // Dummy user data

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



// Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization; // Extract token from "Bearer <token>"

//   if (!token) return res.status(403).send('Token is required');

//   jwt.verify(token, secretkey, (err, decode) => {
//     if (err) return res.status(403).send('Failed to authenticate');

//     req.decode = decode;
//     next();
//   });
// };

// for file upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, 'uploads/');
  },
  filename: (req, file, cb)=>{
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({storage});

//login api

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
    console.log({token});
  } else {
    console.log('invaild credentials');
    res.status(401).send('Invalid credentials');
  }
});


//fetching the data form database to display in admin panel

app.get('/api/users', verifyToken, async (req, res)=>{
   try{
    const users = await User.find({});
    res.json(users);
   }catch(e){
    console.error('error fetching users', e);
    res.status(500).send('error fetching users');
   }
});


//update the content to save the database for mobile app content

app.post('/api/Content', verifyToken, upload.single('image'), (req, res) =>{
  const {title, body} = req.body;
  const image = req.file ? req.file.filename: '';

  const newContent = new Content({
    title,
    body, 
    image
  });

  newContent.save((err)=>{
    if(err) {
      console.error('error saving content:', e);
      return res.status(500).send('Error saving..');
    }
    res.status(201).send('saved successfully');
  });
});


//server port status

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
