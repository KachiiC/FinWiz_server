# FinWiz Server
The server for Finwiz - the investment portfolio app.

## Setup Instructions

1. Clone this repo `https://github.com/KachiiC/FinWiz_server.git` into your desired local directory
2. At the root directory run <code>npm i</code>
3. Create a `.env` file in the `src` directory.
4. Create environment variables for `DATABASE_URL`, `STOCK_KEY`, `COINCAP_KEY` and `NEWS_KEY`. The database url (create database name beforehand) should be a PostgreSQL database of the format: `postgresql://username:password@localhost:5432/databasename?schema=public`. The stock API key can be obtained by signing up to [iex cloud](https://iexcloud.io/). The coincap API key can be obtained by signing up to [CoinMarketCap](https://coinmarketcap.com/api/). The news API key on [News API](https://newsapi.org/)
5. Run the Prisma database migration <code>npx prisma migrate dev --name callWhatever</code>
6. Run <code>npm run start</code>