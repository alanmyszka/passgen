function copyPassword() {
    var copyText = document.getElementById("password");
    copyText.select();
    copyText.setSelectionRange(0, copyText.value.length);
    navigator.clipboard.writeText(copyText.value);
}

function pickRandomChars(source, count) {
    var chars = '';
    for (var i = 0; i < count; i++) {
        chars += source[Math.floor(Math.random() * source.length)];
    }
    return chars;
}

function shuffleString(input) {
    var array = input.split('');
    var tmp, current, top = array.length;
    if (top) {
        while (--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
    }
    return array.join('');
}

function genPassword() {
    var specials = '!@#$%&*?';
    var lowercase = 'abcdefghijkmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';

    var passwordLength = document.getElementById('passwordLength').value;
    var passwordAmount = document.getElementById('passwordAmount').value;

    var includeLowercase = document.getElementById('lowercase').checked;
    var includeUppercase = document.getElementById('uppercase').checked;
    var includeNumbers = document.getElementById('numbers').checked;
    var includeSpecials = document.getElementById('specials').checked;

    var characterSet = '';
    var requiredChars = '';

    if (includeLowercase) {
        characterSet += lowercase;
        requiredChars += pickRandomChars(lowercase, 1);
    }
    if (includeUppercase) {
        characterSet += uppercase;
        requiredChars += pickRandomChars(uppercase, 1);
    }
    if (includeNumbers) {
        characterSet += numbers;
        requiredChars += pickRandomChars(numbers, 1);
    }
    if (includeSpecials) {
        characterSet += specials;
        requiredChars += pickRandomChars(specials, 1);
    }

    if (characterSet === '') {
        alert('Wybierz co najmniej jeden typ znaków!');
        return;
    }

    var passwords = [];
    for (var i = 0; i < passwordAmount; i++) {
        var remainingLength = passwordLength - requiredChars.length;
        var password = requiredChars + pickRandomChars(characterSet, remainingLength);
        passwords.push(shuffleString(password));
    }

    document.getElementById("password").value = passwords.join('\n');
}

function downloadCSV() {
    var passwordText = document.getElementById('password').value;
    if (passwordText.trim() === '') {
        alert('Najpierw wygeneruj hasła');
        return;
    }
    var csvContent = "data:text/csv;charset=utf-8" + passwordText;
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "passwords.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}