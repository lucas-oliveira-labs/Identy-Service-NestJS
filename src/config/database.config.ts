export default () => ({
    database: {
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABSE_PORT ?? 5432),
        name: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
    },
});
