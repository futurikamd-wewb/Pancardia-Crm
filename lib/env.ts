export function getEnvStatus() {
  return {
    database: Boolean(process.env.DATABASE_URL),
    cloudinary:
      Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
      Boolean(process.env.CLOUDINARY_API_KEY) &&
      Boolean(process.env.CLOUDINARY_API_SECRET)
  };
}

