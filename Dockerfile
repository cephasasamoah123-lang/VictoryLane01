# Build the Vite storefront.
FROM node:20-slim AS frontend-build
WORKDIR /frontend

# Vite bakes VITE_* values into the JS at BUILD time, so they must be declared here.
# Render passes your service environment variables to Docker builds as build args.
ARG VITE_PAYSTACK_PUBLIC_KEY
ENV VITE_PAYSTACK_PUBLIC_KEY=$VITE_PAYSTACK_PUBLIC_KEY

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Build the ASP.NET Core API.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS api-build
WORKDIR /src
COPY server/VictoryLane.Api.csproj server/
RUN dotnet restore server/VictoryLane.Api.csproj
COPY server/ server/
RUN dotnet publish server/VictoryLane.Api.csproj -c Release -o /app/publish --no-restore

# Serve both the SPA and API from one Render web service.
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=api-build /app/publish .
COPY --from=frontend-build /frontend/dist ./wwwroot

ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000

ENTRYPOINT ["dotnet", "VictoryLane.Api.dll"]
