import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export default async function conectar(){
    if (global.poolConexoes){
        return await global.poolConexoes.getConnection();
    }
    else{
        const pool = mysql.createPool({
            host: process.env.HOST,
            user: process.env.USUARIO_BD, 
            password: process.env.SENHA_BD,  
           // host: 'localhost',
            //user: 'root', 
            //password:'',  
            database: process.env.DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
          });

          global.poolConexoes = pool;
          return await pool.getConnection();
    }
}