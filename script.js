const app = {};
app.characterDataArray = [];

app.getQuoteUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);
app.getCharactersUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);

app.getCharactersUrl.search = new URLSearchParams({
    count: '100'
});

app.getCharacterData = (url) => {
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((jsonData) => {
            if (jsonData[1]) {
                app.getCharacterList(jsonData);
            } else {
                app.getQuote(jsonData);
            }
        })
}

app.getCharacterList = (data) => {
    console.log(data);
    // add error handling!!
}

app.getQuote = (data) => {
    app.characterName = data[0].character;
    app.characterQuote = data[0].quote;

    console.log(app.characterName);
    console.log(app.characterQuote);
}

app.landingPageButton = document.querySelector('#landing-page-button');
app.mainPageButton = document.querySelector('#main-page-button');

app.landingPage = document.querySelector('.main-content__text-container--landing-page');
app.mainPage = document.querySelector('.main-content__text-container--main');

app.headingElement = app.mainPage.children[0];
app.quoteElement = app.mainPage.children[1];


app.landingPageButton.addEventListener('click', function() {
    // app.headingElement.textContent = app.characterName;
    app.quoteElement.textContent = app.characterQuote;

    app.landingPage.classList.toggle('inactive');
    app.mainPage.classList.remove('inactive');
})

// app.mainPageButton.addEventListener('click', function() {

// })


app.init = () => {
    // app.getCharacterData(app.getCharactersUrl);
    app.getCharacterData(app.getQuoteUrl);
}

app.init();