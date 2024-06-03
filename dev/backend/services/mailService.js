const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Function to create a transport
function createTransport(accessToken) {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken,
        },
    });
}

// Function to get a new access token using the refresh token
async function getAccessToken() {
    const oAuth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        'https://developers.google.com/oauthplayground' // Redirect URL
    );

    oAuth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    const tokenResponse = await oAuth2Client.getAccessToken();
    if (!tokenResponse || !tokenResponse.token) {
        throw new Error('Failed to get access token');
    }
    return tokenResponse.token;
}

// Function to send a verification email
module.exports = async function sendVerificationEmail(toEmail, verificationLink) {
    try {
        const accessToken = await getAccessToken();
        const transporter = createTransport(accessToken);

        const mailOptions = {
            from: 'anickijandrij@gmail.com',
            to: toEmail,
            subject: 'Verificação de E-mail',
            html: `<p>Por favor, clique no link abaixo para verificar seu endereço de e-mail:</p>
                   <p><a href="${verificationLink}">${verificationLink}</a></p>`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail de verificação enviado:', info.response);
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
    }
};
