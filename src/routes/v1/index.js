const express = require('express');

const router = express.Router();

const {infoController} = require('../../controllers');
const bookingRoutes = require('./booking-routes')

router.get('/info', infoController.info);
router.use('/booking', bookingRoutes);


module.exports = router;