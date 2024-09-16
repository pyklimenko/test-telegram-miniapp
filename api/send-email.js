const { google } = require('googleapis');

// Область доступа для Gmail API
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

async function authorize() {
    // Используем переменные окружения вместо файла credentials.json
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Устанавливаем токены из переменных окружения
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (accessToken && refreshToken) {
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        return oAuth2Client;
    }

    throw new Error('Токены отсутствуют в переменных окружения');
}

// Функция для отправки email
async function sendEmail(auth, to, subject, message) {
    const gmail = google.gmail({ version: 'v1', auth });

    const email = [
        `To: ${to}`,
        'Subject: ' + subject,
        '',
        message,
    ].join('\n');

    const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });

    console.log(`Email sent: ${result.data.id}`);
}

// Основная функция для отправки email
async function sendGmail(to, subject, message) {
    try {
        const auth = await authorize(); // Авторизация через OAuth2
        await sendEmail(auth, to, subject, message); // Отправка письма
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
    }
}

// Экспорт функции для использования в других файлах
module.exports = sendGmail;
