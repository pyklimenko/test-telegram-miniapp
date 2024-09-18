const { google } = require('googleapis');

async function googleAuthorize() {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];

    console.log('Проверка переменных окружения:');
    console.log('CLIENT_ID:', !!client_id);
    console.log('CLIENT_SECRET:', !!client_secret);
    console.log('REDIRECT_URIS:', !!redirect_uris[0]);

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    console.log('Проверка токенов:');
    console.log('Access Token:', !!accessToken);
    console.log('Refresh Token:', !!refreshToken);

    if (accessToken && refreshToken) {
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        console.log('Токены успешно установлены.');
        return oAuth2Client;
    }

    throw new Error('Токены отсутствуют в переменных окружения');
}

module.exports = googleAuthorize;
