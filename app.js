const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
    console.log("conncected to server - /");
    res.send("connected to server!");
});

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});


app.listen(port, () => {
    console.log("listening to port " + port);
});