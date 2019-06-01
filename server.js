const express = require('express');
const app = express();
const port = 3005;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(fileUpload());

const receiptRouter = require('./routes/receipts');
app.use('/receipts', receiptRouter);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
})