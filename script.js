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

app.landingPageButton = document.querySelector('.landing-page__button');

app.wrapperEl = document.querySelector('.wrapper--main');
app.quoteCount = 0;
app.score = 0;
app.screenCount = 1;

app.scoreEl = document.querySelector('.score');

app.loadingPage = document.querySelector('.loading');


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
    app.scoreEl.style.right = `${(app.wrapperEl.offsetLeft)}px`;

    window.addEventListener('resize', () => {
        app.scoreEl.style.right = `${(app.wrapperEl.offsetLeft)}px`;
    });
}

app.toggleLoading = () => {
    app.loadingPage.classList.toggle('inactive');
}

app.transitionPage = () => {
    console.log('scroll');

    console.log(window.innerHeight * app.screenCount);
    scroll({
        top: (window.innerHeight * app.screenCount),
        behavior: "smooth"
    });

    app.screenCount++;
}

// method which uses the array of all available quotes to store all of the available character names in the app.characterList array
app.getCharacterList = (dataArray) => {
    app.characterList = [];

    dataArray.forEach((characterObject) => {
        const character = characterObject.character;
        if (!app.characterList.includes(character)) {
            app.characterList.push(character);
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
    const wrongAnswers = [...app.characterList].filter((character) => {
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

    const nextPage = document.createElement('section');
    nextPage.className = 'page question';
    
    nextPage.innerHTML = `
    <h2>Who Said...</h2>
    <blockquote class="question__quote">${app.characterQuote}</blockquote>
    <div class="question__buttons" id='quote-${app.quoteCount}'>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[0]}'>${characterOptions[0]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[1]}'>${characterOptions[1]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[2]}'>${characterOptions[2]}</button>
        <button type="button" class="character-option button-set-${app.quoteCount}" value='${characterOptions[3]}'>${characterOptions[3]}</button>
    </div>
    `;

    app.wrapperEl.append(nextPage);

    const characterButtons = document.querySelector(`#quote-${app.quoteCount}`);
    console.log('new buttons');
    app.onCharacterButtonsClick(characterButtons);
}

app.appendCharacterReveal = (isCorrect) => {
    const nextPage = document.createElement('section');
    nextPage.className = 'page character-reveal';

    const downButton = document.createElement('button');
    downButton.className = 'character-reveal__button';
    downButton.innerHTML = `<i class="fa-solid fa-circle-down"></i>`;

    nextPage.innerHTML = `
        <h2>${app.characterName}</h2>
        <div class="container">
            <p>${isCorrect ? "Correct!" : "Try Again!"}</p>
            <div class="character-reveal__image" style="background-image:url('${app.characterImage}')"></div>
        </div>
    `;

    downButton.addEventListener('click', () => {
        if (app.selectedCharacters.length === 0) {
            app.appendScoreReveal();
        } else {
            app.appendQuote();
        }
        app.transitionPage();
        downButton.disabled = 'true';
    });

    nextPage.append(downButton);

    app.wrapperEl.append(nextPage);
    console.log('reveal appended');
}

app.appendScoreReveal = () => {
    const nextPage = document.createElement('div');
    nextPage.className = 'page results';

    const reloadButton = document.createElement('button');
    reloadButton.innerText = 'Play Again!';

    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = `
        <p><a href="junocollege.com">Created at Juno College</a></p>
        <p>API citation</p>
    `;

    let resultsQuote = [];

    if (app.score <= 5) {
        resultsQuote = [
            "Me fail English? That's unpossible!",
            "Ralph Wiggum"
        ];
    } else if (app.score <= 7) {
        resultsQuote = [
            "There’s only one thing to do at a moment like this: strut!",
            "Bart Simpson"
        ];
    } else {
        resultsQuote = [
            "Everything’s coming up Milhouse.",
            "Milhouse Van Houten"
        ];
    }

    nextPage.innerHTML = `
        <h2>Results</h2>
        <div class="container">
            <p class="results__score">${app.score} <span>/</span> 10</p>
            <p class="results__quote">"${resultsQuote[0]}"<span>- ${resultsQuote[1]}</span></p>
        </div>
    `;

    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });

    nextPage.append(reloadButton);
    nextPage.append(footer);
    app.wrapperEl.append(nextPage);
}

// when the landing page button is clicked...
app.landingPageButton.addEventListener('click', function() {
    app.appendQuote();
    app.landingPageButton.disabled = "true";
    app.transitionPage();
});


// // when the reveal button is clicked...
app.onCharacterButtonsClick = (button) => {

    button.addEventListener('click', function(event) {
        const userChoice = event.target;

        if (userChoice.type === 'button') {

            const allButtons = document.querySelectorAll(`.button-set-${app.quoteCount}`);
            allButtons.forEach((button) => {
                button.disabled = "true";
            });

            if (userChoice.value === app.characterName) {
                userChoice.style.backgroundColor = '#57DC59';
                app.score++;
                app.scoreEl.innerText = app.score;

                app.appendCharacterReveal(true);
            } else {
                userChoice.style.backgroundColor = '#F57171';
                app.appendCharacterReveal(false);
            }
        }

        app.transitionPage();
    });
};



// on page load...
app.init = () => {
    app.getCharacterData();
    app.positionScoreEl();
}

app.init();