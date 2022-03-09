import { createConnection, getConnectionManager } from "typeorm";

export const intializeDB = async (): Promise<void> => {
    try {
        const connectionManager = getConnectionManager();
        if (!connectionManager.has("default")) {
            const connection = await createConnection();
            if (process.env.NODE_ENV === "development") {
                await connection.synchronize();
            }

            console.log("Database successfully initialized");
        }
    } catch (error) {
        console.log(`Database failed to connect ${error.stack}`);
    }
};
