const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');

async function sendGmail(to, subject, message) {
    try {
        const auth = await googleAuthorize();
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
    } catch (error) {
        console.error('Ошибка при отправке письма через Gmail:', error);
        throw error;
    }
}


module.exports = sendGmail;
