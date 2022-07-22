//* PSUEDO-CODE *//

// Character Options Logic
// On init...
    // Make a call to the quote API for all quotes
    // for each object in the returned array...
        //  push each unique character name to a characterList array stored inside the namespace object

// When a new quote is selected by the API...
    // create a characterOptions array
        // store the name of the selected character in the array
    // create a copy of the characterList array...
        // remove the character name of the selected quote from the copied array
        // select three random names from the copied array and add them to the characterOptions array

// Then...
    // select a random character name from the characterOptions array
    // create a button element for the selected character
    // append the new button element to the button container
    // remove the selected character name from the characterOptions array
    // repeat for all of the characters in the characterOptions array

const app = {};

// empty array to hold list of characters
app.characterList = [];

app.landingPageButton = document.querySelector('#landing-page-button');
app.revealButton = document.querySelector('#reveal-button');
app.nextQuoteButton = document.querySelector('#next-quote-button');

app.mainContent = document.querySelector('.main-content');
app.quoteCount = 0;
app.score = 0;

app.scoreEl = document.querySelector('.score');

app.landingPage = document.querySelector('.main-content__text-container--landing-page');
app.mainPage = document.querySelector('.main-content__text-container--main');
app.revealPage = document.querySelector('.main-content__text-container--main-reveal');
app.loadingPage = document.querySelector('.loading');

app.quoteElements = document.querySelectorAll("blockquote");
app.characterHeading = document.querySelector("#character-name");

app.imageElements = document.querySelectorAll('.main-content__img-container');

app.getCharacterData = () => {
    // show loading screen
    app.toggleLoading();

    const url = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);

    url.search = new URLSearchParams({
        count: '100'
    });

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then((jsonData) => {
            console.log(jsonData);
            app.getCharacterList(jsonData);
            app.getQuotes(jsonData);

            // hide loading screen
            app.toggleLoading();
        });
}

app.randomizer = (arr) => {
    return Math.floor(Math.random() * arr.length);
}

app.positionScoreEl = () => {
    const wrapper = document.querySelector('.wrapper');
    app.scoreEl.style.right = `${(wrapper.offsetLeft) - 70}px`;
}


app.toggleLoading = () => {
    app.loadingPage.classList.toggle('inactive');
}

// method which uses the array of all available quotes to store all of the available character names in the app.characterList array
app.getCharacterList = (dataArray) => {
    app.availableCharacters = [];

    dataArray.forEach((characterObject) => {
        const character = characterObject.character;
        if (!app.availableCharacters.includes(character)) {
            app.availableCharacters.push(character);
        }
    });
}

// method which stores the new character name and quotes in namespace variables after receving the API response for a random quote
app.getQuotes = (dataArray) => {
    app.selectedCharacters = [];

    for (let i = 0; i < 10; i++) {
        const index = app.randomizer(dataArray);
        app.selectedCharacters.push(dataArray[index]);
        dataArray.splice(index, 1);
    }
}


app.getNextCharacter = () => {
    const nextCharacter = app.selectedCharacters[0];
    app.characterImage = nextCharacter.image;
    app.characterName = nextCharacter.character;
    app.characterQuote = nextCharacter.quote;

    app.selectedCharacters.shift();
}

app.getCharacterOptions = () => {
    const wrongAnswers = [...app.availableCharacters].filter((character) => {
        return character !== app.characterName;
    });
    
    const possibleOptions = [];
    possibleOptions.push(app.characterName);
    
    for (let i = 0; i < 3; i++) {
        const randomIndex = app.randomizer(wrongAnswers);
        possibleOptions.push(wrongAnswers[randomIndex]);
        wrongAnswers.splice(randomIndex, 1);
    }
    
    const shuffledOptions = [];

    for (let i = 0; i < 4; i++) {
        const randomIndex = app.randomizer(possibleOptions);
        shuffledOptions.push(possibleOptions[randomIndex]);
        possibleOptions.splice(randomIndex, 1);
    }

    return shuffledOptions;
}

app.appendQuote = () => {
    app.quoteCount++;

    app.getNextCharacter();
    const characterOptions = app.getCharacterOptions();

    const nextPage = document.createElement('div');
    nextPage.className = 'page page--quote';
    
    nextPage.innerHTML = `
    <h2>Who Said...</h2>
    <blockquote>${app.characterQuote}</blockquote>
    <div id='quote-${app.quoteCount}'>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[0]}'>${characterOptions[0]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[1]}'>${characterOptions[1]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[2]}'>${characterOptions[2]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[3]}'>${characterOptions[3]}</button>
    </div>
    `;
    app.mainContent.append(nextPage);

    const characterButtons = document.querySelector(`#quote-${app.quoteCount}`);
    app.onCharacterButtonsClick(characterButtons);

}

app.revealCharacter = (isCorrect) => {
    const nextPage = document.createElement('div');
    nextPage.className = 'page page--reveal';

    nextPage.innerHTML = `
        <h2>${app.characterName}</h2>
        <div>
            <p>${isCorrect ? "Correct" : "Wrong"}</p>
            <div class="character-image" style="background-image:url('${app.characterImage}')"></div>
        </div>
    `;

    app.mainContent.append(nextPage);

    if (app.selectedCharacters.length === 0) {
        app.revealScore();
        return;
    }

    app.appendQuote();
}

app.revealScore = () => {
    const nextPage = document.createElement('div');
    nextPage.className = 'page page--score';

    const reloadButton = document.createElement('button');
    reloadButton.innerText = 'Play Again!';

    nextPage.innerHTML = `
        <h2>Results</h2>
        <p></p>
        <p>${app.score} / 10</p>
    `;

    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });

    nextPage.append(reloadButton);
    app.mainContent.append(nextPage);
}

// when the landing page button is clicked...
app.landingPageButton.addEventListener('click', function() {
    app.appendQuote();
    app.landingPageButton.disabled = "true";
});


// // when the reveal button is clicked...
app.onCharacterButtonsClick = (button) => {

    button.addEventListener('click', function(event) {
        const userChoice = event.target;

        const allButtons = document.querySelectorAll(`.button-set-${app.quoteCount}`);
        allButtons.forEach((button) => {
            button.disabled = "true";
        });

        console.log(app.selectedCharacters.length);

        if (userChoice.type === 'button') {
            if (userChoice.value === app.characterName) {
                userChoice.style.backgroundColor = '#57DC59';
                app.score++;
                app.scoreEl.innerText = app.score;

                app.revealCharacter(true);
            } else {
                userChoice.style.backgroundColor = '#F57171';
                app.revealCharacter(false);
            }
        }  
    })
};



// on page load...
app.init = () => {
    app.getCharacterData();
    app.positionScoreEl();
}

app.init();