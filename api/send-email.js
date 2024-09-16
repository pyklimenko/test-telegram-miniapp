const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

async function authorize() {
    const credentials = JSON.parse(fs.readFileSync(path.join(__dirname, 'credentials.json')));
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Если токен уже сохранен в переменных окружения, используем его
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (accessToken && refreshToken) {
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        return oAuth2Client;
    }

    // Если токен отсутствует, запрашиваем новый
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this URL:', authUrl);
}

// Функция для отправки письма
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

// Основная функция для вызова из других частей кода
async function sendGmail(to, subject, message) {
    try {
        const auth = await authorize(); // Авторизация через OAuth2
        await sendEmail(auth, to, subject, message); // Отправка письма
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
    }
}

// Экспортируем функцию для использования в других файлах
module.exports = sendGmail;
