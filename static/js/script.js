function showErrorPopup(message) {
    const popup = document.getElementById('errorPopup');
    const messageBox = document.getElementById('popupMessage');

    messageBox.textContent = message;
    popup.classList.remove('hidden');
}

document.getElementById('closePopup').addEventListener('click', function () {
    document.getElementById('errorPopup').classList.add('hidden');
});

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
    const compatibility = document.getElementById('compatibility').checked;

    const resultDiv = document.getElementById('result');
    const infoDiv = document.getElementById('info');

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
        showErrorPopup("Wybierz przynajmniej jeden typ znaków!");
        resultDiv.textContent = "wygenerowane hasło";
        return;
    }
    if (length < password.length) {
        showErrorPopup("Długość hasła musi być większa niż liczba wybranych typów znaków!");
        resultDiv.textContent = "wygenerowane hasło";
        return;
    }

    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password.push(getRandomChar(characters));
    }

    password = shuffleArray(password);

    if (compatibility) {
        while (
            (useSpecial && (password[0] === '?' || password[0] === '!')) // SAP compatibility: The first character cannot be an exclamation point (!) or a question mark (?). -> https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/4a/c3efb58c352470e10000000a42189c/content.htm?no_cache=true
            || 
            (password.length >= 3 && password[0] === password[1] && password[1] === password[2]) // SAP compatibility: The first three characters cannot all be the same. For example AAA is not allowed. -> https://help.sap.com/doc/saphelp_nw75/7.5.5/en-US/4a/c3efb58c352470e10000000a42189c/content.htm?no_cache=true

        ) {
            password = shuffleArray(password);
        }
    }

    resultDiv.textContent = password.join('');
    infoDiv.textContent = "";
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
    const infoDiv = document.getElementById("info");
    const password = resultDiv.textContent.trim();

    if (!password || password === "wygenerowane hasło") {
        infoDiv.textContent = "Brak hasła do skopiowania!";
        infoDiv.classList.add('text-red-500');
        return;
    }

    try {
        await navigator.clipboard.writeText(password);
        infoDiv.textContent = "Hasło skopiowane!";
        infoDiv.classList.remove('text-red-500');
        infoDiv.classList.add('text-green-500');
    } catch (err) {
        infoDiv.textContent = "Błąd kopiowania!";
        infoDiv.classList.add('text-red-500');
    }
}

document.getElementById('copy').addEventListener('click', copyPassword);