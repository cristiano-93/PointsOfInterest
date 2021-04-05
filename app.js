const http = require("http");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'poidb'
});

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

con.connect(err => {
    if (err) {
        console.log(`Error connecting to mysql: ${err}`);
        process.exit(1); // Quit the Express server with an error code of 1
    } else {
        // Once we have successfully connected to MySQL, we can setup our
        // routes, and start the server.
        console.log('connected to mysql');

        // now set up the routes...
        //app.get('/songs/:name', (req, res) => {           <- needed???
        // ...
        //});

        // listen on port 3000
        app.listen(3000);
    }
});

// Query to return POI with same name
app.get('/poi/name/:name', (req, res) => {
    con.query(`SELECT * FROM poidb WHERE name=?`,
        [req.params.name], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.json(results);
            }
        });
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

//Query to add a POI
//this will need to pass the form data to a json object and then POST it
app.post('/poi/poidb/create', (req, res) => {
    con.query('INSERT INTO poidb(name, type, country, region, description, recommendations) VALUES (?,?,?,?,?,?)',
        [req.body.name, req.body.type, req.body.country, req.body.region, req.body.description, req.body.recommendations],
        (error, results, fields) => {
            if(error) {
                res.status(500).json({error: error});
            } else {
                res.json({success: 1});
            } 
        });
})

// Query to add a recommendation
app.post('/poi/poidb/:id/recommend', (req, res) => {
    con.query('UPDATE poidb SET recommendations = recommendations+1 WHERE id=?',
        [req.params.id], (error, results, fields) => {
            if (error) {
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