const axios = require("axios");
const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { serverConfig, Queue } = require("../config");
const AppError = require("../utils/errors/app-error");

const Enum = require("../utils/common/enum");
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enum.BOOKING_STATUS;

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

async function makePayment(data) {
	const transaction = await db.sequelize.transaction();
	try {
		const bookingDetails = await bookingRepository.get(
			data.bookingId,
			transaction
		);
		if (bookingDetails.status == CANCELLED) {
			throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
		}
		const bookingTime = new Date(bookingDetails.createdAt);
		const currentTime = new Date();
		if (currentTime - bookingTime > 60000) {
			await cancelBooking(data.bookingId);
			throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
		}
		if (bookingDetails.totalCost != data.totalCost) {
			throw new AppError(
				"The payment amount does not match",
				StatusCodes.BAD_REQUEST
			);
		}
		if (bookingDetails.userId != data.userId) {
			throw new AppError(
				"The booking corresponding to the user does not exist",
				StatusCodes.BAD_REQUEST
			);
		}

		//assuming payment is successful
		await bookingRepository.update(
			{ status: BOOKED },
			data.bookingId,
			transaction
		);
		Queue.sendData({
			recepientEmail: "savantishu02@gmail.com",
			subject: "Flight Booked",
			text: `Booking successfully done for the booking ${data.bookingId}`,
		});
		await transaction.commit();
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		throw error;
	}
}

async function cancelBooking(bookingId) {
	const transaction = await db.sequelize.transaction();
	try {
		const bookingDetails = await bookingRepository.get(bookingId, transaction);
		if (bookingDetails.status == CANCELLED) {
			await transaction.commit();
			return true;
		}
		await axios.patch(
			`${serverConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`,
			{ seats: bookingDetails.noOfSeats, dec: 0 }
		);
		await bookingRepository.update(
			{ status: CANCELLED },
			bookingId,
			transaction
		);
		await transaction.commit();
		return true;
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

async function cancelOldBookings() {
	try {
		const time = new Date(Date.now() - 1000 * 300); //5mins ago
		const response = await bookingRepository.cancelOldBookings(time);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

module.exports = {
	createBooking,
	makePayment,
	cancelOldBookings,
};
