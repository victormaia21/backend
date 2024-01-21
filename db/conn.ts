import { Pool } from 'pg';


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'teste_linkedin',
    password: '9345381276771',
    port: 5432,
});



export default pool;