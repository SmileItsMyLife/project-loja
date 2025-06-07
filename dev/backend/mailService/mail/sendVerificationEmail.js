const nodemailer = require('nodemailer');
const ApiError = require("../error/ApiError");

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // from .env
    pass: process.env.EMAIL_PASS,  // Gmail app password or SMTP password
  },
});

/**
 * Sends a verification email to `toEmail` with the given `verificationLink`.
 * Returns nothing if success; throws ApiError on failure.
 */
async function sendVerificationEmail(toEmail, verificationLink) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Verificação de Conta",
      text: `Prima o link para confirmar o seu email: ${verificationLink}`,
      // You could also send HTML:
      // html: `<p>Prima <a href="${verificationLink}">aqui</a> para confirmar seu e-mail.</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 E-mail enviado: ", info.messageId);
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail: ", err);
    // Throw ApiError so our Express handler can catch it
    throw ApiError.internal("Error in mail service");
  }
}

module.exports = sendVerificationEmail;
