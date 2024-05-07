const nodemailer = require('nodemailer');

// Configuração do transporte com OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL, // Seu endereço de e-mail
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
    }
});

module.exports = async function sendVerificationEmail(toEmail, verificationLink) {
    // Corpo do e-mail
    const mailOptions = {
        from: 'anickijandrij@gmail.com', // Seu endereço de e-mail
        to: toEmail,
        subject: 'Verificação de E-mail',
        html: `<p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
                   <p><a href="${verificationLink}">${verificationLink}</a></p>`
    };

    // Enviar e-mail
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
        } else {
            console.log('E-mail de verificação enviado:', info.response);
        }
    });
}
