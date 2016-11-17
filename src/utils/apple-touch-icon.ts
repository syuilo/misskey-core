import * as express from 'express';

const app = express.Router();
app.get('/apple-touch-icon.png', (req, res) => res.sendFile(__dirname + '/resources/apple-touch-icon.png'));

export default app;
