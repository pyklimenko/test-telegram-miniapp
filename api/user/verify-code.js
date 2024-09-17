const { findPersonById, updatePersonTgId, Student, Teacher } = require('../db/db-queries'); // Импортируем классы

module.exports = async (req, res) => {
    const { _id, code, tgUserId } = req.body;

    console.log(`[verify-code] Получен запрос на сравнение ${_id} с ${code}`);

    try {
        if (_id === code) {
            console.log(`[verify-code] Код верный, регистрация завершена для пользователя с _id: ${_id}`);

            const person = await findPersonById(_id); // Используем await для асинхронного вызова
            if (person) {
                console.log(`[verify-code] Пользователь найден: ${person.firstName} ${person.lastName}`);
                
                if (person instanceof Student) {
                    console.log(`[verify-code] Найден студент с tgId: ${tgUserId}`);
                    await updatePersonTgId(_id, tgUserId, 'Students'); // Используем tgUserId
                } else if (person instanceof Teacher) {
                    console.log(`[verify-code] Найден преподаватель с tgId: ${tgUserId}`);
                    await updatePersonTgId(_id, tgUserId, 'Teachers'); // Используем tgUserId
                }
                
                // Отправляем HTML, который редиректит на index.html через 2 секунды
                res.status(200).send(`
                    <html>
                        <head>
                            <script>
                                setTimeout(function() {
                                    window.location.href = '/index.html';
                                }, 2000);
                            </script>
                        </head>
                        <body>
                            <p>Регистрация завершена. Вы будете перенаправлены на главную страницу через 2 секунды.</p>
                        </body>
                    </html>
                `);
            } else {
                console.log(`[verify-code] Пользователь с _id: ${_id} не найден`);
                res.status(404).json({ error: 'Пользователь не найден' });
            }
        } else {
            console.log(`[verify-code] Неверный код для пользователя с _id: ${_id}`);
            res.status(400).json({ error: 'Неверный код' });
        }
    } catch (error) {
        console.error(`[verify-code] Ошибка при проверке кода для пользователя с _id: ${_id}`, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
