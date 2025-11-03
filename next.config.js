/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://render-trolley.onrender.com/api/:path*'
        }
      ]
    };
  }
};

module.exports = nextConfig;
