const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const moment = require("moment");

const routeAPI = require("./routes/index.route");

require("dotenv").config();

// connect to mongoDB
const database = require("./config/database");
database.connect();

const app = express();
const port = process.env.PORT;

// Cấu hình cookies & session
app.use(cookieParser("KWJFKWEIFHW"));
app.use(
    session({
        secret: "KWJFKWEIFHW",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 60000 },
    })
);

// Dịch vụ tĩnh (thư mục public)
app.use(express.static("public"));

// Override phương thức HTTP (PUT, DELETE qua form)
app.use(methodOverride("_method"));

// API Cho phép CORS
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//Route
routeAPI(app);

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
);
// End TinyMCE

// error hanler
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

// crearte port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
