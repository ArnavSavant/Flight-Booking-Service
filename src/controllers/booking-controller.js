const { ErrorResponse, SuccessResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const AppError = require("../utils/errors/app-error");

const inMemDb = {};
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
		const idempotencyKey = req.headers["x-idempotency-key"];
		if (!idempotencyKey) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ messages: "Idempotency Key not found" });
		}
		if (inMemDb[idempotencyKey]) {
			return res
				.status(StatusCodes.BAD_REQUEST)
				.json({ messages: "Cannot retry a successful payment" });
		}
		const booking = await BookingService.makePayment({
			bookingId: req.body.bookingId,
			userId: req.body.userId,
			totalCost: req.body.totalCost,
		});
		inMemDb[idempotencyKey] = idempotencyKey;
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
	makePayment,
};
