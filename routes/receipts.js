const express = require('express');
const router = express.Router();
const { Pool, Client } = require('pg');
const connectionString = 'postgres://wxkyggdbopcdqt:863fd0e98e61121df981ab1f9a77ba15a9937fc8a10fb956d7471332a2cfe98c@ec2-54-225-106-93.compute-1.amazonaws.com:5432/d15als2f7q0frl'

const pool = new Pool({
    connectionString: connectionString,
    ssl: true
})

const selectQuery = 'SELECT * FROM "Receipts"';
const insertQuery = 'INSERT INTO "Receipts" (name, date, total, category, description, filename, filetype, filesize) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
const deleteQuery = 'DELETE FROM "Receipts" WHERE id = $1';

router.get('/', (req, res) => {
    pool.query(selectQuery, (err, response) => {
        if (err) throw err;
        let data = response.rows;
        res.send(data)
    })
    

    
})

router.post('/', (req, res) => {
    let file = req.files.file;
    let values = [req.body.name, req.body.data, req.body.total, req.body.category, req.body.description, file.name, file.mimetype, file.size]

    pool.query(insertQuery, values, (err, response) => {
        if (err) throw err;
        pool.query(selectQuery, (err, response) => {
            if (err) throw err;
            let data = response.rows;
            res.send(data)
        })
    })

    // file.mv('./data/'+file.name, function(err) {
    //     if(err) console.log(err)

    // })
})

router.delete('/', (req, res) => {
    console.log(req.body.id);
    let values = [req.body.id]
    pool.query(deleteQuery, values, (err, response) => {
        if (err) console.log(err);
        pool.query(selectQuery, (err, response) => {
            if (err) throw err;
            let data = response.rows;
            res.send(data)
        })
    })
})

module.exports = router;