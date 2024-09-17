// v.2

const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');

async function sendGmail(to, subject, message) {
    const auth = await googleAuthorize();
    const gmail = google.gmail({ version: 'v1', auth });

    // Кодируем тему письма в Base64 с указанием UTF-8
    const subjectBase64 = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;

    // Формируем сообщение
    const email = [
        `To: ${to}`,
        `Subject: ${subjectBase64}`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset="UTF-8"',
        'Content-Transfer-Encoding: 7bit',
        '',
        message,
    ].join('\n');

    // Кодируем сообщение в Base64
    const encodedMessage = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });

    console.log(`Письмо отправлено: ${result.data.id}`);
}

module.exports = sendGmail;
