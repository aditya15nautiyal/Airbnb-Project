const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const port = 8080;

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

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
    console.log("connected to server - /");
    res.redirect("/listings");
});


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


// Index Route - show all the possible listings
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    console.log("Displaying all listings");
    res.render("listings/index.ejs", { allListings });
}));


//NEW - new and create route
app.get("/listings/new", (req, res) => {
    console.log("Creating a new listing");
    res.render("listings/new.ejs");
});

//Create - creating a new listing
app.post(
    "/listings",
    validateListing,
    wrapAsync(async (req, res) => {
        const newEntry = new Listing(req.body.listing);
        await newEntry.save();
        console.log("Successfully saved new entry!");
        console.log(newEntry);
        res.redirect("/listings");
    })
);


//Show Route - show details of a particular listing
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log("Displaying listing with id: " + id);
    res.render("listings/show.ejs", { listing });
}));


//Edit and update Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        console.log("Successfully updated the listing with id: " + id);
        res.redirect(`/listings/${id}`);
    }));


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    console.log(listing);
    res.redirect("/listings");
}));



app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});


app.listen(port, () => {
    console.log("listening to port " + port);
});