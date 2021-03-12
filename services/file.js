import * as uuid from 'uuid'
import * as path from 'path'
import * as fs from 'fs'
import {pool} from "../config/database.js";

class FileService{
    async upload(file, callback){
        try{
            const expansionSplited = file.name.split('.')
            const expansion = expansionSplited[expansionSplited.length - 1]
            const fileName = uuid.v4() +'.'+ expansion
            const filePath = path.resolve('static', fileName)
            file.mv(filePath)

            const {size, mimetype} = file
            const currentDate = new Date()
            await pool.query(
                `insert into files(name, expansion, mimetype, size, date) values(?,?,?,?,?)`,
                [fileName, expansion, mimetype, size, currentDate],
                (error, res, fil) => {
                    if(error){
                        return callback(true)
                    }
                    else{
                        return callback(false)
                    }
                }
            )
        }
        catch (e){
            throw Error(e)
        }
    }
    async getFileInfoById(id, callback){
        try {
            pool.query(
                `select * from files where id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        console.log('error', error)
                        return callback(false, error)
                    } else {
                        return callback(true, results[0])
                    }
                }
            )
        }
        catch{
            return callback(false, 'Error db')
        }
    }

    async deleteFileById(id, callback){
        try{
            await pool.query(
                `select * from files where id = ?`,
                [id],
                (error, results, fields) => {
                    if(error){
                        throw Error(error)
                    }
                    if(results.length !== 0) {
                        const filePath = path.resolve('static', results[0].name)
                        fs.unlink(filePath, err => {
                            if (err) {
                                throw Error(err)
                            }
                        })
                    }
                }
            )
            await pool.query(
                `delete from files where id = ?`,
                [id],
                (error, results, fields) => {
                    if(error){
                        callback(false)
                    }
                    else {
                        callback(true)
                    }
                }
            )
        }
        catch (e) {
            callback(false)
        }
    }

    async downloadFileByID(id, callback){
        try{
            await pool.query(
                `select * from files where id = ?`,
                [id],
                (error, results, fields) => {
                    if(error){
                        return callback(false, error)
                    }
                    if(results.length !== 0) {
                        const filePath = path.resolve('static', results[0].name)
                        return callback(true, filePath)
                    }
                }
            )
        }
        catch (e) {
            callback(false)
        }
    }

    async UpdateFileById(id, file,callback){
        try{
            pool.query(
                `select * from files where id = ?`,
                [id],
                (error, results) => {
                    if(error){
                        callback(true)
                    }
                    if(results.length !== 0) {
                        const filePath = path.resolve('static', results[0].name)
                        fs.unlink(filePath, err => {
                            if (err) {
                                callback(true)
                            }
                        })
                    }
                }
            )

            const expansionSplited = file.name.split('.')
            const expansion = expansionSplited[expansionSplited.length - 1]
            const fileName = uuid.v4() +'.'+ expansion
            const filePath = path.resolve('static', fileName)
            file.mv(filePath)
            const {size, mimetype} = file
            const currentDate = new Date()
            pool.query(
                `update files set ? where id = ?`,
                [{name:fileName, expansion, mimetype, size, date:currentDate}, id],
                (error, results, fields) => {
                    if (error) {
                        console.log('error', error)
                        return callback(true)
                    } else {
                        return callback(false)
                    }
                }
            )
        }
        catch{
            callback(false)
        }
    }
    async FileList(offset, list_size, callback){
        pool.query(
            `select * from files limit ${list_size} offset ${offset}`,
            (error, result, fields) => {
                if(error){
                    callback(false, error)
                }else{
                    callback(true, result)
                }
            }
        )
    }
}

export default new FileService()