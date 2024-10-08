/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Add domains that are allowed to serve images
        domains: ['lh3.googleusercontent.com'], // Add any other domains you need here
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: '/api/:path*',
            },
        ];
    },
};

export default nextConfig;
