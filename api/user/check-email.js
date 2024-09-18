const { findPersonByEmail } = require('../db/db-queries');
const sendGmailWithRetry = require('../google/google-mail'); // Изменение функции

module.exports = async (req, res) => {
    const { email } = req.body;

    console.log(`[check-email] Получен запрос на поиск пользователя с email: ${email}`);

    try {
        const person = await findPersonByEmail(email);
        if (person) {
            console.log(`[check-email] Пользователь найден: ${person.firstName} ${person.lastName}`);
            
            // Отправляем _id пользователя на клиент, чтобы потом использовать его для проверки
            res.status(200).json({ 
                _id: person._id,
                email: person.email,
                tgId: person.tgId
            });

            // Отправляем код на почту с повторными попытками
            await sendGmailWithRetry(person.email, 'Код регистрации в MARHIEduTrack', 
                `Привет, ${person.firstName}. Чтобы завершить регистрацию, используй код ${person._id}.`
            );
        } else {
            console.log(`[check-email] Пользователь с email: ${email} не найден`);
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error(`[check-email] Ошибка при поиске пользователя с email: ${email}`, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
