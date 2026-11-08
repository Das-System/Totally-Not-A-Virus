import type { EntityTarget, ObjectLiteral, Repository } from "typeorm";
import { LANGUAGEDB } from "./DatasurceLanguage.ts";

export class LanguageControler {
    private lang: EntityTarget<ObjectLiteral>;
    private langRepo: Repository<ObjectLiteral>;

    public constructor(langIn: EntityTarget<ObjectLiteral>) {
        this.lang = langIn;
        this.langRepo = LANGUAGEDB.getRepository(this.lang);
    }

    async GetText(id: number): Promise<string | null> {
        let text = await this.langRepo.findOne({ where: { id: id } });
        if (!text) {
            throw new Error(`oh no ther is no text for ${this.lang} id: ${id}`)
        }
        return text.content

    }
}
