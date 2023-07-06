const amqplib = require("amqplib");
let { QUEUE } = require("./server-config");
let channel, connection;
async function conncetQueue() {
	try {
		connection = await amqplib.connect("amqp://localhost");
		channel = await connection.createChannel();

		await channel.assertQueue(QUEUE);
	} catch (error) {
		console.log(error);
	}
}

async function sendData(data) {
	try {
		await channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(data)));
	} catch (error) {
      console.log(error);
   }
}
module.exports = {
	conncetQueue,
   sendData
};
