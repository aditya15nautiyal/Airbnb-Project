const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const port = 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

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

// Index Route - show all the possible listings
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//Show Route - show details of a particular listing
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("Displaying listing with id: " + id);
    res.render("listings/show.ejs", { listing });
});


app.get("*", (req, res) => {
    console.log("Wrong URL!");
    res.send("404! Page not found");
});

app.listen(port, () => {
    console.log("listening to port " + port);
});