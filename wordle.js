var rowIndex = 0;
var currentBox = 0;
var randomWord = "";
var randomHint = ""
var darkToggle = 0;
var winStatus = false;
var instrStatus = false;
const root = document.querySelector(':root')

document.addEventListener('keydown', function(event) {
    if (rowIndex < 4) {
        let key = String(event.key);
        let boxLetter = key;

        if (key == 'Enter') {
            boxLetter = "&#9166";
        }

        if (key == 'Backspace') {
            boxLetter = '&#9003'
        }

        document.getElementsByClassName('letter')[0].innerHTML = boxLetter;

        if (key == 'Enter') { 
            enterGuess();
        }
        if (key == 'Backspace') {
            deleteElement();
        }
        if (key.match(/^[a-zA-Z]$/)) {
            addElement(key);
        }
    }
});

const getWords= async() => {
    const res = await fetch("https://api.masoudkf.com/v1/wordle", {
        headers: {
        "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
        },
    });
    let json = await res.json();
    let dictionary = json.dictionary;
    return dictionary;
}

const selectWords = async() => {
    let dictionary = await getWords();
    let randomObject = dictionary[Math.floor(Math.random() * dictionary.length)];
    randomWord = randomObject.word;
    randomHint = randomObject.hint;
    console.log(randomWord);
    console.log(randomHint);   
    return randomObject;
}

function addElement(letter) {
    let row = document.getElementsByClassName('row')[rowIndex];  // array of the rows with index[rowIndex]
    let box = row.getElementsByClassName('box');                // array of the box in row[rowIndex]
    
    if (currentBox < 4) {        
        box[currentBox].classList.remove('current-box');
        letter = letter.toUpperCase();
        box[currentBox].innerHTML = letter;
        currentBox++;
    }

    if (currentBox != 4) {
        box[currentBox].classList.add('current-box');
    }

    console.log(currentBox)

    return;
}

function deleteElement() {
    let row = document.getElementsByClassName('row')[rowIndex];  // array of the rows with index[rowIndex]
    let box = row.getElementsByClassName('box');                // array of the box in row[rowIndex]
    
    if (currentBox != 4 && currentBox != 0) {
        box[currentBox].classList.remove('current-box');
    }

    if (currentBox != 0) {  
        box[currentBox - 1].innerHTML = "";
        currentBox--;
        box[currentBox].classList.add('current-box');
    }
    return;
}

function enterGuess() {
    if (currentBox != 4 && rowIndex < 4) {
        window.alert('guess is not long enough')
        return;
    }
    verifyGuess();
    if (rowIndex < 4) {
        rowIndex++;
        currentBox = 0;
        if (rowIndex != 4) {
            let row = document.getElementsByClassName('row')[rowIndex]; 
            let box = row.getElementsByClassName('box');
            box[currentBox].classList.add('current-box');
        }
    }
    if (rowIndex == 4) {
        document.getElementsByClassName('notify')[0].innerHTML = 'You failed! The word was ' + randomWord + '. Click Start-Over to try again'
        root.style.setProperty('--notify', 'red');
    }
    return;
}

function verifyGuess() {
    let row = document.getElementsByClassName('row')[rowIndex];  // array of the rows with index[rowIndex]
    let box = row.getElementsByClassName('box');                // array of the box in row[rowIndex]

    randomWord = randomWord.toUpperCase();

    let guess = "";
    for (let i = 0; i < 4; i++) {
        let letter = box[i].innerHTML;
        guess += letter;

        if (randomWord.includes(letter)) {
            if (randomWord[i] == letter){
                box[i].className = "box correct-right";
            }
            else {
                box[i].className = 'box correct-wrong';
            }
        }
        else {
            box[i].className = 'box wrong'
        }
    }
    if (guess == randomWord) {
        winStatus = true;
        document.getElementsByClassName('notify')[0].innerHTML = 'Congratulations! You WON!'
        document.getElementsByClassName('win-gif')[0].classList.remove('instr-display')
        document.getElementsByClassName('grid')[0].classList.add('instr-display');
        document.getElementsByClassName('letter-box')[0].classList.add('instr-display')
        root.style.setProperty('--notify', 'rgb(245, 245, 33)');
    }
    return;
}

function hint() {
    if (rowIndex < 4) {
        document.getElementsByClassName('notify')[0].innerHTML = 'Hint: ' + randomHint;
        root.style.setProperty('--notify', 'rgb(103, 11, 201)');
    }
}

function dark() {
    if (darkToggle == 0) {
        root.style.setProperty('--defaultBack', 'rgb(35, 35, 35)');
        root.style.setProperty('--defaultColor', 'white');
        darkToggle = 1;
    }
    else {
        root.style.setProperty('--defaultBack', 'white');
        root.style.setProperty('--defaultColor', 'black');
        darkToggle = 0;
    }
}

function instructions() {
    if (instrStatus == false) {
        instrStatus = true;
        document.getElementsByClassName('instruction')[0].classList.remove('instr-display');
    }
    else {
        instrStatus = false;
        document.getElementsByClassName('instruction')[0].classList.add('instr-display')
    }
}

function startOver() {   // good
    document.getElementsByClassName('win-gif')[0].classList.add('instr-display')
    document.getElementsByClassName('grid')[0].classList.remove('instr-display');
    document.getElementsByClassName('letter-box')[0].classList.remove('instr-display')
    

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let row = document.getElementsByClassName('row')[i]; 
            let box = row.getElementsByClassName('box')[j];
            box.innerHTML = "";
            box.className = "box";                
        }
    }
    rowIndex = 0;
    currentBox = 0;
    instrStatus = true;
    instructions();
    let row = document.getElementsByClassName('row')[rowIndex]; 
    let box = row.getElementsByClassName('box');
    box[currentBox].classList.add('current-box');
    document.getElementsByClassName('notify')[0].innerHTML = '';
    root.style.setProperty('--notify', '--defaultBack');
    winStatus = false;
    selectWords();
}

function startUp() {    // good
    selectWords();
    let row = document.getElementsByClassName('row')[rowIndex]; 
    let box = row.getElementsByClassName('box');
    box[currentBox].classList.add('current-box');
}

startUp();
