const ROUTES = [
    {
        url: '/',
        auth: false,
        creditCheck: false,
        rateLimit: {
            windowMs: 15 * 60 * 1000,
            max: 5
        },
        proxy: {
            target: "http://localhost:3000"
        }
    }
]

exports.ROUTES = ROUTES;