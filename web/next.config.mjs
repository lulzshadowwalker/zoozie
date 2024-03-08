import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/config.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    logging: {
        "fetches": {
            fullUrl: true,
        },
    },
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: '**.unsplash.com',
          },
        ],
      },
};

export default withNextIntl(nextConfig);
