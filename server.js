const express = require('express');
const cors = require('cors');

const reviewRouter = require('./routers/review-router.js');
const reportRouter = require('./routers/report-router.js');
const contactRouter = require('./routers/contact-router.js');

const server = express();

server.get('/', (request, response) => {
    response.send('server running, please navigate to an endpoint');
});

server.use(express.json());
server.use(cors());
server.use('/reviews', reviewRouter);
server.use('/reports', reportRouter);
server.use('/contact', contactRouter);

module.exports = server;