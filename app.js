//                  Notes
//
//      apply same changes to poi create form that were applied to review creating form
//      try to fix the logout button being displayed when not logged in.
//      style the header
//      arranje the routes properly in seperate files
//

const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'poidb'
});

const sessionStore = new MySQLStore({}, con.promise());

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());
app.use(corsMiddleware);

con.connect(err => {
    if (err) {
        console.log(`Error connecting to mysql: ${err}`);
        process.exit(1);
    } else {
        console.log('connected to mysql');
        app.listen(3000);
    }
});

function corsMiddleware(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
}

app.use(expressSession({
    store: sessionStore,
    secret: 'BinnieAndClyde',
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
                    //res.status(401).json({ error: "Incorrect login Info!" });
                }
            }
        });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session = null;
    res.json({ 'success': 1 });
});

// 'GET' login route - useful for clients to obtain currently logged in user
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

// Query to return POI with same region
app.get('/poi/region/:region', (req, res) => {
    con.query(`SELECT * FROM poidb WHERE region=?`,
        [req.params.region], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.json(results);
            }
        });
});

// Query to add a review
app.post('/poi/poidb/poi_reviews/addreview', (req, res) => {
    con.query('INSERT INTO poi_reviews(poi_id,review) VALUES (?,?)',
        [req.body.poi_id, req.body.review], (error, results, fields) => {
            console.log("poi_id: "+req.body.poi_id)
            console.log("review: " +req.body.review) // these 2 console logs seem to work properly
            if (error) {
                res.status(500).json({ error: error });
            }
            else {
                console.log("A Review has been created")
            }
        });
})

//Query to add a POI
app.post('/poi/poidb/create', (req, res) => {
    con.query('INSERT INTO poidb(name, type, country, region, description) VALUES (?,?,?,?,?)',
        [req.body.name, req.body.type, req.body.country, req.body.region, req.body.description],
        (error, results, fields) => {
            console.log("poi name: "+req.body.name)
            if (error) {
                res.status(500).json({ error: error });
            } else if (req.body.name == "") {
                res.status(500).json({ 'message': 'Please insert a name' })
            } else if (req.body.type == "") {
                res.status(500).json({ 'message': 'Please insert a type' })
            } else if (req.body.country == "") {
                res.status(500).json({ 'message': 'Please insert a country' })
            } else if (req.body.region == "") {
                res.status(500).json({ 'message': 'Please insert a region' })
            } else if (req.body.description == "") {
                res.status(500).json({ 'message': 'Please insert a description' })
            }
            else {
                console.log("New Point of Interest has been created")
                res.json({ success: 1 });
            }
        });
})

// Query to add a recommendation
app.post('/poi/poidb/:id/recommend', (req, res) => {
    con.query('UPDATE poidb SET recommendations = recommendations+1 WHERE id=?',
        [req.params.id], (error, results, fields) => {
            if (error) {
                console.log(error)
                res.status(500).json({ error: error });
            } else if (results.affectedRows == 1) {
                res.json({ 'message': 'Successfully recommended' });
            } else {
                res.status(404).json({ error: 'No rows updated, could not find a POI matching that ID' });
            }
        });
});

// Query to return POI recommendations
app.get('/poi/poidb/:id', (req, res) => {
    con.query(`SELECT recommendations FROM poidb WHERE id=?`,
        [req.params.id], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.json(results);
            }
        });
});

