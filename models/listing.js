const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        set: (v) => (v === "") ?
            "https://images.unsplash.com/photo-1736159427273-189b0e49f19b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        default: "https://images.unsplash.com/photo-1736159427273-189b0e49f19b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;