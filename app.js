const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);

const con = require('./public/sqlcon');
const sessionStore = new MySQLStore({}, con.promise());

require('dotenv').config();
const poiRouter = require('./public/routes/poi');
const corsMiddleware = require('./public/corsMiddleware');



app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.use(corsMiddleware);

app.use(expressSession({
    store: sessionStore,
    secret: 'ToBeOrNotToBe',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: 'destroy',
    proxy: true,
    cookie: {
        maxAge: 600000, // 600000 ms = 10 mins expiry time
        httpOnly: false
    }
}));

// Login route
app.post('/login', (req, res) => {
    console.log(req.body)
    con.query(`SELECT * FROM poi_users WHERE username=? AND password=?`,
        [req.body.username, req.body.password], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: error });
                console.log(error)
            } else {
                if (results.length == 1) {
                    req.session.username = req.body.username;
                    res.json({ "username": req.body.username });
                } else {
                    window.alert("incorrect login info");
                }
            }
        });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session = null;
    res.json({ 'success': 1 });
});

// 'GET' login route - useful to obtain currently logged in user
app.get('/login', (req, res) => {
    res.json({ username: req.session.username || null });
});

//Middleware which protects any routes using POST or DELETE from access by users who are are not logged in
app.use((req, res, next) => {
    if (["POST", "DELETE"].indexOf(req.method) == -1) {
        next();
    } else {
        if (req.session.username) {
            next();
        } else {
            res.status(401).json({ error: "You must be logged in" });
            console.log("not logged in")
        }
    }
});

app.use('/poi', poiRouter);
app.listen(3000);
