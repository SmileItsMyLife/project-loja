const axios = require('axios');
const ApiError = require('../error/ApiError');

module.exports = async function sendVerificationEmail(email, verificationUrl) {
    const mailServiceUrl = process.env.MAIL_SERVICE_URL || 'http://mail-service:4244/send-verification';
    try {
        const response = await axios.post(mailServiceUrl, {
            toEmail: email,
            verificationLink: verificationUrl
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar email:', error.message);
        throw ApiError.internal('Erro no email service');
    }
};