import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000

app.get('/', (req: Request, res: Response) => {
    res.send('Well done!');
})

app.listen(PORT, () => {
    console.log(`The application is listening on port http://127.0.0.1:${PORT}/`);
})