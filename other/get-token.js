const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
require('dotenv').config();  // Используем переменные окружения

// Задаём область доступа (в данном случае для отправки писем)
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Используем данные из переменных окружения
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URIS = process.env.REDIRECT_URIS.split(','); // Если несколько урлов, их можно перечислить через запятую

// Чтение учетных данных клиента OAuth2 из переменных окружения
function authorize() {
    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URIS[0]);
    getAccessToken(oAuth2Client);
}

// Запрос кода авторизации и получение токена
function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this URL:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);

            console.log('Token:', token);
            // Сохраняем токен в переменные окружения (локально в файле или через панель на сервере)
            saveToken(token);
        });
    });
}

// Сохранение токена в файл или переменные окружения
function saveToken(token) {
    // Локально можно сохранить в файл, например, token.json
    if (process.env.NODE_ENV === 'development') {
        const TOKEN_PATH = path.join(__dirname, 'token.json');
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to', TOKEN_PATH);
    } else {
        // В Vercel или другом окружении нужно обновить переменные окружения
        console.log('В продакшене необходимо обновить переменные окружения вручную.');
        // На сервере добавляем токен в переменные окружения через панель управления Vercel
        // Обнови `GMAIL_ACCESS_TOKEN` и `GMAIL_REFRESH_TOKEN` вручную
    }
}

// Запуск процесса авторизации
authorize();
