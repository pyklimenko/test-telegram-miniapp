import { getTelegramUser } from '../api/telegram/telegram-web';
import { findPersonByTgId } from '../api/db/db-queries';

document.addEventListener("DOMContentLoaded", async () => {
    const loadingElement = document.getElementById('loading');
    const studentInfoElement = document.getElementById('student-info');
    const teacherInfoElement = document.getElementById('teacher-info');

    const tgUser = getTelegramUser();

    if (tgUser) {
        // Обращаемся к базе данных для поиска по tgId
        const person = await findPersonByTgId(tgUser.id);

        if (person) {
            loadingElement.style.display = 'none';
            
            if (person instanceof Student) {
                // Отображаем информацию о студенте
                studentInfoElement.style.display = 'block';
                document.getElementById('studentId').textContent = `ID: ${person.tgId}`;
                document.getElementById('studentFirstName').textContent = `Имя: ${person.firstName}`;
                document.getElementById('studentLastName').textContent = `Фамилия: ${person.lastName}`;
                document.getElementById('studentGradeBook').textContent = `Номер зачётки: ${person.gradeBookId}`;
            } else if (person instanceof Teacher) {
                // Отображаем информацию о преподавателе
                teacherInfoElement.style.display = 'block';
                document.getElementById('teacherId').textContent = `ID: ${person.tgId}`;
                document.getElementById('teacherFirstName').textContent = `Имя: ${person.firstName}`;
                document.getElementById('teacherLastName').textContent = `Фамилия: ${person.lastName}`;
                document.getElementById('teacherDepartment').textContent = `Кафедра: ${person.department}`;
            }
        } else {
            loadingElement.style.display = 'none';
            // Показываем страницу регистрации
            window.location.href = '/public/registration.html'; 
        }
    } else {
        loadingElement.style.display = 'none';
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
        // Показываем страницу регистрации
        window.location.href = '/public/registration.html'; 
    }
});
