const { MongoClient } = require('mongodb');

const uri = process.env.MARHI_MONGODB_URI;
let client = null;

// Подключение к базе данных
async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
    return client.db(); // Возвращаем базу данных
}

// Основной обработчик API
module.exports = async (req, res) => {
    const { tgId } = req.query;
    
    if (!tgId) {
        return res.status(400).json({ error: 'tgId не предоставлен' });
    }

    try {
        const db = await connectToDatabase();

        // Поиск пользователя в коллекциях Students и Teachers
        const student = await db.collection('Students').findOne({ tgId });
        const teacher = await db.collection('Teachers').findOne({ tgId });

        if (student) {
            return res.status(200).json({ email: student.email, _id: student._id });
        } else if (teacher) {
            return res.status(200).json({ email: teacher.email, _id: teacher._id });
        } else {
            return res.status(404).json({ email: 'Not found', _id: 'Not found' });
        }
    } catch (error) {
        console.error('Ошибка подключения к базе данных:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};
