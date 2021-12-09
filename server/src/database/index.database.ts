import { createConnection } from "typeorm";

export const intializeDB = async (): Promise<void> => {
    try {
        const connection = await createConnection();

        if (process.env.ENV === "development") {
            await connection.synchronize();
        }

        console.log("Database successfully initialized");
    } catch (error) {
        console.log(`Database failed to connect ${error.stack}`);
    }
};
