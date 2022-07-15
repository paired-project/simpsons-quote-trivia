const app = {};
app.characterDataArray = [];

app.url = new URL(`https://thesimpsonsquoteapi.glitch.me/quotes`);
// app.characterName = '';
// app.characterQuote = '';

// app.url.search = new URLSearchParams({
//     count: '100'
// })

app.characterData = () => {
    fetch(app.url)
    .then((response) => {
        console.log('response:', response);
        return response.json();
    })
    .then((jsonData) => {
        console.log(jsonData);
        app.getQuote(jsonData);
    })
}


app.getQuote = (data) => {
    app.characterName = data[0].character;
    app.characterQuote = data[0].quote;

    console.log(app.characterName);
    console.log(app.characterQuote);
}



app.init = () => {
    app.characterData();
}



app.init();