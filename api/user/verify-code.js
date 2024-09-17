const { findPersonById } = require('../db/db-queries');

module.exports = async (req, res) => {
    const { _id, code } = req.body;

    console.log(`[verify-code] Получен запрос на сравнение ${_id} с ${code}`);

    try {
        if (_id === code) {
            console.log(`[verify-code] Код верный, регистрация завершена для пользователя с _id: ${_id}`);
            res.status(200).json({ message: 'Регистрация завершена' });
        } else {
            console.log(`[verify-code] Неверный код для пользователя с _id: ${_id}`);
            res.status(400).json({ error: 'Неверный код' });
        }
    } catch (error) {
        console.error(`[verify-code] Ошибка при проверке кода для пользователя с _id: ${_id}`, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
