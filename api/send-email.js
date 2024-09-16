const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail', // или другой почтовый сервис
        auth: {
            user: process.env.EMAIL_USER, // Укажите в переменных окружения
            pass: process.env.EMAIL_PASSWORD // Укажите в переменных окружения
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = sendEmail;
