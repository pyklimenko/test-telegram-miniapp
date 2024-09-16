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

async function saveToken(oAuth2Client, token) {
    // Сохраняем токены в переменных окружения
    process.env.GMAIL_ACCESS_TOKEN = token.access_token;
    process.env.GMAIL_REFRESH_TOKEN = token.refresh_token;

    // В Vercel добавь эти переменные окружения через панель управления.
}
