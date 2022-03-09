const SnakeNamingStrategy =
    require("typeorm-naming-strategies").SnakeNamingStrategy;
module.exports = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: `${process.env.DB}`,
    synchronize: false,
    logging: false,
    keepConnectionAlive: true,
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
