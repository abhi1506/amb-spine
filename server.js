const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2; 
const cookieParser = require('cookie-parser');

dotenv.config();

// Import routes
const companyRoutes = require('./routes/companyRoutes');
const teamRoutes = require('./routes/teamRoutes');
const careerRoutes = require('./routes/careerRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const jobRoutes = require('./routes/jobRoutes');
const contactRoutes = require('./routes/contactRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require("./routes/employeeRoute");
const errorHandler = require('./middlewar/errorHandler');
const imageRoutes = require('./routes/imageRoute');
const quotationRoutes = require("./routes/quotationRoutes");

const app = express();
const envMode = process.env.NODE_ENV?.trim() || 'DEVELOPMENT';
const port = process.env.PORT || 3000;

// Validate environment variables
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("Cloudinary configuration missing. Check environment variables.");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Middleware setup
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  console.log("Cloudinary configuration:");
  console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
  console.log("API Key:", process.env.CLOUDINARY_API_KEY);
  console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Not Loaded");
}

// Routes
app.use('/api', imageRoutes);
app.use('/api', companyRoutes);
app.use('/api', employeeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin/careers', careerRoutes);
app.use('/api', jobRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/quotations', quotationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error handling middleware
app.use(errorHandler);

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port} in ${envMode} mode.`);
});
