# VictoryLane

VictoryLane is a full-stack Ghanaian fashion e-commerce application. Customers can browse products, manage a cart and wishlist, place orders, track delivery, and submit custom requests. Administrators manage products, categories, customers, requests, and orders.

## Stack

- Frontend: React 18, Vite, Tailwind CSS, Zustand
- Backend: ASP.NET Core 8, Entity Framework Core, PostgreSQL
- Payments: Paystack (card and Mobile Money)
- Media: Cloudinary
- AI: Google Gemini
- Deployment: Vercel (frontend) and Render-compatible Docker deployment (API)

## Run locally

### Frontend

Requirements: Node.js 18–20 and npm.

```bash
npm install
Copy-Item .env.example .env
npm run dev
```

The Vite app runs at `http://localhost:5173`. Set `VITE_API_URL` only when pointing the frontend at a deployed API; locally, Vite proxies `/api` to the backend.

### Backend

Requirements: .NET 8 SDK and PostgreSQL. Create `server/appsettings.Development.json` (it is ignored by Git):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=victorylane;Username=postgres;Password=your-password"
  },
  "Jwt": { "Secret": "use-a-long-random-secret-at-least-32-characters" },
  "Admin": {
    "Email": "admin@example.com",
    "Password": "use-a-strong-unique-password"
  },
  "Cloudinary": { "CloudName": "", "ApiKey": "", "ApiSecret": "" },
  "Gemini": { "ApiKey": "" },
  "Paystack": { "SecretKey": "" },
  "FrontendUrl": "http://localhost:5173"
}
```

Then run:

```bash
dotnet run --project server/VictoryLane.Api.csproj
```

The API listens on `http://localhost:5000`. It creates the database schema and seeds starter products on first run. Admin credentials are required and are never supplied by a default value.

## Payments

Set `VITE_PAYSTACK_PUBLIC_KEY` in the frontend and `Paystack__SecretKey` in the API environment. Card and Mobile Money payments are verified by the API against Paystack before an order is marked paid. Bank transfers are recorded as pending and require a customer-provided transfer reference.

Do not expose a Paystack secret key in any `VITE_` variable or in frontend source.

## Deploy

Deploy the frontend to Vercel and the API using `render.yaml` (or another ASP.NET Core host). Configure these API environment variables:

```text
ConnectionStrings__DefaultConnection
Jwt__Secret
Admin__Email
Admin__Password
Cloudinary__CloudName
Cloudinary__ApiKey
Cloudinary__ApiSecret
Gemini__ApiKey
Paystack__SecretKey
FrontendUrl
```

Configure these frontend variables in Vercel:

```text
VITE_API_URL=https://your-api.example.com/api
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
```

The frontend currently targets the existing API at `https://life-goes-on-hub-api.onrender.com/api`. Keep that Render service URL until the API has been redeployed and verified. Verify that the `victorylane.com` email inboxes shown on customer-facing pages are configured, or replace them with your verified support addresses before launch.

See [server/README.md](server/README.md) for backend-specific notes and [PAYSTACK_SETUP.md](PAYSTACK_SETUP.md) for payment setup.
