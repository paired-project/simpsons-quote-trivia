const app = {};

// Empty array to hold list of characters
app.characterList = [];

// Store landing page button as a variable
app.landingPageButton = document.querySelector('.landing-page__button');

// Store main container as a variable
app.wrapperEl = document.querySelector('.wrapper--main');

// Variable to keep track of which quote the user is on
app.quoteCount = 0;

// Variable to track user score
app.score = 0;

// Variable to use as a factor for the scrolling logic
app.screenCount = 1;

// Variable to store score element
app.scoreEl = document.querySelector('.score');

// Store loading page element
app.loadingPage = document.querySelector('.loading');

// Store error message element
app.errorMessage = document.querySelector('.error-message');

// Create a method that will make an API call for the maximum number of Simpsons quotes available and associated data (quote author, quote, and image)
app.getCharacterData = () => {
    // Show loading screen while fetch is processing
    app.toggleLoading();

    // Show the landing page and score element (initially hidden to prevent visibility before loading)
    document.querySelector('landing-page').classList.toggle('inactive');
    app.scoreEl.classList.toggle('inactive');

    const url = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);

    url.search = new URLSearchParams({
        count: '100'
    });

    // Make the API call to receive data in the form of an array of objects
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                app.errorMessage.classList.toggle('inactive');
                throw new Error(response.statusText);
            }
        })
        .then((jsonData) => {
            console.log(jsonData);

            // Call method on the data to produce a list of all characters provided by the API
            app.getCharacterList(jsonData);

            // Call method on the data to get a list of 10 random quotes
            app.getQuotes(jsonData);

            // Hide loading screen on completion of fetch
            app.toggleLoading();
        });
}

// Method which takes an array and returns a random number between: 0 and the total number of elements within the array
app.randomizer = (arr) => {
    return Math.floor(Math.random() * arr.length);
}

// Method to handle the positioning of the score element
app.positionScoreEl = () => {
    app.scoreEl.style.right = `${(app.wrapperEl.offsetLeft)}px`;

    window.addEventListener('resize', () => {
        app.scoreEl.style.right = `${(app.wrapperEl.offsetLeft)}px`;
    });
}

// Method to toggle the inactive class, displaying or hiding the loading screen
app.toggleLoading = () => {
    app.loadingPage.classList.toggle('inactive');
}

// Method to scroll the page on buttons clicks
// Thank you to George Martsoukos for this article that helped us with the scroll logic!
// https://webdesign.tutsplus.com/tutorials/smooth-scrolling-vanilla-javascript--cms-35165
app.transitionPage = () => {
    scroll({
        top: (window.innerHeight * app.screenCount),
        behavior: "smooth"
    });

    app.screenCount++;
}

// Method which uses the array of all available quotes to store all of the available character names in the app.characterList array
app.getCharacterList = (dataArray) => {
    app.characterList = [];

    dataArray.forEach((characterObject) => {
        const character = characterObject.character;
        if (!app.characterList.includes(character)) {
            app.characterList.push(character);
        }
    });
}

// Method which stores 10 random quotes (quote author, quote, and image) in an array (app.selectedCharacters ), stored in the namespace
    // Once a quote is selected from the array given by the API and passed into the array in the namespace, the quote is deleted from the API-array to avoid selecting duplicate quotes
app.getQuotes = (dataArray) => {
    app.selectedCharacters = [];

    for (let i = 0; i < 10; i++) {
        const index = app.randomizer(dataArray);
        app.selectedCharacters.push(dataArray[index]);
        dataArray.splice(index, 1);
    }
}

// Method will look at the array of 10 randomly selected quotes and corresponding data and:
    // 1. Select the first element from the array
    // 2. From this element, store the quote, quote author, and image of the author in their respective properties in the namespace
    // 3. Delete that element from the array via shift
app.getNextCharacter = () => {
    const nextCharacter = app.selectedCharacters[0];
    app.characterImage = nextCharacter.image;
    app.characterName = nextCharacter.character;
    app.characterQuote = nextCharacter.quote;

    app.selectedCharacters.shift();
}

// Method that generates a list consisting of 3 incorrect characters and the 1 quoted character
app.getCharacterOptions = () => {
    // Create a copy of the character list array WITHOUT the quoted character
    const wrongAnswers = [...app.characterList].filter((character) => {
        return character !== app.characterName;
    });
    
    // Create an empty array that will represent the 4 possible options for the user to select
    const possibleOptions = [];
    // Add the quoted (correct) character to the possible options array
    possibleOptions.push(app.characterName);
    
    // Randomly select 3 characters from the wrong answers array
    // On each loop, push the character to the possible options array and then delete that character from the wrong answers array to avoid duplicate selections
    for (let i = 0; i < 3; i++) {
        const randomIndex = app.randomizer(wrongAnswers);
        possibleOptions.push(wrongAnswers[randomIndex]);
        wrongAnswers.splice(randomIndex, 1);
    }
    
    // Create an empty array that will store a shuffled version of the possible options array
    const shuffledOptions = [];

    // On each loop:
        // 1. Randomly select a character from the possible options array
        // 2. Store this character in the shuffled options array
        // 3. Remove the character from the possible options array to avoid duplicate selections
    for (let i = 0; i < 4; i++) {
        const randomIndex = app.randomizer(possibleOptions);
        shuffledOptions.push(possibleOptions[randomIndex]);
        possibleOptions.splice(randomIndex, 1);
    }

    return shuffledOptions;
}

// Method to append quote and character choices to page
app.appendQuote = () => {
    app.quoteCount++;

    // Call method to prepare the details of the next quoted character
    app.getNextCharacter();

    // Call a method that returns an array of 4 character names for the user to guess the quoted character
    const characterOptions = app.getCharacterOptions();

    // Create a section containing 4 buttons, each representing a character option for the user to select
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

    // Append section to the page (specifically to the wrapper - acting as the container)
    app.wrapperEl.append(nextPage);

    // Store button container element in a variable
    const characterButtons = document.querySelector(`#quote-${app.quoteCount}`);

    // Call method to handle user's character choice
    app.onCharacterButtonsClick(characterButtons);
}

// A method that:
    // 1. Creates a section containing the image of the quoted character and a status detailing if the user's selection was correct or incorrect
    // 2. Appends section to the page along with a down button
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

    // Event listener added to down button that will evaluate if:
    // 1. There is another quote to be presented for the user to guess OR;
        // a. In this event, proceed to the next quote
    // 2. If this is the last quote
        // a. In this event the user is presented with a final score
    downButton.addEventListener('click', () => {
        if (app.selectedCharacters.length === 0) {
            app.appendScoreReveal();
        } else {
            app.appendQuote();
        }

        // Call method to scroll user to the page below
        app.transitionPage();
        downButton.disabled = 'true';
    });

    nextPage.append(downButton);

    app.wrapperEl.append(nextPage);
}

// Method to create and display the user's results at the end
app.appendScoreReveal = () => {
    const nextPage = document.createElement('div');
    nextPage.className = 'page results';

    const reloadButton = document.createElement('button');
    reloadButton.innerText = 'Play Again!';

    const footer = document.createElement('div');
    footer.className = 'footer';
    footer.innerHTML = `
        <p><a href="https://junocollege.com">Created at Juno College</a></p>
        <span>&#8226</span>
        <p><a href="http://thesimpsonsquoteapi.glitch.me/">Simpsons Quote API</p>
    `;

    // Create an array to store a quote/message to display to the user based on their score
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

    // Display message to user
    nextPage.innerHTML = `
        <h2>Results</h2>
        <div class="container">
            <p class="results__score">${app.score} <span>/</span> 10</p>
            <p class="results__quote">"${resultsQuote[0]}"<span>- ${resultsQuote[1]}</span></p>
        </div>
    `;

    // Event listener to reload the page on button click to restart the game
    reloadButton.addEventListener('click', () => {
        window.location.reload();
    });

    nextPage.append(reloadButton);
    nextPage.append(footer);
    app.wrapperEl.append(nextPage);

    document.querySelector('.score').style.opacity = '0';
}

// When the landing page button is clicked, add quote to page and transition to section below
app.landingPageButton.addEventListener('click', function() {
    app.appendQuote();
    app.landingPageButton.disabled = "true";
    app.transitionPage();
});


// Method to handle the user's character selection via button click
app.onCharacterButtonsClick = (button) => {

    // Event listener waits for one of the buttons to be clicked
    button.addEventListener('click', function(event) {
        const userChoice = event.target;

        if (userChoice.type === 'button') {

            // Upon click, disable all the buttons
            const allButtons = document.querySelectorAll(`.button-set-${app.quoteCount}`);
            allButtons.forEach((button) => {
                button.disabled = "true";
            });

            // Highlight the button in green (correct) or red (incorrect) and proceed to reveal the character with a message confirming if the user is correct/incorrect via append character reveal
            // Track user score
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

        // Call method to scroll to the character reveal page below
        app.transitionPage();
    });
};

// Init method to run fetch request and score positioning method
app.init = () => {
    app.getCharacterData();
    app.positionScoreEl();
}

app.init();