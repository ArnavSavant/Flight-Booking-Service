const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { serverConfig } = require("../config");
const AppError = require("../utils/errors/app-error");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
	const transaction = await db.sequelize.transaction();
	try {
		const flight = await axios.get(
			`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
		);
		const flightData = flight.data.data;
		if (data.noOfSeats > flightData.totalSeats) {
			throw new AppError("Not enough Seats available", StatusCodes.BAD_REQUEST);
		}

		const billingAmount = data.noOfSeats * flightData.price;
		const bookingPayload = { ...data, totalCost: billingAmount };

		const booking = await bookingRepository.createBooking(
			bookingPayload,
			transaction
		);
		await axios.patch(
			`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,
			{ seats: data.noOfSeats }
		);
		transaction.commit();
		return booking;
	} catch (error) {
		console.log(error);
		transaction.rollback();
		throw error;
	}
}
module.exports = {
	createBooking,
};
