const host = process.env.SITE_HOST ?? process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = host ? `https://${host}` : "http://localhost:3000";
