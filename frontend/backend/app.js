let express = require('express');
database = require('./database');
bodyParser = require('body-parser');
mongoose = require('mongoose');
cors = require('cors');

const path = require('path');

// connect to mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    console.log("Database connected")
},
error => {
    console.log("Database could't be connectes to:" + error)
})

const postAPI = require('./routes/post.route');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))


// API
app.use(cors());
app.use('/api', postAPI);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



// crearte port 
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log("Connected to port" + port)
})


// error hanler 
app.use(function(err, req, res, next){
    console.error(err.message);
    if(!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
})







