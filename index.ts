import express, { Request, Response } from 'express';
import router from './router';

const app = express();
const PORT = 8000

app.use(router)

app.listen(PORT, () => {
    console.log(`The application is listening on port http://127.0.0.1:${PORT}/`);
})