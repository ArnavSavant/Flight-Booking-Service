const express = require("express");

const router = express.Router();
const { bookingController } = require("../../controllers");

router.post("/", 
               bookingController.createBooking);

module.exports = router;
