// v.2

const { findUserByTgId, updateUserTgId } = require('../db/db-queries');

module.exports = async (req, res) => {
    const { code } = req.body;
    const user = await findUserByTgId(code);

    if (user) {
        await updateUserTgId(user._id, code, user.student ? 'Students' : 'Teachers');
        res.status(200).json({ message: 'Вы успешно зарегистрировались!' });
    } else {
        res.status(400).json({ error: 'Неверный код' });
    }
};
