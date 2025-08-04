const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const fileRoutes = require('./routes/fileRoutes');

const app = express();
app.use(cors({
  origin: ['https://devsandbox-sigma.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB Connected');
});

app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
