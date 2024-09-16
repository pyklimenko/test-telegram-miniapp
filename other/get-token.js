const { google } = require('googleapis');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// Задаём область доступа (в данном случае для отправки писем)
const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

// Указываем путь к файлу с OAuth учетными данными
const CREDENTIALS_PATH = path.join('C:/Users/Petr Klimenko/Downloads/', 'google_credentials.json');

// Чтение учетных данных клиента OAuth2 из файла credentials.json
function authorize() {
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));

    // Извлекаем данные из объекта web, а не installed
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

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
            // Здесь ты можешь сохранить токен в файл или переменные окружения
            saveToken(token);
        });
    });
}

// Сохранение токена в файл
function saveToken(token) {
    const TOKEN_PATH = path.join(__dirname, 'token.json');
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to', TOKEN_PATH);
}

// Запуск процесса авторизации
authorize();