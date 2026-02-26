const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const Doctor = require('./models/Doctor')
const Category = require('./models/Category')
const connectDB = require('./config/db')
const userRouter = require('./routes/userRoutes');
const { log } = require('console');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const app = express();
const PORT = process.env.PORT || 3001;
connectDB()

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });



// API Routes

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// Create category
app.post('/api/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
});

// Delete category
app.delete('/api/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
});

// Doctor Routes

app.get('/api/doctors', async (req, res) => {   //All doctors
  try {
    const doctors = await Doctor.find().populate('category').sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Create doctor
app.post('/api/doctors', upload.single('image'), async (req, res) => {
  try {
    const doctorData = {
      ...req.body,
      experience: parseInt(req.body.experience),
      availability: req.body.availability ? req.body.availability.split(',').map(d => d.trim()) : undefined
    };
    
    if (req.file) {
      doctorData.image = `/uploads/${req.file.filename}`;
    }

    // Get category name
    const category = await Category.findById(req.body.category);
    if (category) {
      doctorData.categoryName = category.name;
    }

    const doctor = new Doctor(doctorData);
    await doctor.save();
    
    const populatedDoctor = await Doctor.findById(doctor._id).populate('category');
    res.status(201).json(populatedDoctor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating doctor', error: error.message });
  }
});

// Delete doctor
app.delete('/api/doctors/:id', async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
});

// Get doctors by category
app.get('/api/doctor_by_category', async (req, res) => {
  try {
    const { category } = req.query;
    console.log("query param: ",category);
    
    if (!category) {
      const doctors = await Doctor.find().populate('category').sort({ createdAt: -1 });
      return res.json(doctors);
    }
    
    // Search by category name (case-insensitive)
    const doctors = await Doctor.find({
      categoryName: { $regex: category, $options: 'i' }
    }).populate('category').sort({ createdAt: -1 });
    
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

// Get doctor by ID
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('category');
    console.log("req param: ",req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
});


app.use('/api/user', userRouter)

// Serve the admin panel
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
});
