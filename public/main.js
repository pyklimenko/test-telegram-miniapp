document.addEventListener("DOMContentLoaded", async () => {
    const loadingElement = document.getElementById('loading');
    const studentInfoElement = document.getElementById('student-info');
    const teacherInfoElement = document.getElementById('teacher-info');

    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;

    if (tgUser) {
        try {
            // Делаем запрос к серверу для поиска пользователя в базе по tgId
            const response = await fetch(`/api/user/find-by-tgId?tgId=${tgUser.id}`);
            
            if (response.ok) {
                // Если статус ответа 200, парсим данные
                const person = await response.json();
                
                if (person) {
                    loadingElement.style.display = 'none';
                    
                    if (person.type === 'student') {
                        studentInfoElement.style.display = 'block';
                        document.getElementById('studentId').textContent = `ID: ${person.tgId}`;
                        document.getElementById('studentFirstName').textContent = `Имя: ${person.firstName}`;
                        document.getElementById('studentLastName').textContent = `Фамилия: ${person.lastName}`;
                        document.getElementById('studentGradeBook').textContent = `Номер зачётки: ${person.gradeBookId}`;
                    } else if (person.type === 'teacher') {
                        teacherInfoElement.style.display = 'block';
                        document.getElementById('teacherId').textContent = `ID: ${person.tgId}`;
                        document.getElementById('teacherFirstName').textContent = `Имя: ${person.firstName}`;
                        document.getElementById('teacherLastName').textContent = `Фамилия: ${person.lastName}`;
                        document.getElementById('teacherDepartment').textContent = `Кафедра: ${person.department}`;
                    }
                }
            } else if (response.status === 404) {
                // Если пользователь не найден (404)
                console.log('Пользователь не найден в базе данных');
                loadingElement.style.display = 'none';
                window.location.href = '/public/registration.html'; 
            } else {
                // Обработка других статусов ошибок
                console.error(`Ошибка сервера: ${response.status}`);
                loadingElement.style.display = 'none';
                alert('Произошла ошибка, попробуйте позже.');
            }
        } catch (error) {
            console.error('Ошибка при поиске пользователя в базе:', error);
            loadingElement.style.display = 'none';
            alert('Произошла ошибка, попробуйте позже.');
        }
    } else {
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
        loadingElement.style.display = 'none';
        alert('Не удалось инициализировать Telegram WebApp.');
    }
});
