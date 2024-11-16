/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
  },
};

// Add this condition for development environment
if (process.env.NODE_ENV === 'development') {
  nextConfig.metadata = {
    ...nextConfig.metadata,
    metadataBase: new URL('http://localhost:3000'),
  };
}

export default nextConfig;
