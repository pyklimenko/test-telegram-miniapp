const { MongoClient } = require('mongodb');

const uri = process.env.MARHI_MONGODB_URI;
let client = null;

// Подключение к базе данных
async function connectToDatabase() {
    if (!client) {
        console.log('Connecting to MongoDB...');
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        try {
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB:', error);
            throw error;
        }
    }
    // Возвращаем конкретную базу данных MARHI
    return client.db('MARHI'); // Возвращаем базу данных
}

// Основной обработчик API
module.exports = async (req, res) => {
    const { tgId } = req.query;

    console.log(`Сейчас будем искать ${tgId}`);

    if (!tgId) {
        console.error('tgId is missing');
        return res.status(400).json({ error: 'tgId не предоставлен' });
    }

    try {
        console.log('Connecting to MongoDB...');
        const db = await connectToDatabase();
        console.log('Connected to MongoDB');

        // Преобразуем tgId из строки в число
        const tgId = parseInt(req.query.tgId, 10);
        console.log('Searching for tgId:', tgId);

        // Ищем документ среди студентов
        const student = await db.collection('Students').findOne({ tgId: { $eq: tgId } });
        if (student) {
            console.log('Student found:', student);
            return res.status(200).json({ email: student.email, _id: student._id });
        }

        // Ищем документ среди преподавателей
        const teacher = await db.collection('Teachers').findOne({ tgId: { $eq: tgId } });
        if (teacher) {
            console.log('Teacher found:', teacher);
            return res.status(200).json({ email: teacher.email, _id: teacher._id });
        }

        // Проверка подключена ли ты к правильной базе данных.
        console.log('Current database:', db.databaseName);

        // Запрашиваем все документы из коллекции Teachers
        const teachers = await db.collection('Teachers').find({}).toArray();
        if (teachers.length > 0) {
            console.log('All teachers:', JSON.stringify(teachers, null, 2));
        } else {
            console.log('No teachers found');
        }

        console.log('No matching document found');
        return res.status(404).json({ email: 'Not ffound', _id: 'Not ffound' });
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};
