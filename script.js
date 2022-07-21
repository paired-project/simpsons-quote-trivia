const app = {};

// URL to retrieve a random quote object
app.getQuoteUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);

// URL to retrieve all available quote objects
app.getCharactersUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);
app.getCharactersUrl.search = new URLSearchParams({
    count: '100'
});

// empty array to hold list of characters
app.characterList = [];

app.landingPageButton = document.querySelector('#landing-page-button');
app.revealButton = document.querySelector('#reveal-button');
app.nextQuoteButton = document.querySelector('#next-quote-button');

app.landingPage = document.querySelector('.main-content__text-container--landing-page');
app.mainPage = document.querySelector('.main-content__text-container--main');
app.revealPage = document.querySelector('.main-content__text-container--main-reveal');
app.loadingPage = document.querySelector('.loading');

app.quoteElements = document.querySelectorAll("blockquote");
app.characterHeading = document.querySelector("#character-name");

app.imageElements = document.querySelectorAll('.main-content__img-container');

app.getCharacterData = (url) => {
    const buttonText = app.landingPageButton.children[0];
    const buttonIcon = app.landingPageButton.children[1];

    // disable the landing page button on page load
    app.landingPageButton.disabled = true;
    // hide the text of the landing page button and show the loading icon
    buttonText.classList.toggle('hide');
    buttonIcon.classList.toggle('hide');

    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then((jsonData) => {
            if (jsonData[1]) {
                app.getCharacterList(jsonData);
            } else {
                app.getQuote(jsonData);
            }

            // enable the landing page button once the initial API calls have completed
            app.landingPageButton.disabled = false;
            // hide the loading icon and display landing page button's
            buttonText.classList.toggle('hide');
            buttonIcon.classList.toggle('hide');
        });
}

// method which uses the array of all available quotes to store all of the available character names in the app.characterList array
app.getCharacterList = (data) => {
    console.log(data);
}

// method which stores the new character name and quotes in namespace variables after receving the API response for a random quote
app.getQuote = (data) => {
    app.characterName = data[0].character;
    app.characterQuote = data[0].quote;
    app.characterImage = data[0].image;

    console.log(app.characterName);
    console.log(app.characterQuote);
    // console.log(app.imageElements);
}

// method to update the HTML elements using the data from the next random quote object
app.updateElements = () => {
    // update the quote elements with the new quote
    app.quoteElements.forEach((quoteElement) => {
        quoteElement.textContent = app.characterQuote;
    });


    // update the reveal page heading with the new character name
    app.characterHeading.textContent = app.characterName;
    
    app.imageElements[1].innerHTML = `<div style="background-image: url(${app.characterImage})"></div>`;
}

app.updateImages = () => {
    app.imageElements.forEach((imageElement) => {
        imageElement.classList.toggle('inactive');
    })
}

// when the landing page button is clicked...
app.landingPageButton.addEventListener('click', function() {
    // update the HTML elements with the values store in namespace variables from the previous api call
    app.updateElements();
    // load the next quote
    app.getCharacterData(app.getQuoteUrl);

    // hide the landing page and display the main page
    app.mainPage.classList.toggle('inactive');
    app.landingPage.classList.toggle('inactive'); 
});

// when the reveal button is clicked...
app.revealButton.addEventListener('click', function() {
    // hide the main page and display the reveal page
    app.mainPage.classList.toggle('inactive');
    app.revealPage.classList.toggle('inactive');

    app.updateImages();
});

// when the next quote button is clicked...
app.nextQuoteButton.addEventListener('click', function() {
    // display the loading page
    app.loadingPage.classList.toggle('inactive');    
    
    // hide the reveal page
    app.revealPage.classList.toggle('inactive');
    
    // after 2s...
    setTimeout(() => {
        // update the HTML elements with the values store in namespace variables from the previous api call
        app.updateElements();
        
        // load the next quote
        app.getCharacterData(app.getQuoteUrl);

        // hide the loading page
        app.loadingPage.classList.toggle('inactive');
    }, 2000)
    
    
    // display the main page
    app.mainPage.classList.toggle('inactive');

    app.updateImages();
});

// on page load...
app.init = () => {
    // create an array of available character names
    app.getCharacterList(app.getCharactersUrl);

    // load the first quote 
    app.getCharacterData(app.getQuoteUrl);
}

app.init();