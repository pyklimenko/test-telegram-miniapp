const { MongoClient } = require('mongodb');

const uri = process.env.MARHI_MONGODB_URI;

let client;
let db;

async function connectToDatabase() {
    if (!client) {
        console.log('Подключение к MongoDB...');
        client = new MongoClient(uri);

        try {
            await client.connect();
            console.log('Подключён MongoDB');
        } catch (error) {
            console.error('Ошибка подключения к MongoDB:', error);
            throw error;
        }

        db = client.db('MARHI');
    }

    // Возвращаем базу данных MARHI
    return db;
}

module.exports = connectToDatabase;