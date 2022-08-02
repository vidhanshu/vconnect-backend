const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;
require('./helper/db');
const morgan = require('morgan');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());

//routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);


app.get('/', (req, res) => {
    res.send('This is server for the vconnect application');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

