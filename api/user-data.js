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
    return client.db(); // Возвращаем базу данных
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
        const db = await connectToDatabase();

        // Преобразуем tgId в число, если оно не является числом
        const numericTgId = parseInt(tgId, 10);

        // Ищем в базе данных как int32
        const student = await db.collection('Students').findOne({ tgId: numericTgId });
        const teacher = await db.collection('Teachers').findOne({ tgId: numericTgId });

        if (student) {
            console.log('Student found:', student);
            return res.status(200).json({ email: student.email, _id: student._id });
        }

        if (teacher) {
            console.log('Teacher found:', teacher);
            return res.status(200).json({ email: teacher.email, _id: teacher._id });
        }

        console.log('No matching document found');
        return res.status(404).json({ email: 'Not ffound', _id: 'Not ffound' });
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
};
