import { getTelegramUser } from '../api/telegram/telegram-web';
import { findPersonByTgId } from '../api/db/db-queries';

document.addEventListener("DOMContentLoaded", async () => {
    const loadingElement = document.getElementById('loading');
    const studentInfoElement = document.getElementById('student-info');
    const teacherInfoElement = document.getElementById('teacher-info');

    const tgUser = getTelegramUser();

    if (tgUser) {
        try {
            const person = await findPersonByTgId(tgUser.id);
            
            if (person) {
                loadingElement.style.display = 'none';
                
                if (person instanceof Student) {
                    studentInfoElement.style.display = 'block';
                    document.getElementById('studentId').textContent = `ID: ${person.tgId}`;
                    document.getElementById('studentFirstName').textContent = `Имя: ${person.firstName}`;
                    document.getElementById('studentLastName').textContent = `Фамилия: ${person.lastName}`;
                    document.getElementById('studentGradeBook').textContent = `Номер зачётки: ${person.gradeBookId}`;
                } else if (person instanceof Teacher) {
                    teacherInfoElement.style.display = 'block';
                    document.getElementById('teacherId').textContent = `ID: ${person.tgId}`;
                    document.getElementById('teacherFirstName').textContent = `Имя: ${person.firstName}`;
                    document.getElementById('teacherLastName').textContent = `Фамилия: ${person.lastName}`;
                    document.getElementById('teacherDepartment').textContent = `Кафедра: ${person.department}`;
                }
            } else {
                console.log('Пользователь не найден в базе данных', error);
                loadingElement.style.display = 'none';
                window.location.href = '/public/registration.html'; 
            }
        } catch (error) {
            console.error('Ошибка при поиске пользователя в базе:', error);
        }
    } else {
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
        // Здесь должна выводиться сообщение о том, что невозможо получить данные о пользователе Telegram
    }
});
