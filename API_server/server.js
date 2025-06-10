require ('dotenv').config();
const express = require('express');
const app = express();
//const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 6666;
const logsRouter = require('./routes/logs');
const usersRouter = require('./routes/users');
const uesRouter = require('./routes/ues');

app.use(express.json())

//database connection
require('./config/database');

app.use(cors());

app.use('/api/logs', logsRouter);
app.use('/api/users', usersRouter);
app.use('/api/ues', uesRouter);

//server running status
app.listen(PORT, () => {
    console.log(`The app is listening at http://localhost: ${PORT}`);
});
