import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({ message: 'Auth service is running' });
});

export default router;
