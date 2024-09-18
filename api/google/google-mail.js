const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');

async function sendGmail(to, subject, message) {
    try {
        console.log('Пытаемся отправить письмо...');
        console.log(`Отправка на адрес: ${to}`);
        console.log(`Тема письма: ${subject}`);
        console.log('Текст сообщения:', message);

        const auth = await googleAuthorize();
        console.log('Авторизация завершена.');

        const gmail = google.gmail({ version: 'v1', auth });

        const subjectBase64 = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const email = [
            `To: ${to}`,
            `Subject: ${subjectBase64}`,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset="UTF-8"',
            'Content-Transfer-Encoding: 7bit',
            '',
            message,
        ].join('\n');

        console.log('Письмо подготовлено, кодируем...');
        const encodedMessage = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        console.log('Отправляем письмо...');
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log(`Письмо успешно отправлено: ${result.data.id}`);
    } catch (error) {
        console.error('Ошибка при отправке письма через Gmail:', error);
        throw error;
    }
}

module.exports = sendGmail;
