import jwt from 'jsonwebtoken'
import appConfig from '../config/app.js'
import {v4} from 'uuid'

const {tokens, secret} = appConfig.jwt
export const generateAccessToken = (body) => {
    const payload = {
        body,
        type: tokens.access.type,
    }
    const options = {expiresIn: tokens.access.expiresIn}

    return {
        token: jwt.sign(payload, secret, options),
        id: payload.idToken
    }
}

export const generateRefreshToken = (userID) => {
    const payload = {
        id: v4(),
        type: tokens.refresh.type,
        userID
    }
    return {
        id: payload.userID,
        token: jwt.sign(payload, secret)
    }
}

