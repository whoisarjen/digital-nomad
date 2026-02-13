# Digital Nomad

Compare 500+ cities by cost of living, weather, internet speed, safety, and more — filtered to what matters most to you.

Built for digital nomads, remote workers, and expats making data-driven decisions about where to live next.

**[Live](https://nomad.whoisarjen.com)**

## Features

- **City comparison** — Browse and filter 500+ cities with data cards showing cost, weather, safety, and internet speed at a glance
- **Advanced filters** — Region, temperature range, price range, weather conditions, safety level, pollution, internet speed, and more
- **Detailed city profiles** — Cost breakdowns (nomad, expat, local, family), internet rankings, air quality, and monthly weather patterns
- **Monthly weather calendar** — Temperature, conditions, and climate scores for every month of the year
- **Sort & search** — Sort by total score, cost, internet speed, or safety; search by city or country name

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Nuxt 3, Vue 3, TypeScript, Tailwind CSS |
| Data Fetching | TanStack Vue Query, VueUse |
| Backend | Nuxt Server API, Prisma ORM |
| Database | PostgreSQL (Neon serverless) |
| Icons | Lucide |
| Deployment | Vercel (Frankfurt region) |

## Getting Started

**Prerequisites:** Node.js 18+, a [Neon](https://neon.tech) PostgreSQL database

```bash
git clone https://github.com/whoisarjen/digital-nomad.git
cd digital-nomad
npm install
cp .env.example .env   # fill in your environment variables
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The `predev` script pulls environment variables from Vercel. Remove it from `package.json` if you're not using Vercel.

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── components/        # Vue components (filters, cards, pickers)
├── composables/       # Data fetching composables (TanStack Query)
├── pages/             # Nuxt pages (index, cities/[slug])
├── server/
│   ├── api/           # REST API (cities, filters, cron jobs)
│   └── utils/         # Prisma client
└── shared/            # Shared schemas (Zod)
prisma/
└── schema.prisma      # Database schema
```

## Data Architecture

City data is enriched through scheduled cron jobs that collect data from multiple external APIs. Each job runs independently and updates the PostgreSQL database with weather patterns, quality-of-life indices, internet speed rankings, and city photos.

All data source URLs and API keys are configured via environment variables.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](LICENSE).

## Author

Built by [Kamil Owczarek](https://github.com/whoisarjen).
