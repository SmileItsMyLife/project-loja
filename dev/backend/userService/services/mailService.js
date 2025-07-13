const amqp = require('amqplib');
const ApiError = require('../error/ApiError');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost';
const QUEUE_NAME = 'mail';

module.exports = async function sendVerificationEmail(email, verificationUrl) {
    let connection;
    let channel;
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        const message = JSON.stringify({ email, verificationUrl });
        channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });

        // Optionally, you can close the channel/connection after a timeout for better performance in high-load scenarios
        return { success: true };
    } catch (error) {
        console.error('Erro ao enviar email:', error.message);
        throw ApiError.internal('Erro no email service');
    } finally {
        if (channel) await channel.close().catch(() => {});
        if (connection) await connection.close().catch(() => {});
    }
};