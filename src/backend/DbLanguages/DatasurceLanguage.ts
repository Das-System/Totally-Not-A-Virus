import "reflect-metadata"
import { DataSource } from "typeorm"
import { De, En } from "./LanguageEntitys.ts"

export const LANGUAGEDB = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 6033,
    username: "Lang",
    password: "Language",
    database: "Lang",
    entities: [De, En],
    synchronize: true,
    logging: false,
})
