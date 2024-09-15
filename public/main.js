document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM полностью загружен');

    const userIdElement = document.getElementById("userId");
    const userFirstNameElement = document.getElementById("userFirstName");
    const userLastNameElement = document.getElementById("userLastName");
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("email");
    const userDbIdElement = document.getElementById("db-id");

    // Проверка, доступен ли объект Telegram WebApp
    if (window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;

        console.log('Type of user.id:', typeof user.id); // Проверка типа данных
        console.log('user.id:', user.id); // Проверка значения

        // Отображаем данные пользователя из Telegram
        userIdElement.textContent = `ID: ${user.id}`;
        userFirstNameElement.textContent = `First Name: ${user.first_name}`;
        userLastNameElement.textContent = `Last Name: ${user.last_name || "N/A"}`;
        userNameElement.textContent = `Username: ${user.username || "N/A"}`;

        // Получаем данные из MongoDB по ID пользователя (tgId)
        fetchUserData(user.id).then(userData => {
            userEmailElement.textContent = `Email: ${userData.email}`;
            userDbIdElement.textContent = `Database ID: ${userData._id}`;
        }).catch(error => {
            console.error("Ошибка при получении данных из базы:", error);
            userEmailElement.textContent = "Email: Not Found";
            userDbIdElement.textContent = "Database ID: Not Found";
        });
    } else {
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
    }
});

// Функция для отправки tgId на сервер и получения данных пользователя
async function fetchUserData(tgId) {
    const response = await fetch(`/user-data?tgId=${tgId}`);
    if (!response.ok) {
        throw new Error('Ошибка сети при запросе данных пользователя');
    }
    return response.json();
}
