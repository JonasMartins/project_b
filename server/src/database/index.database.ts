import { createConnection } from "typeorm";
import { User } from "./entity/user.entity";

const intializeDB = async (): Promise<void> => {
    try {
        // await createConnection({
        //     type: "postgres",
        //     host: "localhost",
        //     port: 5432,
        //     username: "postgres",
        //     password: "postgres",
        //     database: "pb_dev",
        //     entities: [User],
        // });
        await createConnection();
        console.log("Database successfully initialized");
    } catch (error) {
        console.log(`Database failed to connect ${error}`);
    }
};

export default intializeDB;
