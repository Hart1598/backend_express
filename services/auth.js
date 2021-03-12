import {pool} from '../config/database.js'

export const create = ({id, hastPassword: password, accessToken}, callback) => {
     pool.query(
        `insert into users(id, password, token) values(?,?,?)`,
        [
            id,
            password,
            accessToken.token
        ],
        (error, result, fields) => {
            if(error){
                return callback(false,error)
            }else{
                return callback(true)
            }
        }
    )
}

export const findById = (id, callback) => {
    pool.query(
        `select * from users where id = ?`,
        [id],
        (error, results, fields) => {
            if(error){
                return callback(false, error)
            }
            else {
                return  callback(true, results[0])
            }
        }
    )
}

export const changeToken = (id,newToken, callback) => {
    pool.query(
        `UPDATE users
         SET token = ?
         WHERE id = ?`,
        [newToken.token, id],
        (error, results, fields) => {
            if(error){
                console.log(error)
                return callback(false)
            }
            else {
                return  callback(true)
            }
        }
    )
}


