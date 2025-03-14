const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); //uploads to given destination (storage)

const listingController = require("../controllers/listings.js");


router.route("/")
    .get(wrapAsync(listingController.index)) // index route
    .post( // create route
        isLoggedIn,
        upload.single("listing[image]"), // listing[image] is the form field
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
        upload.single("listing[image]"),
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