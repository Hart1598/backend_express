import {createPool} from 'mysql'
import dotenv from 'dotenv'
dotenv.config()
export const pool = createPool({
    port: process.env.DBPORT,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.MYSQL_DB,
    connectionLimit: 10
})