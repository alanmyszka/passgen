document.addEventListener('DOMContentLoaded', () => {

    const el = {
        popup: document.getElementById('errorPopup'),
        popupMessage: document.getElementById('popupMessage'),
        closePopup: document.getElementById('closePopup'),

        generate: document.getElementById('generate'),
        copy: document.getElementById('copy'),

        length: document.getElementById('length'),
        result: document.getElementById('result'),
        info: document.getElementById('info'),

        lowercase: document.getElementById('lowercase'),
        uppercase: document.getElementById('uppercase'),
        numbers: document.getElementById('numbers'),
        special: document.getElementById('special'),
        compatibility: document.getElementById('compatibility')
    };

    const DEFAULT_RESULT = "wygenerowane hasło";

    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const special = "!@#$%&*?";

    function showErrorPopup(message) {
        el.popupMessage.textContent = message;
        el.popup.classList.remove('hidden');
    }

    el.closePopup.addEventListener('click', () => {
        el.popup.classList.add('hidden');
    });

    function getRandomChar(set) {
        const randomValues = new Uint32Array(1);
        crypto.getRandomValues(randomValues);
        return set[randomValues[0] % set.length];
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const randomValues = new Uint32Array(1);
            crypto.getRandomValues(randomValues);
            const j = randomValues[0] % (i + 1);
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function updateInfo(text, type) {
        el.info.textContent = text;
        el.info.className = "";

        if (type === "error") el.info.classList.add("text-red-500");
        if (type === "success") el.info.classList.add("text-green-500");
    }

    function buildCharset(options) {
        let chars = "";
        let required = [];

        if (options.lowercase) {
            chars += lowercase;
            required.push(getRandomChar(lowercase));
        }
        if (options.uppercase) {
            chars += uppercase;
            required.push(getRandomChar(uppercase));
        }
        if (options.numbers) {
            chars += numbers;
            required.push(getRandomChar(numbers));
        }
        if (options.special) {
            chars += special;
            required.push(getRandomChar(special));
        }

        return { chars, required };
    }

    function isInvalid(password, options) {
        return (
            (options.special && (password[0] === '?' || password[0] === '!')) ||
            (password.length >= 3 &&
                password[0] === password[1] &&
                password[1] === password[2])
        );
    }

    function generatePassword(options) {
        const { chars, required } = buildCharset(options);

        if (!chars.length) {
            showErrorPopup("Wybierz przynajmniej jeden typ znaków!");
            return null;
        }

        if (options.length < required.length) {
            showErrorPopup("Długość hasła musi być większa niż liczba wybranych typów znaków!");
            return null;
        }

        let password = [...required];

        const remaining = options.length - password.length;

        for (let i = 0; i < remaining; i++) {
            password.push(getRandomChar(chars));
        }

        password = shuffleArray(password);

        if (options.compatibility) {
            let attempts = 0;

            while (
                attempts < 20 &&
                isInvalid(password, options)
            ) {
                password = shuffleArray(password);
                attempts++;
            }
        }

        return password.join('');
    }

    el.generate.addEventListener('click', () => {

        const options = {
            length: parseInt(el.length.value),
            lowercase: el.lowercase.checked,
            uppercase: el.uppercase.checked,
            numbers: el.numbers.checked,
            special: el.special.checked,
            compatibility: el.compatibility.checked
        };

        const password = generatePassword(options);

        if (!password) {
            el.result.textContent = DEFAULT_RESULT;
            return;
        }

        el.result.textContent = password;
        // showToast("", "clear");
    });

    el.copy.addEventListener('click', async () => {
        const password = el.result.textContent.trim();

        if (!password || password === DEFAULT_RESULT) {
            showToast("Brak hasła do skopiowania! Wygeneruj hasło!", "error");
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            showToast("Hasło skopiowane!", "success");
        } catch (e) {
            showToast("Błąd kopiowania!", "error");
        }
    });

    const lengthRange = document.getElementById('lengthRange');

    function syncLength(fromRange) {
        if (fromRange) {
            el.length.value = lengthRange.value;
        } else {
            lengthRange.value = el.length.value;
        }
    }

    lengthRange.addEventListener('input', () => syncLength(true));
    el.length.addEventListener('input', () => syncLength(false));

    const compatTrigger = document.getElementById('compatInfoTrigger');
    const tooltipBox = compatTrigger.querySelector('.tooltip-box');

    const infoPopup = document.getElementById('infoPopup');
    const compatContent = document.getElementById('compatContent');
    const closeInfoPopup = document.getElementById('closeInfoPopup');

    function isMobile() {
        return window.innerWidth < 768;
    }

    compatTrigger.addEventListener('click', (e) => {
        if (isMobile()) {
            e.preventDefault();
            compatContent.innerHTML = tooltipBox.innerHTML;
            infoPopup.classList.remove('hidden');
        }
    });

    closeInfoPopup.addEventListener('click', () => {
        infoPopup.classList.add('hidden');
    });

    const toastContainer = document.getElementById('toastContainer');

    let toastTimeout = null;
    let activeToast = null;

    function showToast(message, type = "success") {

        if (activeToast) {
            activeToast.textContent = message;
            activeToast.className = `toast ${type}`;

            clearTimeout(toastTimeout);
        } else {
            activeToast = document.createElement('div');
            activeToast.className = `toast ${type}`;
            activeToast.textContent = message;
            document.getElementById('toastContainer').appendChild(activeToast);
        }

        toastTimeout = setTimeout(() => {
            if (activeToast) {
                activeToast.remove();
                activeToast = null;
            }
        }, 2000);
    }

});