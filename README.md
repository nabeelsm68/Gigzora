# Gigzora CRM

Gigzora is an auto lead scraper and mail sender built with Next.js, Python, and Supabase. It allows users to scrape Google Maps for business leads, filter them, and send personalized email campaigns using Brevo.

## Features

- **Auto Scraper**: Headless Playwright scraper that queries Google Maps for leads based on search terms.
- **Email Campaigns**: Sends personalized emails to scraped leads via Brevo. Features live previews, placeholder injections, and a test mode.
- **Obsidian Dark Mode UI**: A fully responsive, modern bento-box dashboard built with Tailwind CSS.
- **Supabase Integration**: Real-time database tracking for leads, email activities, and analytics.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Recharts, Lucide Icons
- **Backend/Scraping**: Python, Playwright, BeautifulSoup4
- **Database**: Supabase (PostgreSQL)
- **Email Provider**: Brevo (formerly Sendinblue)

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.9+
- Supabase Account
- Brevo Account

### 1. Database Setup
Execute the SQL commands in `database/migration.sql` within your Supabase project's SQL Editor to set up the necessary tables (`leads`, `emails_sent`, `activities`) and trigger functions.

### 2. Environment Variables
Create a `.env` file in the root directory and inside `zency-crm-dashboard` with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Brevo
BREVO_API_KEY=your_brevo_api_key
```

> **Note:** Never commit your `.env` files. The `.gitignore` has been pre-configured to exclude them.

### 3. Start the Application

First, install the Python dependencies:
```bash
pip install -r requirements.txt
playwright install
```

Then, install Node dependencies and start the dev server:
```bash
cd zency-crm-dashboard
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Disclaimer
Ensure that you comply with Google Maps Terms of Service and Anti-Spam laws (like CAN-SPAM, GDPR) before running scrapers and email campaigns. This tool is for educational purposes.
