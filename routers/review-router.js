const express = require('express');

const Google = require('../auth.js');

const router = express.Router();

const spreadSheetId = '1DQgbGjpOnNlHXZ_E8ait66euuGSaP1NXPLhE7qNMd80';

let reviewsTable = [];

router.get('/', async (request, response) => {
    reviewsTable = [];
    
    //create client instance for auth
    const client = await Google.auth().getClient();

    // read rows from spreadsheet
    const getRows = await Google.googleSheets(client).spreadsheets.values.get({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: 'Reviews!A:F'
    }).then(res => {
        res.data.values.map((review, index) => {
            if(index != 0) {
                reviewsTable.push({
                    "review_id": review[0],
                    "email": review[1],
                    "name": review[2],
                    "time_stamp": review[3],
                    "rating": review[4],
                    "review_content": review[5]
                });
            }
        });
        return(reviewsTable);
    })
    .catch(error => {
        console.log(error);
        return(error);
    });

    response.status(200).json(getRows)
});

router.post('/', async (request, response) => {
    const newReview = request.body;

    //create client instance for auth
    const client = await Google.auth().getClient();

    // write row(s) to spreadsheet
    await Google.googleSheets(client).spreadsheets.values.append({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: "Reviews",
        valueInputOption: "RAW",
        resource: {
            values: [
                [newReview.review_id, newReview.email, newReview.name, newReview.time_stamp, newReview.rating, newReview.review_content]
            ],
        }
    })

    response.status(201).json({ created: newReview });
});

module.exports = router;