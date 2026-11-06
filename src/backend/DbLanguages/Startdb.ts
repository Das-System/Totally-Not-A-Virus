import { LANGUAGEDB } from "./DatasurceLanguage.ts";

async function StartDb(): Promise<string> {
    try {
        await LANGUAGEDB.initialize();
    } catch (error) {
        console.log(error);

    }
    console.log("Database is running");

    return "done"
}

StartDb();
