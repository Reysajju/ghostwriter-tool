import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const PORT = 5002;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/test', (req, res) => {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    res.json({ received: req.body });
});

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
