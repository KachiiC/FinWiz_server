<img src="https://user-images.githubusercontent.com/32797002/169280194-9103ceac-adf5-42c7-bcb1-ba3803956c34.png" alt="FinWiz Logo" width="200"/>

# FinWiz Server
The server for [FinWiz Client](https://github.com/KachiiC/FinWiz_client) - the investment portfolio app. This is was a 2 week thesis project for the [Codeworks](https://codeworks.me/) coding bootcamp (Feb 2022 cohort). The collaborators for the whole project are [Kachi Cheong](https://github.com/KachiiC), [Silky Ng](https://github.com/silkster87), [Tom Broad](https://github.com/MrBroadie) and [Nicholas Allen](https://github.com/nicallennn). A video presenting our app is [here](https://youtu.be/KAbI9Jo6Lbg)

## Tech Stack Used
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=Prisma&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=flat&logo=postgresql&logoColor=white) <br>
We had used a node JS Express server, [node-caching](https://github.com/node-cache/node-cache), with PostgreSQL for the database with [Prisma ORM](https://www.prisma.io/). API data is obtained from [CoinMarketCap](https://coinmarketcap.com/api/), [iex cloud](https://iexcloud.io/) and [News API](https://newsapi.org/)

## Setup Instructions

1. Clone this repo into your desired local directory:
```bash
   git clone https://github.com/KachiiC/FinWiz_server.git
``` 
2. At the root directory run ``npm i`` 

3. Create a `.env` file in the `src` directory.
4. Create environment variables for `DATABASE_URL`, `STOCK_KEY`, `COINCAP_KEY` and `NEWS_KEY`:
```env
  DATABSE_URL=
  STOCK_KEY=
  COINCAP_KEY=
  NEWS_KEY=
```

 The `DATABASE_URL` (create database name beforehand) should be a PostgreSQL database of the format: `postgresql://username:password@localhost:5432/databasename?schema=public`. 
 
 The stock API key can be obtained by signing up to [iex cloud](https://iexcloud.io/). 
 
 The coincap API key can be obtained by signing up to [CoinMarketCap](https://coinmarketcap.com/api/). 
 
 The news API key on [News API](https://newsapi.org/)
 
5. Run the Prisma database migration 
```bash
  npx prisma migrate dev --name callWhatever
```
6. Run <code>npm run start</code>
7. This server is to be used with the [FinWiz Client](https://github.com/KachiiC/FinWiz_client)