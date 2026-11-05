import "reflect-metadata"
import { DataSource } from "typeorm"
import { De, En } from "./LanguageIni.ts"

export const LANGUAGEDB = new DataSource({
    type: "mariadb",
    host: "localhost",
    port: 5432,
    username: "Lang",
    password: "Language",
    database: "Lang",
    entities: [De, En],
    synchronize: true,
    logging: false,
})
