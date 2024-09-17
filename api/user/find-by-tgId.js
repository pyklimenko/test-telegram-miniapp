const { findPersonByTgId } = require('../db/db-queries');

module.exports = async (req, res) => {
    const { tgId } = req.query;

    try {
        const person = await findPersonByTgId(tgId);
        if (person) {
            if (person instanceof Student) {
                res.status(200).json({ 
                    type: 'student',
                    ...person 
                });
            } else if (person instanceof Teacher) {
                res.status(200).json({ 
                    type: 'teacher',
                    ...person 
                });
            }
        } else {
            res.status(404).json({ error: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка при поиске пользователя в базе:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};
