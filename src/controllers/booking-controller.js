const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const AppError = require('../utils/errors/app-error');
async function createBooking(req, res) {
	try {
		const booking = await BookingService.createBooking({
			flightId: req.body.flightId,
			userId: req.body.userId,
			noOfSeats: req.body.noOfSeats,
		});
		SuccessResponse.messages = "Booking Created SuccessFully";
		SuccessResponse.data = booking;
		return res.status(StatusCodes.CREATED).json(SuccessResponse);
	} catch (error) {
		ErrorResponse.error = error;
		return res.status(error.statusCode).json(ErrorResponse);
	}
}

async function makePayment(req, res) {
	try {
		const booking = await BookingService.makePayment({
			bookingId: req.body.bookingId,
			userId: req.body.userId,
			totalCost: req.body.totalCost,
		});
		SuccessResponse.messages = "Payment Done SuccessFully";
		SuccessResponse.data = booking;
		return res.status(StatusCodes.CREATED).json(SuccessResponse);
	} catch (error) {
		ErrorResponse.error = error;
		return res.status(error.statusCode).json(ErrorResponse);
	}
}
module.exports = {
	createBooking,
	makePayment
};
