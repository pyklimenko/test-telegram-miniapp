document.addEventListener("DOMContentLoaded", () => {
    
    const loadingElement = document.getElementById("loading");
    const userInfoElement = document.getElementById("user-info");

    // Показ троббера при загрузке страницы
    loadingElement.style.display = "block";

    const userIdElement = document.getElementById("userId");
    const userFirstNameElement = document.getElementById("userFirstName");
    const userLastNameElement = document.getElementById("userLastName");
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("email");
    const userDbIdElement = document.getElementById("db-id");

    if (window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const user = window.Telegram.WebApp.initDataUnsafe.user;

        // Показ данных пользователя
        fetchUserData(user.id).then(userData => {
            // Прячем троббер и показываем информацию о пользователе
            loadingElement.style.display = "none";
            userInfoElement.style.display = "block";

            userIdElement.textContent = `ID: ${user.id}`;
            userFirstNameElement.textContent = `First Name: ${user.first_name}`;
            userLastNameElement.textContent = `Last Name: ${user.last_name || "N/A"}`;
            userNameElement.textContent = `Username: ${user.username || "N/A"}`;
            userEmailElement.textContent = `Email: ${userData.email}`;
            userDbIdElement.textContent = `Database ID: ${userData._id}`;
        }).catch(error => {
            loadingElement.style.display = "none";
            console.error("Ошибка при получении данных из базы:", error);
            // Если пользователя не нашли, покажем страницу регистрации
            showRegistrationPage();
        });
    } else {
        loadingElement.style.display = "none";
        console.error("Telegram WebApp не инициализирован или пользователь не доступен");
        showRegistrationPage();
    }
});

// Функция для отправки tgId на сервер и получения данных пользователя
async function fetchUserData(tgId) {
    const response = await fetch(`/api/user-data?tgId=${tgId}`);
    if (!response.ok) {
        throw new Error('Ошибка сети при запросе данных пользователя');
    }
    return response.json();
}

function showRegistrationPage() {
    const userInfoElement = document.getElementById("user-info");
    userInfoElement.innerHTML = "<h2>Здесь будет реализована регистрация пользователя</h2>";
    userInfoElement.style.display = "block";
}
