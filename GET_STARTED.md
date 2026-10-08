# Getting Started

This project is a React/Vite storefront backed by an ASP.NET Core 8 and PostgreSQL API. It does not use mock authentication or mock product data.

Follow [QUICKSTART.md](QUICKSTART.md) for local setup. For a production deployment, follow the environment-variable checklist in [README.md](README.md#deploy).

Keep secrets only in local ignored configuration or your hosting provider's environment-variable settings. In particular, never commit database credentials, JWT secrets, administrator passwords, Cloudinary secrets, Gemini API keys, or Paystack secret keys.
