const express = require('express');
const con = require('../sqlcon');
const poiRouter = express.Router();


// Query to return POI with same region
poiRouter.get('/region/:region', (req, res) => {
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
poiRouter.post('/poidb/poi_reviews/addreview', (req, res) => {
    con.query('INSERT INTO poi_reviews(poi_id,review) VALUES (?,?)',
        [req.body.poi_id, req.body.review], (error, results, fields) => {
            console.log("poi_id: "+req.body.poi_id)
            console.log("review: " +req.body.review) 
            if (error) {
                res.status(500).json({ error: error });
            }
            else {
                console.log("A Review has been created")
            }
        });
})

//Query to add a POI
poiRouter.post('/poidb/create', (req, res) => {
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
});

// Query to add a recommendation
poiRouter.post('/poidb/:id/recommend', (req, res) => {
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
poiRouter.get('/poidb/:id', (req, res) => {
    con.query(`SELECT recommendations FROM poidb WHERE id=?`,
        [req.params.id], (error, results, fields) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.json(results);
            }
        });
});

module.exports = poiRouter;