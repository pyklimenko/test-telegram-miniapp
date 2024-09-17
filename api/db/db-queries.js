const connectToDatabase = require('./db-connect');

class Person {
    constructor({ _id, lastName, firstName, middleName, phoneNumber, email, tgId, tgUserName }) {
        this._id = _id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.middleName = middleName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.tgId = tgId;
        this.tgUserName = tgUserName;
    }
}

class Student extends Person {
    constructor({ gradeBookId, ...person }) {
        super(person);
        this.gradeBookId = gradeBookId;
    }
}

class Teacher extends Person {
    constructor({ department, ...person }) {
        super(person);
        this.department = department;
    }
}

async function findStudentByTgId(tgId) {
    const db = await connectToDatabase();
    try {
        return await db.collection('Students').findOne({ tgId });
    } catch (error) {
        console.error(`Ошибка при поиске студента с tgId ${tgId}:`, error);
        throw error;
    }
}

async function findTeacherByTgId(tgId) {
    const db = await connectToDatabase();
    try {
        return await db.collection('Teachers').findOne({ tgId });
    } catch (error) {
        console.error(`Ошибка при поиске преподавателя с tgId ${tgId}:`, error);
        throw error;
    }
}

async function findPersonByTgId(tgId) {
    const student = await findStudentByTgId(tgId);
    if (student) {
        return new Student({ ...student });
    }

    const teacher = await findTeacherByTgId(tgId);
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null; // Возвращаем null, если пользователь не найден
}

module.exports = { findStudentByTgId, findTeacherByTgId, findPersonByTgId };
