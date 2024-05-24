const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Configuração do transporte com OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    }
});

module.exports = async function sendVerificationEmail(toEmail, verificationLink) {
    try {
        const accessToken = await getAccessToken();

        // Corpo do e-mail
        const mailOptions = {
            from: 'anickijandrij@gmail.com',
            to: toEmail,
            subject: 'Verificação de E-mail',
            html: `<p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
                       <p><a href="${verificationLink}">${verificationLink}</a></p>`
        };

        // Enviar e-mail
        const info = await transporter.sendMail({
            ...mailOptions,
            auth: {
                user: process.env.EMAIL,
                accessToken
            }
        });

        console.log('E-mail de verificação enviado:', info.response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
}

async function getAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const { token } = await oAuth2Client.getAccessToken();
    return token;
}