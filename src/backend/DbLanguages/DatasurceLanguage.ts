import "dotenv/config"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { De, En } from "./LanguageEntitys.ts"

const USERNAME = process.env.MARIADB_USER
const PASSWORD = process.env.MARIADB_PASSWORD
const DATABASE = process.env.MARIADB_DATABASE

export const LANGUAGEDB = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 6033,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [De, En],
    synchronize: true,
    logging: false,
})
