import { LANGUAGEDB } from "./DatasurceLanguage.ts";

export async function StartDb(): Promise<boolean> {
    try {
        await LANGUAGEDB.initialize();
        console.log("Database is running");
    } catch (error) {
        console.log(error);
    }
    return true
}

StartDb();
