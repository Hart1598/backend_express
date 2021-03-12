import jwt from 'jsonwebtoken'
import appConfig from '../config/app.js'
import {findById} from "../services/auth.js";

const {secret} = appConfig.jwt
export const checkToken = (req, res, next) => {
    let authHeader = req.get('authorization')
    if(!authHeader){
        res.status(401).json({message: 'Token not provided!'})
        return
    }

    const token = authHeader.replace('Bearer ', '')
    try{
        const payload = jwt.verify(token, secret)
        if(payload.type !== 'access'){
            res.status(401).json({message: 'Invalid token'})
            return
        }
        req.userInfo = payload
        req.token = token
        findById(payload.body.id, (err, info) => {
            if(!err){
                res.status(404).json({message: 'Failed to find user ' + info})
                return
            }
            if(info){
                if(info.token === token){
                    next()
                }
                else{
                    res.status(404).json({message: 'In DB other token'})
                }
            }else{
                res.status(404).json({message: 'No find'})
                return
            }
        })
    }
    catch (e){
        if(e instanceof jwt.TokenExpiredError){
            res.status(401).json({message: 'Token expired!'})
            return
        }
        if(e instanceof jwt.JsonWebTokenError){
            res.status(401).json({message: 'Invalid token'})
            return
        }
    }
}



