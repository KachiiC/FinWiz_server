<img src="https://user-images.githubusercontent.com/32797002/169280194-9103ceac-adf5-42c7-bcb1-ba3803956c34.png" alt="FinWiz Logo" width="200"/>

# FinWiz Server
The server for [FinWiz Client](https://github.com/KachiiC/FinWiz_client) - the investment portfolio app. This is was a 2 week thesis project for the Codeworks coding bootcamp (Feb 2022 cohort). The collaborators for the whole project are Kachi Cheong, Silky Ng, Tom Broad and Nicholas Allen.

## Tech Stack Used
We had used a node JS Express server, node-caching, with PostgreSQL for the database with Prisma ORM. API data is obtained from [CoinMarketCap](https://coinmarketcap.com/api/), [iex cloud](https://iexcloud.io/) and [News API](https://newsapi.org/)

## Setup Instructions

1. Clone this repo `https://github.com/KachiiC/FinWiz_server.git` into your desired local directory
2. At the root directory run <code>npm i</code>
3. Create a `.env` file in the `src` directory.
4. Create environment variables for `DATABASE_URL`, `STOCK_KEY`, `COINCAP_KEY` and `NEWS_KEY`. The database url (create database name beforehand) should be a PostgreSQL database of the format: `postgresql://username:password@localhost:5432/databasename?schema=public`. The stock API key can be obtained by signing up to [iex cloud](https://iexcloud.io/). The coincap API key can be obtained by signing up to [CoinMarketCap](https://coinmarketcap.com/api/). The news API key on [News API](https://newsapi.org/)
5. Run the Prisma database migration <code>npx prisma migrate dev --name callWhatever</code>
6. Run <code>npm run start</code>
7. This server is to be used with the [FinWiz Client](https://github.com/KachiiC/FinWiz_client)