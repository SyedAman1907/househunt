const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

// Routes
app.use('/api/auth', require('./routes/authRoutes_v2'));
app.use('/api/properties', require('./routes/propertyRoutes_new'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes_v2'));

// Default Route
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => console.log(`Server started on port ${PORT}`));

module.exports = app;