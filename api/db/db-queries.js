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
    return db.collection('Students').findOne({ tgId });
}

async function findTeacherByTgId(tgId) {
    const db = await connectToDatabase();
    return db.collection('Teachers').findOne({ tgId });
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

    return null; // Если пользователь не найден
}

async function findPersonByEmail(email) {
    const db = await connectToDatabase();

    const student = await db.collection('Students').findOne({ email });
    if (student) {
        return new Student({ ...student });
    }

    const teacher = await db.collection('Teachers').findOne({ email });
    if (teacher) {
        return new Teacher({ ...teacher });
    }

    return null; // Если пользователь не найден
}

module.exports = { findPersonByEmail, findStudentByTgId, findTeacherByTgId, findPersonByTgId, Student, Teacher };
