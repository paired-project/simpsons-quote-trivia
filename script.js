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

app.landingPage = document.querySelector('.main-content__text-container--landing-page');
app.mainPage = document.querySelector('.main-content__text-container--main');
app.revealPage = document.querySelector('.main-content__text-container--main-reveal');
app.loadingPage = document.querySelector('.loading');

app.quoteElements = document.querySelectorAll("blockquote");
app.characterHeading = document.querySelector("#character-name");

app.imageElements = document.querySelectorAll('.main-content__img-container');

app.getCharacterData = () => {
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
        });
}

app.randomizer = (arr) => {
    return Math.floor(Math.random() * arr.length);
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


//     // update the reveal page heading with the new character name
//     app.characterHeading.textContent = app.characterName;
    
//     app.imageElements[1].innerHTML = `<div style="background-image: url(${app.characterImage})"></div>`;
// }

// app.updateImages = () => {
//     app.imageElements.forEach((imageElement) => {
//         imageElement.classList.toggle('inactive');
//     })
// }

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
    console.log(app.quoteCount);
    app.getNextCharacter();
    const characterOptions = app.getCharacterOptions();

    const nextPage = document.createElement('div');
    nextPage.className = 'quote';
    
    nextPage.innerHTML = `
    <h2>Who Said...</h2>
    <blockquote>${app.characterQuote}</blockquote>
    <div id='quote-${app.quoteCount}'>
        <button type="button" class="character-option" value='${characterOptions[0]}'>${characterOptions[0]}</button>
        <button type="button" class="character-option" value='${characterOptions[1]}'>${characterOptions[1]}</button>
        <button type="button" class="character-option" value='${characterOptions[2]}'>${characterOptions[2]}</button>
        <button type="button" class="character-option" value='${characterOptions[3]}'>${characterOptions[3]}</button>
    </div>
    `;
    console.log(nextPage);

    app.mainContent.append(nextPage);

    const characterButtons = document.querySelector(`#quote-${app.quoteCount}`);
    app.onCharacterButtonsClick(characterButtons);

    // console.log(characterButtons);
    // characterButtons.addEventListener('click', app.onCharacterButtonsClick(event));
}

// when the landing page button is clicked...
app.landingPageButton.addEventListener('click', function() {
    app.appendQuote();
});

// // when the reveal button is clicked...
app.onCharacterButtonsClick = (div) => {

    div.addEventListener('click', function(event) {
        if (event.target.type === 'button') {

            const nextPage = document.createElement('div');

            nextPage.innerHTML = `
                <h2>${app.characterName}</h2>
                <div>
                    <p></p>
                    <div></div>
                </div>
            `;
        }
        
    })
    
    


};

// // when the next quote button is clicked...
// app.nextQuoteButton.addEventListener('click', function() {
//     // display the loading page
//     app.loadingPage.classList.toggle('inactive');    
    
//     // hide the reveal page
//     app.revealPage.classList.toggle('inactive');
    
//     // after 2s...
//     setTimeout(() => {
//         // update the HTML elements with the values store in namespace variables from the previous api call
//         app.updateElements();
        
//         // load the next quote
//         app.getCharacterData(app.getQuoteUrl);

//         // hide the loading page
//         app.loadingPage.classList.toggle('inactive');
//     }, 2000)
    
    
//     // display the main page
//     app.mainPage.classList.toggle('inactive');

//     app.updateImages();
// });

// on page load...
app.init = () => {
    // create an array of available character names
    // load the quotes
    //app.getCharacterList();
    app.getCharacterData();
}

app.init();