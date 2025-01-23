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
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/dashboard',
            },
            // {
            //     source: '/settings',
            //     destination: '/settings/information',
            // },
        ]
    },
    // redirects: async () => {
    //     return [
    //         {
    //             source: '/settings',
    //             destination: '/settings/information',
    //             permanent: true,
    //         },
    //     ]

    // }
}

module.exports = nextConfig;
