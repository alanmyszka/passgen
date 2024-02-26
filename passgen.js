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
    var numCheckbox = document.getElementById('num');

    if (!numCheckbox.checked) {
        var password = pickRandomChars(specials, 1) + pickRandomChars(lowercase, 1) + pickRandomChars(uppercase, 1) + pickRandomChars(numbers, 1) + pickRandomChars(specials + lowercase + uppercase + numbers, passwordLength - 4);
        document.getElementById("password").value = shuffleString(password);
    } else {
        var numOnly = pickRandomChars(numbers, passwordLength);
        document.getElementById("password").value = numOnly;
    }
}