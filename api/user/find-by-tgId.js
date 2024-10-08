const { findPersonByTgId, Student, Teacher } = require('../db/db-queries');  // Импорт классов и функций

module.exports = async (req, res) => {
    let { tgId } = req.query;

    tgId = parseInt(tgId, 10); // Преобразуем tgId в число

    console.log(`[find-by-tgId] Получен запрос на поиск пользователя с tgId: ${tgId}`);

    try {
        const person = await findPersonByTgId(tgId);
        if (person) {
            console.log(`[find-by-tgId] Пользователь найден: ${person.firstName} ${person.lastName}`);
            if (person instanceof Student) {
                console.log(`[find-by-tgId] Найден студент с tgId: ${tgId}`);
                res.status(200).json({ 
                    type: 'student',
                    ...person 
                });
            } else if (person instanceof Teacher) {
                console.log(`[find-by-tgId] Найден преподаватель с tgId: ${tgId}`);
                res.status(200).json({ 
                    type: 'teacher',
                    ...person 
                });
            }
        } else {
            console.log(`[find-by-tgId] Пользователь с tgId: ${tgId} не найден`);
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error(`[find-by-tgId] Ошибка при поиске пользователя с tgId: ${tgId}`, error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
