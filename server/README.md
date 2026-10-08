# VictoryLane API

The VictoryLane API provides authentication, catalogue, orders, custom requests, uploads, administration, and AI features for the React storefront.

## Stack

- ASP.NET Core 8
- PostgreSQL with Entity Framework Core and Npgsql
- JWT authentication and BCrypt password hashing
- Cloudinary image uploads
- Paystack server-side payment verification
- Google Gemini AI features

## Local setup

Install the .NET 8 SDK and run PostgreSQL locally or use a hosted PostgreSQL database. Create `server/appsettings.Development.json`; this file is ignored by Git.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=victorylane;Username=postgres;Password=your-password"
  },
  "Jwt": {
    "Secret": "use-a-long-random-secret-at-least-32-characters"
  },
  "Admin": {
    "Email": "admin@example.com",
    "Password": "use-a-strong-unique-password"
  },
  "Cloudinary": {
    "CloudName": "",
    "ApiKey": "",
    "ApiSecret": ""
  },
  "Gemini": {
    "ApiKey": ""
  },
  "Paystack": {
    "SecretKey": ""
  },
  "FrontendUrl": "http://localhost:5173"
}
```

Run the API from the project root:

```bash
dotnet run --project server/VictoryLane.Api.csproj
```

It listens on `http://localhost:5000`, creates its schema, and seeds starter products, categories, and the configured administrator on first run. Administrator credentials are required; there are no default credentials.

## Payments

Card and Mobile Money payments are verified with Paystack using `Paystack:SecretKey` before an order is marked paid. Configure the matching public key in the frontend as `VITE_PAYSTACK_PUBLIC_KEY`. Keep the secret key on the API only.

## Deploy

The included `render.yaml` configures a Render-compatible Docker deployment. Set these API environment variables in your hosting provider:

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

`FrontendUrl` must match the deployed frontend origin, for example `https://your-store.vercel.app`.
