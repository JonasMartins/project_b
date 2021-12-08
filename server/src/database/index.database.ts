import { createConnection } from "typeorm";
import {getManager} from "typeorm";

export const intializeDB = async (): Promise<void> => {
    try {
        const connection = await createConnection();
        await connection.synchronize()


        console.log("Database successfully initialized");
    } catch (error) {
        console.log(`Database failed to connect ${error}`);
    }
};

