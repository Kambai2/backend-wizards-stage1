const express = require('express');
const cors = require('cors');
const profileRoutes = require('./routes/profiles');
const connectDB = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins
app.use(express.json());

// Routes
app.use('/api/profiles', profileRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Backend Wizards Stage 1 API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});