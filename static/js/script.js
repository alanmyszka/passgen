// Character sets
const lowercase = "abcdefghijklmnopqrstuvwxyz";
const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";
const special = "!@#$%&*?";

document.getElementById('generate').addEventListener('click', () => {
    const length = parseInt(document.getElementById('length').value);
    const useLowercase = document.getElementById('lowercase').checked;
    const useUppercase = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSpecial = document.getElementById('special').checked;

    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');

    let characters = "";
    let password = [];

    if (useLowercase) {
        characters += lowercase;
        password.push(getRandomChar(lowercase));
    }
    if (useUppercase) {
        characters += uppercase;
        password.push(getRandomChar(uppercase));
    }
    if (useNumbers) {
        characters += numbers;
        password.push(getRandomChar(numbers));
    }
    if (useSpecial) {
        characters += special;
        password.push(getRandomChar(special));
    }

    if (!characters.length) {
        errorDiv.textContent = "Wybierz przynajmniej jeden typ znaków!";
        errorDiv.classList.add('text-red-500');
        resultDiv.textContent = "Twoje hasło pojawi się tutaj";
        return;
    }
    if (length < password.length) {
        errorDiv.textContent = "Długość hasła musi być większa niż liczba wybranych typów!";
        errorDiv.classList.add('text-red-500');
        resultDiv.textContent = "Twoje hasło pojawi się tutaj";
        return;
    }

    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password.push(getRandomChar(characters));
    }

    password = shuffleArray(password);

    resultDiv.textContent = password.join('');
    errorDiv.textContent = "";
});

// Web Crypto API
function getRandomChar(set) {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    return set[randomValues[0] % set.length];
}

// Fisher-Yates shuffle using Web Crypto API
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomValues = new Uint32Array(1);
        window.crypto.getRandomValues(randomValues);
        const j = randomValues[0] % (i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function copyPassword() {
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");
    const password = resultDiv.textContent.trim();

    if (!password || password === "Twoje hasło pojawi się tutaj") {
        errorDiv.textContent = "Brak hasła do skopiowania!";
        errorDiv.classList.add('text-red-500');
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        errorDiv.textContent = "Hasło skopiowane!";
        errorDiv.classList.remove('text-red-500');
        errorDiv.classList.add('text-green-500');
    } catch (err) {
        errorDiv.textContent = "Błąd kopiowania!";
        errorDiv.classList.add('text-red-500');
    }
}

document.getElementById('copy').addEventListener('click', copyPassword);