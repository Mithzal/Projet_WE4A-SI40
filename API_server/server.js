require ('dotenv').config();
const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 6666;
const logsRouter = require('./routes/logs');

app.use(express.json())

//database connection
require('./config/database');

app.use(cors());

app.use('/api/logs', logsRouter);

//server running status
app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost: ${PORT}`);
});
