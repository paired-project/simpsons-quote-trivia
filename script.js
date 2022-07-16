const app = {};
app.characterDataArray = [];

app.getQuoteUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);
app.getCharactersUrl = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);

app.getCharactersUrl.search = new URLSearchParams({
    count: '100'
});

app.landingPageButton = document.querySelector('#landing-page-button');
app.revealButton = document.querySelector('#reveal-button');
app.nextQuoteButton = document.querySelector('#next-quote-button');

app.landingPage = document.querySelector('.main-content__text-container--landing-page');
app.mainPage = document.querySelector('.main-content__text-container--main');
app.revealPage = document.querySelector('.main-content__text-container--main-reveal');

app.headingElement = app.mainPage.children[0];
// app.quoteElement = app.mainPage.children[1];
app.quoteElements = document.querySelectorAll("blockquote");
app.characterHeading = document.querySelector("#character-name");

app.getCharacterData = (url) => {
    const buttonText = app.landingPageButton.children[0];
    const buttonIcon = app.landingPageButton.children[1];

    app.landingPageButton.disabled = true;
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

            app.landingPageButton.disabled = false;
            buttonText.classList.toggle('hide');
            buttonIcon.classList.toggle('hide');
        });
}

app.getCharacterList = (data) => {
    console.log(data);
}

app.getQuote = (data) => {
    app.characterName = data[0].character;
    app.characterQuote = data[0].quote;

    console.log(app.characterName);
    console.log(app.characterQuote);
}

app.updateElements = () => {
    app.quoteElements.forEach((quoteElement) => {
        quoteElement.textContent = app.characterQuote;
    });

    app.characterHeading.textContent = app.characterName;
}

app.landingPageButton.addEventListener('click', function() {
    app.updateElements();
    app.getCharacterData(app.getQuoteUrl);

    app.landingPage.classList.toggle('inactive');
    app.mainPage.classList.remove('inactive');
});

app.revealButton.addEventListener('click', function() {
    app.mainPage.classList.toggle('inactive');
    app.revealPage.classList.toggle('inactive');
});

app.nextQuoteButton.addEventListener('click', function() {
    app.revealPage.classList.toggle('inactive');
    
    app.updateElements();
    app.getCharacterData(app.getQuoteUrl);
    
    app.mainPage.classList.toggle('inactive');
});


app.init = () => {
    // app.getCharacterData(app.getCharactersUrl);
    app.getCharacterData(app.getQuoteUrl);
}

app.init();