const { google } = require('googleapis');

module.exports = {
    auth,
    googleSheets
}

function auth() {
    const auth = new google.auth.GoogleAuth({
        keyFile: 'credentials.json',
        scopes: 'https://www.googleapis.com/auth/spreadsheets'
    })

    return(auth);
};

function googleSheets(client) {
    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });

    return(googleSheets);
};