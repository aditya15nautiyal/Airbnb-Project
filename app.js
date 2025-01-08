const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 8080;


app.get("/", (req, res) => {
    res.send("connected to server!");
});


app.listen(port, () => {
    console.log("listening to port " + port);
});