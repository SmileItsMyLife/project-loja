require("dotenv").config();
const { Kafka } = require("kafkajs");
const sendVerificationEmail = require("./mail/sendVerificationEmail");
const ApiError = require("./error/ApiError");

const env = process.env.NODE_ENV || 'development';
const brokerIP = env !== 'development' ? process.env.KAFKA_BROKER : 'localhost:9092';

console.log(`🚀 Starting Kafka consumer for mail service on ${brokerIP}`);

const kafka = new Kafka({
  clientId: "mail-service",
  brokers: [brokerIP], // Kafka broker address
});

const consumer = kafka.consumer({ groupId: "mail-service-group" });


const run = async () => {
  try {
    // Connect the Kafka consumer
    await consumer.connect();

    // Subscribe to the "email-verification" topic
    await consumer.subscribe({ topic: "mail", fromBeginning: false });

    console.log("🚀 Kafka consumer connected and listening to 'mail' topic");

    // Process each message
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const req = JSON.parse(message.value.toString());
        console.log(req)
        try {
          
          const { email, verificationUrl } = JSON.parse(message.value.toString());

          console.log(`📩 Received email request for: ${email}`);

          // Validate the message
          if (!email || !verificationUrl) {
            throw ApiError.badRequest("Missing toEmail or verificationUrl");
          }

          // Send the email
          await sendVerificationEmail(email, verificationUrl);
          console.log(`✅ Email sent successfully to ${email}`);
        } catch (err) {
          console.error("❌ Error processing email message:", err.message);
        }
      },
    });
  } catch (err) {
    console.error("❌ Failed to start Kafka consumer:", err.message);
    process.exit(1);
  }
};

run();