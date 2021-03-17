const express = require('express');
const router = express.Router();

const Google = require('../auth.js');

const spreadSheetId = '1DQgbGjpOnNlHXZ_E8ait66euuGSaP1NXPLhE7qNMd80';

router.get('/', async (request, response) => {
    let contactTable = [];

    const client = await Google.auth().getClient();

    const getRows = await Google.googleSheets(client).spreadsheets.values.get({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: 'Contact!A:J'
    }).then(res => {
        res.data.values.map((contact, index) => {
            if(index != 0) {
                contactTable.push({
                    "id": contact[0],
                    "contactPurpose": contact[1],
                    "email": contact[2],
                    "issue": contact[3],
                    "size": contact[4],
                    "date": contact[5],
                    "phone": contact[6],
                    "location": contact[7],
                    "time": contact[8],
                    "info": contact[9]
                });
            }
        });
        return(contactTable);
    })
    .catch(error => {
        console.log(`${error.message}\n${error}`);
        return(error);
    });

    response.json(getRows);
});

router.post('/', async (request, response) => {
    const newContact = request.body;

    const client = await Google.auth().getClient();

    await Google.googleSheets(client).spreadsheets.values.append({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: "Contact",
        valueInputOption: "RAW",
        resource: {
            values: [
                [newContact.id, newContact.contactPurpose, newContact.email, newContact.issue, newContact.size, newContact.date, newContact.phone, newContact.location, newContact.time, newContact.info]
            ],
        }
    });

    response.json({ created: newContact });
});

module.exports = router;