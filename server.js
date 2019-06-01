const express = require('express');
const app = express();
const port = 3005;
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(fileUpload());

const receiptRouter = require('./routes/receipts');
app.use('/receipts', receiptRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
})