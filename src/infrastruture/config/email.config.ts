
export default () => ({
    email: {
        host: process.env.EMAIL_HOST ?? 'mailpit',
        port: Number(process.env.EMAIL_PORT ?? 1025),
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        from: process.env.EMAIL_FROM ?? 'no-reply@identity.local',
    },
});