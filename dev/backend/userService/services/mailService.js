const { Kafka, Partitioners } = require('kafkajs');
const ApiError = require('../error/ApiError');

const kafka_host_port = (process.env.NODE_ENV == "development" ? "localhost:9092" : process.env.KAFKA_HOST) || 'localhost:9092';

const kafka = new Kafka({
    clientId: 'user-service',
    brokers: [kafka_host_port]
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner, // Retain old partitioning behavior
  });

module.exports = async function sendVerificationEmail(email, verificationUrl) {
    try {
        await producer.connect();
        const response = await producer.send({
            topic: 'mail',
            messages: [
                {
                    value: JSON.stringify({
                        email,
                        verificationUrl
                    })
                }
            ]
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar email:', error.message);
        throw ApiError.internal('Erro no email service');
    } finally {
        await producer.disconnect();
    }
};