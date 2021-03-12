import {changeToken,create, findById} from '../services/auth.js'
import {genSaltSync, hashSync, compare} from 'bcrypt'
import jwt from 'jsonwebtoken'
import {generateAccessToken, generateRefreshToken} from "../helpers/authHelper.js";
import appConfig from '../config/app.js'


class authController{
    async signUp(req, res){
        const {password, id} = req.body
        const hastPassword = hashSync(password, genSaltSync(10))
        const accessToken = generateAccessToken({password, id})
        const refreshToken = generateRefreshToken(id)

        create({id, hastPassword, accessToken}, (err, info) => {
            if(!err){
                res.status(500).json({message: 'Failed to create user ' + info})
                return
            }
            res.status(200).json({access: accessToken.token, refresh: refreshToken.token})
        })
    }

    async signIn(req, res){
        const {id, password} = req.body

        findById(id, (err, info) => {
            if(!err){
                res.status(500).json({message: 'Failed to find user ' + info})
                return
            }
            if(info){
                res.status(200).json({access: info.token})
            }else{
                res.status(404).json({message: 'No find'})
                return;
            }
        })
    }


    async refreshToken(req, res){
        const {token} = req.body
        const {secret} = appConfig.jwt
        if(!token){
            res.status(401).json({message: 'Token not provided!'})
        }
        try{
            const payload = jwt.verify(token, secret)
            if(payload.type !== 'refresh'){
                res.status(401).json({message: 'Invalid token'})
                return
            }
            findById(payload.userID,  async(err, info) => {
                if(!err){
                    res.status(500).json({message: 'Failed to find user ' + info})
                    return
                }
                if(info){
                    const {id, password} = info
                    console.log(id, password)
                    const accessToken = generateAccessToken({id, password})
                    await changeToken(id, accessToken, err => {
                        if(!err){
                            console.log(err)
                            res.status(400).json({message: 'Failed to change token'})
                        }
                        else{
                            res.status(200).json({access: accessToken.token})
                        }
                    })
                }else{
                    res.status(404).json({message: 'No find'})
                }
            })
        }
        catch (e){
            console.log(e)
            res.status(401).json({message: 'Invalid token'})
        }
    }

    async logout(req, res){
        try{
            const id = req.userInfo.body.id
            const password = req.userInfo.body.password
            const accessToken = generateAccessToken({password, id})

            await changeToken(id, accessToken, err => {
                if(!err){
                    console.log(err)
                    res.status(400).json({message: 'Failed to change token'})
                }
                else{
                    res.status(200).json({access: accessToken.token})
                }
            })

        }
        catch(e){
            console.log(e)
            res.status(400).json({message: 'No success logout'})
        }
    }
}

export default new authController()


