# Digital Nomad

Compare 500+ cities by cost of living, weather, internet speed, safety, and 12+ data points — filtered to exactly what you need.

Built for digital nomads, remote workers, and expats who want data-driven decisions about where to live next.

## Features

- **City comparison** — Browse and filter 500+ cities with rich data cards showing cost, weather, safety, and internet speed at a glance
- **Advanced filters** — Filter by region, temperature range, price range, weather conditions, safety level, pollution, internet speed, and more
- **Detailed city profiles** — Deep-dive into any city with cost breakdowns (nomad, expat, local, family), internet rankings, air quality, and monthly weather patterns
- **Monthly weather calendar** — See temperature, weather conditions, and climate scores for every month of the year
- **Sort & search** — Sort by total score, cost, internet speed, or safety; search by city or country name

## Tech Stack

**Frontend:** Nuxt 3, Vue 3, TypeScript, Tailwind CSS, TanStack Vue Query, VueUse, Lucide Icons

**Backend:** Nuxt Server API, Prisma ORM, PostgreSQL (Neon serverless)

**Deployment:** Vercel (Frankfurt region)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/whoisarjen/digital-nomad.git
   cd digital-nomad
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example:
   ```bash
   cp .env.example .env
   ```
   Fill in the required environment variables.

4. Set up the database:
   ```bash
   npx prisma db push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

> **Note:** The `predev` script automatically pulls environment variables from Vercel. If you're not using Vercel, remove the `"predev"` script from `package.json` to avoid errors on startup.

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run typecheck` | Run TypeScript type checking |

## Project Structure

```
src/
├── assets/css/        # Tailwind CSS styles
├── components/        # Vue components (filters, cards, pickers)
├── composables/       # Vue composables (data fetching with TanStack Query)
├── pages/             # Nuxt pages (index, cities/[slug])
├── plugins/           # Vue Query plugin
├── public/            # Static assets (logo, favicons)
├── server/
│   ├── api/           # REST API endpoints
│   │   ├── cities/    # City list, detail, and filter endpoints
│   │   └── cron/      # Data enrichment jobs
│   └── utils/         # Prisma client and utility functions
└── shared/            # Shared schemas (Zod) and utilities
prisma/
└── schema.prisma      # Database schema
```

## Data Architecture

City data is enriched through scheduled cron jobs that collect data from multiple external APIs and indices. Each job runs independently and updates the shared PostgreSQL database with weather patterns, quality-of-life indices, internet speed rankings, and city photos.

All data source URLs and API keys are configured via environment variables — see `.env.example` for the full list.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Author

Built by [Kamil](https://github.com/whoisarjen) — feedback welcome at kamilow97@gmail.com.
