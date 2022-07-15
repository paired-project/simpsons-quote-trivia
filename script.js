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
}

app.getQuote = (data) => {
    app.characterName = data[0].character;
    app.characterQuote = data[0].quote;

    console.log(app.characterName);
    console.log(app.characterQuote);
}

app.init = () => {
    app.getCharacterData(app.getCharactersUrl);
    app.getCharacterData(app.getQuoteUrl);
}

app.init();