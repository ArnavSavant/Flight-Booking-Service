const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models");
const CrudRepository = require("./crud-repository");

class BookingRepository extends CrudRepository {
	constructor() {
		super(Booking);
	}

	async createBooking(data, transaction) {
		const response = await Booking.create(data, { transaction: transaction });
		return response;
	}

	async get(data, transaction) {
		const response = await Booking.findByPk(data, { transaction: transaction });
		if (!response) {
			throw new AppError("Unable to fetch the data", StatusCodes.NOT_FOUND);
		}
		return response;
	}

	async update(data, id, transaction) {
		// data -> {col:value, .....}

		const response = await this.model.update(
			data,
			{
				where: {
					id: id,
				},
			},
			{ transaction: transaction }
		);
		if (response[0] == 0) {
			throw new AppError("Unable to update the booking", StatusCodes.NOT_FOUND);
		}
		return response;
	}
}

module.exports = BookingRepository;
