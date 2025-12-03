<<<<<<< HEAD
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
=======
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
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
