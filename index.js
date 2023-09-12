const express = require('express');
const dbConnect = require('./config/dbconnect');
const dotenv = require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/auth_route");
const bodyParser = require('body-parser');
const {errorHandler} =require('./middlewares/error_handlers')

dbConnect();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



app.use('/api/user',authRouter);
app.use(errorHandler);

app.listen(PORT, () =>  {
    console.log(`Server is running at PORT ${PORT}`);
})