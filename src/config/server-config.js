const dotenv = require("dotenv");

dotenv.config();

module.exports = {
	PORT: parseInt(process.env.PORT),
	FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
	QUEUE : process.env.QUEUE,
};
