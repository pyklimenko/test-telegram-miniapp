const { findUserByEmail } = require('../db/db-queries');
const sendGmail = require('../google/google-auth');

module.exports = async (req, res) => {
    const { email } = req.body;

    console.log(`[check-email] Получен запрос на поиск пользователя с email: ${email}`);

    try {
        const person = await findPersonByEmail(email);
        if (person) {
            console.log(`[check-email] Пользователь найден: ${person.firstName} ${person.lastName}`);
            if (person instanceof Student) {
                console.log(`[check-email] Найден студент с email: ${email}`);
                res.status(200).json({ 
                    type: 'student',
                    ...person 
                });
            } else if (person instanceof Teacher) {
                console.log(`[check-email] Найден преподаватель с email: ${email}`);
                res.status(200).json({ 
                    type: 'teacher',
                    ...person 
                });
            }

            await sendGmail(person.email, 'Код регистрации в MARHIEduTrack', `Привет, ${person.firstName}. Чтобы завершить регистрацию, используй код ${person.tgId}.`);

        } else {
            console.log(`[check-email] Пользователь с email: ${email} не найден`);
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error(`[find-by-tgId] Ошибка при поиске пользователя с email: ${email}`, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
