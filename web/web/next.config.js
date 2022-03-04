/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: {
        domains: [
            "http://localhost:4001",
            "http://127.0.0.1:4001",
            "http://127.0.0.1",
        ],
    },
};
