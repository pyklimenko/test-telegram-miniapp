// v.2

const { findUserByEmail } = require('../db/db-queries');
const sendGmail = require('../google/google-auth');

module.exports = async (req, res) => {
    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (user) {
        await sendGmail(user.email, 'Код регистрации в MARHIEduTrack', `Привет, ${user.firstName}. Чтобы завершить регистрацию, используй код ${user.tgId}.`);
        res.status(200).json({ message: 'Код отправлен' });
    } else {
        res.status(404).json({ error: 'Пользователь не найден' });
    }
};
