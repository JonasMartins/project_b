const SnakeNamingStrategy =
    require("typeorm-naming-strategies").SnakeNamingStrategy;
module.exports = {
    type: "postgres",
    host: `${process.env.SERVER_HOST}`,
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "pb_dev",
    synchronize: false,
    logging: false,
    entities: [
        process.env.NODE_ENV === "test"
            ? "src/**/*.entity.ts"
            : "dist/**/*.entity.js",
    ],
    migrations: ["dist/migration/**/*.js"],
    subscribers: ["dist/subscriber/**/*.js"],
    cli: {
        entitiesDir: "src/database/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
    namingStrategy: new SnakeNamingStrategy(),
};
