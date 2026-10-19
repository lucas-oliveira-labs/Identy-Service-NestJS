export default () => ({
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '60m',
        passwordResetTokenExpiresIn:
            process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN ?? '15m',
    },
});