const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');

const port = 8080;

main()
    .then(() => {
        console.log("connected to database");
    }).catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}

app.get("/", (req, res) => {
    res.send("connected to server!");
});


app.listen(port, () => {
    console.log("listening to port " + port);
});