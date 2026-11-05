import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 5432,
    username: "Lang",
    password: "Language",
    database: "Lang",
    entities: [],
    synchronize: true,
    logging: false,
})
