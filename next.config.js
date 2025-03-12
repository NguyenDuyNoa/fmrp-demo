/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        unoptimized: false,
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: '*',
            },
            {
                protocol: 'https',
                hostname: '*',
            },
        ],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Kích thước thiết bị hỗ trợ
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Kích thước hình ảnh
        // domains: ["localhost", "demo.fososoft.com", "192.168.1.178", "fmrp.fososoft.com", 'admin.fmrp.vn'],
        // // remotePatterns: [
        // //     {
        // //         protocol: "https",
        // //         hostname: "admin.fmrp.vn",
        // //         pathname: "/uploads/**",
        // //     },
        // // ],
        // // domains: ["localhost", "demo.fososoft.com", "192.168.1.178", "fmrp.fososoft.com", 'admin.fmrp.vn', 'hub.fmrp.vn'],
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
