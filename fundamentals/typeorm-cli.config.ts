import { CoffeeRefactor1764499855085 } from "src/migrations/1764499855085-CoffeeRefactor";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'postgres',
    entities: [],
    migrations: [CoffeeRefactor1764499855085],
})