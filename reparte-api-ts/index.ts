import dotenv from 'dotenv';
dotenv.config();

import app from './src/app'
import {pool} from "./src/config/database";

const port = process.env.PORT ?? '3000';
const db = process.env.MYSQL_DATABASE ?? 'reparte';

async function main() {
    try {
        //Run database
        await pool.getConnection();
        console.log('Database connect:', db);

        // Run server
        app.listen(port, () => {
            console.log('Server running on port:', port);
        });
    } catch (err) {
        if (err instanceof Error) {
            console.log('Error during initialization:', err.message);
        }
    }
}

main().catch((err) => {
    console.error('Unhandled error in main:', err);
});