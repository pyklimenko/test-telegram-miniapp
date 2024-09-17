document.getElementById('email-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;

    try {
        const response = await fetch('/api/user/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            const data = await response.json();

            // Сохраняем _id пользователя для проверки
            localStorage.setItem('dbUserId', data._id);

            document.getElementById('code-section').style.display = 'block';
        } else {
            document.getElementById('result').textContent = 'Пользователь не найден';
        }
    } catch (error) {
        console.error('Ошибка при проверке email:', error);
        document.getElementById('result').textContent = 'Ошибка при проверке email, попробуйте позже';
    }
});

document.getElementById('verify-code').addEventListener('click', async () => {
    const code = document.getElementById('code').value;
    const dbUserId = localStorage.getItem('dbUserId');  // Используем _id для поиска пользователя
    const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
    const tgUserId = tgUser.id;

    console.log(`Выгружен из памяти userId ${userId}, сравниваем его с ${code}`);

    try {
        const response = await fetch('/api/user/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: dbUserId, code, tgUserId })
        });

        if (response.ok) {
            document.getElementById('result').textContent = 'Вы успешно зарегистрировались!';
        } else {
            document.getElementById('result').textContent = 'Неверный код';
        }
    } catch (error) {
        console.error('Ошибка при проверке кода:', error);
        document.getElementById('result').textContent = 'Ошибка при проверке кода, попробуйте позже';
    }
});
