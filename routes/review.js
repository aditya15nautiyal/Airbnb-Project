const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");


// REVIEWS: /listings/:id/reviews
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        console.log("new review added!");
        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    })
);

//REVIEW DELETE ROUTE
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: { _id: reviewId } } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Deleted the Review!");
        res.redirect(`/listings/${id}`);
    })
);


module.exports = router;