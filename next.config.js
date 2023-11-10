/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ["localhost", "demo.fososoft.com", "192.168.1.178", "fmrp.fososoft.com"],
    },
    env: {
        customKey: "my-value",
    },
};

module.exports = nextConfig;
