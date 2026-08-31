export default () => ({
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT ?? 6379),
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
    },
});