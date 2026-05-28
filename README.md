# Spiro's Restaurant Ordering System

A full-stack restaurant ordering platform built for **Spiro's** — featuring a Vue.js web app, Node.js/Express REST API, MySQL database, and an Android mobile app. Everything runs out of the box with a single Docker command.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue.js 3, Vuex, Vue Router, Axios |
| Backend | Node.js, Express, JWT Auth, Bcrypt |
| Database | MySQL 8 |
| Mobile | Android (Kotlin, Retrofit) |
| Email | Brevo (Sendinblue) SMTP |
| DevOps | Docker, Docker Compose |

---

## Features

- Browse menu by category (tacos, burritos, nachos, drinks, desserts, sides)
- Add to cart and checkout with order confirmation email
- Table booking system
- JWT-based user authentication and registration
- Admin dashboard to manage orders and bill status
- Android mobile app with the same ordering flow
- Promotions / discount page
- Order history ("My Orders")

---

## Quick Start (Docker)

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Mac / Linux

```bash
./run.sh
```

### Windows

```bat
run.bat
```

Add `--mobile` to also open Android Studio for the mobile app.

Once running:
- Web app → http://localhost:8080
- API → http://localhost:8000

---

## Manual Setup (without Docker)

### 1. Clone the repo

```bash
git clone https://github.com/goutham45/Spiro-s.git
cd Spiro-s
```

### 2. Database

Import the schema and seed data into MySQL:

```bash
mysql -u root -p < database/qfood_init.sql
mysql -u root -p qfood < database/spiros_menu.sql
```

### 3. Backend

```bash
cd backend
cp .env.template .env     # fill in your values
npm install
npm start                 # runs on port 8000
```

**Required `.env` values:**

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host (e.g. `localhost`) |
| `DB_PORT` | MySQL port (default `3306`) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name (e.g. `qfood`) |
| `JWT_SECRET` | Secret key for JWT signing |
| `BREVO_API_KEY` | Brevo SMTP API key for order emails |
| `FROM_EMAIL` | Sender email address |
| `RESTAURANT_EMAIL` | Email address to receive order notifications |
| `ALLOW_ORIGIN` | Comma-separated allowed CORS origins |

### 4. Frontend

```bash
cd frontend
cp .env.template .env     # set VUE_APP_API_BASE_URL=http://localhost:8000
npm install
npm run serve             # runs on port 8080
```

### 5. Mobile (Android)

Open the `mobile/` folder in Android Studio, update the base URL in `apis/ServiceBuilder.kt` to your machine's IP, then run on an emulator or device.

---

## Project Structure

```
Spiro-s/
├── backend/          # Express REST API
│   ├── controllers/  # Route handlers
│   ├── models/       # MySQL query models
│   ├── routes/       # API routes
│   ├── middleware/   # JWT auth middleware
│   └── config/       # DB connection
├── frontend/         # Vue.js 3 web app
│   └── src/
│       ├── pages/    # Route-level views
│       ├── components/
│       ├── store/    # Vuex store
│       └── router/
├── mobile/           # Android app (Kotlin)
├── database/         # SQL schema & seed files
├── scraper/          # UberEats menu scraper (Python)
├── docker-compose.yml
├── run.sh / run.bat  # One-command start scripts
└── proposal.html     # Project proposal
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login and receive JWT |
| GET | `/api/food` | Get all menu items |
| GET | `/api/food/:type` | Get menu items by category |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart` | Get cart items |
| POST | `/api/checkout` | Place order |
| GET | `/api/myorders` | Get order history |
| POST | `/api/booktable` | Book a table |
| GET/PUT | `/api/billstatus` | Admin: manage order status |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file.
