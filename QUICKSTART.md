# Quick Start

1. Install Node.js 18–20, .NET 8 SDK, and PostgreSQL.
2. Run `npm install` in the project root.
3. Copy `.env.example` to `.env`.
4. Create `server/appsettings.Development.json` using the configuration in the [main README](README.md#backend).
5. Start the API: `dotnet run --project server/VictoryLane.Api.csproj`.
6. In another terminal, start the frontend: `npm run dev`.
7. Open the address Vite displays (normally `http://localhost:5173`).

The API seeds an administrator using the `Admin` values from your local configuration. No mock accounts or default credentials are provided.
