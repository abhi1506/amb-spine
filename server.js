const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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
const jobRoutes = require('./routes/jobRoutes')
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require("./routes/employeeRoute")
const errorHandler = require('./middlewar/errorHandler');
const imageRoutes = require('./routes/imageRoute');
const quotationRoutes = require("./routes/quotationRoutes");

const app = express();

// Connect to MongoDB
connectDB();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173','http://localhost:5174'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));


// Middleware setup
app.use(express.json());
app.use(cookieParser()); 



// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log("Cloudinary configuration:");
console.log("Cloud Name:", process.env.CLOUDINARY_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Not Loaded");

// Routes
app.use('/api', imageRoutes);
app.use('/api', companyRoutes);
app.use('/api', employeeRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/admin/careers', careerRoutes);
app.use("/api", jobRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin',authRoutes);
app.use("/api/quotations", quotationRoutes);


const PORT = process.env.PORT || 5000;

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
