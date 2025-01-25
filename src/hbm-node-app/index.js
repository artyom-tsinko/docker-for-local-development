const express = require('express');
const app = express();
const PORT = 3000;
const HOST = 'localhost';

app.get('/', (req, res) => {

    console.log('Environment Variables:', process.env);

    console.log('Log something else during debug');

    res.json(process.env);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Graceful shutdown

process.on('SIGTERM', () => {
    console.log('SIGTERM signal received.');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
});
  
process.on('SIGINT', () => {
    console.log('SIGINT signal received.');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
});