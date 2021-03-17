const express = require('express');
const router = express.Router();

const Google = require('../auth.js');

const spreadSheetId = '1DQgbGjpOnNlHXZ_E8ait66euuGSaP1NXPLhE7qNMd80';

router.get('/', async (request, response) => {
    let reportsTable = [];

    const client = await Google.auth().getClient();

    const getRows = await Google.googleSheets(client).spreadsheets.values.get({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: 'Reports!A:E'
    }).then(res => {
        res.data.values.map((report, index) => {
            if(index != 0) {
                reportsTable.push({
                    "report_id": report[0],
                    "time_stamp": report[1],
                    "report_reason": report[2],
                    "extra_details": report[3],
                    "review_id": report[4]
                });
            }
        });
        return(reportsTable);
    })
    .catch(error => {
        console.log(`${error.message}\n${error}`);
        return(error);
    });

    response.json(getRows);
});

router.post('/', async (request, response) => {
    const newReport = request.body;

    const client = await Google.auth().getClient();

    await Google.googleSheets(client).spreadsheets.values.append({
        auth: Google.auth(),
        spreadsheetId: spreadSheetId,
        range: "Reports",
        valueInputOption: "RAW",
        resource: {
            values: [
                [newReport.report_id, newReport.time_stamp, newReport.report_reason, newReport.extra_details, newReport.review_id]
            ],
        }
    });

    response.json({ created: newReport });
});

module.exports = router;