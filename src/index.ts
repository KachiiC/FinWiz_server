import Express, { json } from 'express';
import router from './router';
import cors from 'cors'

const app = Express();
const PORT = 8000

app.use(cors())
    .use(json())
    .use(router)

app.listen(PORT, () => {
    console.log(`The application is listening on port http://127.0.0.1:${PORT}/`);
})