const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post( // create route
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );


//NEW - new and create route
//isLoggedIn middleware to check if logged in
//Note : keep this above /:id route, otherwise it will treat new as id
router.get("/new",
    isLoggedIn,
    listingController.renderNewForm
);


router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // show route
    .put(      // update route
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(   // delete route
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

//Edit and update Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);


module.exports = router;