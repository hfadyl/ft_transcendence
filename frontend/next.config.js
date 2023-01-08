/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ["cdn.intra.42.fr", "localhost", process.env.IP_ADDRESS],
  },
  env: {
    USERS: process.env.USERS,
    CHAT: process.env.CHAT,
    AUTH: process.env.AUTH,
    GAME: process.env.GAME,
    TWO_FACTOR_AUTH: process.env.TWO_FACTOR_AUTH,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    IP_ADDRESS: process.env.IP_ADDRESS,
  },
};

module.exports = nextConfig;
