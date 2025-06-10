//Import the mongoose module
const mongoose = require('mongoose');

//Set up default mongoose connection
const mongoDB = process.env.MONGO_URL || null;
mongoose.connect(mongoDB)

//eslint-disable-next-line no console
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

