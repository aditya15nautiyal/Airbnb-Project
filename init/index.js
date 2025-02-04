const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    //adding an owner to all data
    initData.data.forEach((listingObj) => {
        listingObj.owner = "67a21d5ed8ba68b3cd338ee3";
    });
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
