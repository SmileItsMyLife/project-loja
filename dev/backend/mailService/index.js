require("dotenv").config();
const amqp = require("amqplib");
const sendVerificationEmail = require("./mail/sendVerificationEmail");
const ApiError = require("./error/ApiError");

const env = process.env.NODE_ENV || 'development';
const rabbitUrl = env !== 'development'
  ? process.env.RABBITMQ_URL
  : 'amqp://admin:admin@localhost'; // Update with your RabbitMQ user/pass

const QUEUE_NAME = "mail";

console.log(`🚀 Starting RabbitMQ consumer for mail service on ${rabbitUrl}`);

const run = async () => {
  let connection, channel;
  try {
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`🚀 RabbitMQ consumer connected and listening to '${QUEUE_NAME}' queue`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const { email, verificationUrl } = JSON.parse(msg.content.toString());
          console.log(`📩 Received email request for: ${email}`);

          if (!email || !verificationUrl) {
            throw ApiError.badRequest("Missing email or verificationUrl");
          }

          await sendVerificationEmail(email, verificationUrl);
          console.log(`✅ Email sent successfully to ${email}`);
          channel.ack(msg);
        } catch (err) {
          console.error("❌ Error processing email message:", err.message);
          channel.nack(msg, false, false); // Discard the message
        }
      }
    });
  } catch (err) {
    console.error("❌ Failed to start RabbitMQ consumer:", err.message);
    process.exit(1);
  }
};

run();