const nodemailer = require('nodemailer');
const ApiError = require("../error/ApiError")

// Configuração do transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // Pode ser alterado para outro serviço
    auth: {
        user: process.env.EMAIL_USER, // Seu e-mail (configurado no .env)
        pass: process.env.EMAIL_PASS, // Sua senha ou senha de aplicativo
    },
});

// Function to send a verification email
module.exports = async function sendVerificationEmail(toEmail, verificationLink) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Remetente
            to: toEmail, 
            subject: "Verificação de Conta",
            text: `Prima o link para confirmar o seu email: ${verificationLink}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("E-mail enviado: ", info.messageId);
    } catch (error) {
        console.error("Erro ao enviar e-mail: ", error);
        return new ApiError.internal("Erron in mail service")
    }
};
