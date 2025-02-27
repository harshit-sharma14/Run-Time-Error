//Harshit14

const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose=require('mongoose')
const Users=require('./models/Users')


dotenv.config();
const app = express();
//Hacathon01
// Middleware
app.use(cors({
    credentials:true,
    origin:'http://localhost:5173'
}))
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("🚀 MongoDB Connected Successfully!"))
  .catch((err) => console.log("Database Connection Error:", err));
  const PORT = process.env.PORT || 5000;


  //register
  app.post('/register', async (req, res) => {
    try {
      const { name, email, password, linkedinProfile, role, skills, careerGoals } = req.body;
  
      // Check if user already exists
      let user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: 'User already exists' });
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with all fields
      user = new Users({
        name,
        email,
        password: hashedPassword,
        linkedinProfile,
        role: role || 'user', // Default to 'user' if role is not provided
        skills: skills || [], // Default to empty array if skills are not provided
        careerGoals: careerGoals || [], // Default to empty array if careerGoals are not provided
      });
  
      // Save the user to the database
      await user.save();
  
      // Respond with success message
      res.status(201).json({ msg: 'User registered successfully', user });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });

    //login

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if user exists
      const user = await Users.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
  
      // Generate JWT token
      const payload = { user: { id: user.id, role: user.role } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  //auth middleware
  const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  //GET INFO
  app.get('/me', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));