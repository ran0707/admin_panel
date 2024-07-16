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

const Item = require('./models/item'); // Import the Item model
const User = require('./models/user');
const Content = require('./models/dashboardModel');
const Pests = require('./models/seasonPest');
//const { upload } = require('@testing-library/user-event/dist/upload');

const app = express();


//predefind email and password for admin login
const users = [{ email: 'admin@example.com', password: 'Admin@123' }]; // Dummy user data
const sudos = [{email:'developers@example.com', password:'Green@123'}]
app.use(cors());
app.use(bodyParser.json());

//create upload directory 

const uploadDir = path.join(__dirname, 'uploads');
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}




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
    const token = jwt.sign({ email }, 'secretkey', { expiresIn: '4h' });
    res.json({ token });
    console.log({token});
  } else {
    console.log('invaild credentials');
    res.status(401).send('Invalid credentials');
  }
});

app.post('/api/create-content/sudo-login', (req, res) => {
  const { email, password } = req.body;
  const user = sudos.find((u) => u.email === email && u.password === password);

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

app.get('/api/pests', verifyToken, async(req, res)=>{
  try{
    const pests = await Pests.find({});
    res.json(pests);
  }catch(e){
    console.error('Error Fetching pests', e);
    res.status(500).send('Error fetching pests');
  }
});

//create and update the content

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


app.post('/api/pests', verifyToken, upload.array('images'), async(req, res)=>{
  const {id, pestName, month} = req.body;
  const images = req.files.map(file => `/uploads/${file.filename}`);

  try{
    if(id){
      const pests = await Pests.findById(id);
      if(pests){
        pests.pestName = pestName;
        pests.month = month;
        pests.images = images.length ? images : pests.images;
        await pests.save();
        res.json(pests);
      }else{
        res.status(404).send('pest not found');
      }
    }else{
      const newPests = new Pests({pestName, month, images});
      await newPests.save();
      res.json(newPests);
    }
  }catch(e){
    console.error('Error saving pest:', e);
    res.status(500).send('Error saving pest');
  }
});

//deleteing content

app.delete('/api/pests/:id', verifyToken, async(req, res) => {
  try{
    await Pests.findByIdAndDelete(req.params.id);
    res.json({message: 'pest deleted'});
  }catch(e){
    console.error('Error deleteing pest:', e);
    res.status(500).send('Error deleting pest');
  }
});

//server port status

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
