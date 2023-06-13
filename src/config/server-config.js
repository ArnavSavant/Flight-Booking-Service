const dotenv = require("dotenv");

dotenv.config();

module.exports = {
	PORT: parseInt(process.env.PORT),
};
