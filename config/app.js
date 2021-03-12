import dotenv from 'dotenv'
dotenv.config()

const appConfig = {
    jwt: {
        secret: process.env.TOKEN_KEY,
        tokens: {
            access: {
                type: 'access',
                expiresIn: process.env.TOKEN_LIFE
            },
            refresh: {
                type: 'refresh',
                expiresIn: '1h'
            }
        }
    }
}

export default appConfig