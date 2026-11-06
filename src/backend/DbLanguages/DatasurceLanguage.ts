import "reflect-metadata"
import { config } from "dotenv";
import { DataSource } from "typeorm"
import { De, En } from "./LanguageEntitys.ts"

config({ path: "/workspaces/.env" })

const USERNAME = process.env.MARIADB_USER
const PASSWORD = process.env.MARIADB_PASSWORD
const DATABASE = process.env.MARIADB_DATABASE

export const LANGUAGEDB = new DataSource({
    type: "mariadb",
    host: "devcontainer-db-1",
    port: 3306,
    username: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    entities: [De, En],
    synchronize: true,
    logging: false,
})
