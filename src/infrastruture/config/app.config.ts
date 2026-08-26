export default () => ({
    app: {
        name: process.env.APP_NAME ?? 'idenity-service-nestjs',
        port: Number(process.env.PORT ?? 3000),
        enviroment: process.env.NODE_ENV ?? 'development',
    },
});