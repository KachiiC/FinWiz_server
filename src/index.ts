import dotenv from "dotenv"
import Express, { json } from 'express'
import router from './router'
import cors from 'cors'

dotenv.config()
const App = Express()
const PORT = process.env.PORT || 8000

App.use(cors())
    .use(json())
    .use(router)

App.listen(PORT, () => {
    console.log(`Running at http://127.0.0.1:${PORT}/`);
})