document.addEventListener("DOMContentLoaded", () => {
    const userIdElement = document.getElementById("userId");
    const userFirstNameElement = document.getElementById("userFirstName");
    const userLastNameElement = document.getElementById("userLastName");
    const userNameElement = document.getElementById("userName");

    // Проверка, доступен ли объект Telegram WebApp
    if (window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;

        // Отображаем данные пользователя
        userIdElement.textContent = `ID: ${window.Telegram.WebApp.id}`;
        userFirstNameElement.textContent = `First Name: ${user.first_name}`;
        userLastNameElement.textContent = `Last Name: ${user.last_name || "N/A"}`;
        userNameElement.textContent = `Username: ${user.username || "N/A"}`;
    } else {
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
    }
});
