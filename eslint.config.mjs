import TYPESCRIPT from "typescript-eslint";
import YAML from "eslint-plugin-yml";

export default [
    { ignores: ["node_modules/**", "dist/**", ".schoolstuff/**"] },
    ...TYPESCRIPT.configs.recommended.map((config) => ({
        ...config,
        files: ["**/*.ts"]
    })),
    ...YAML.configs["flat/recommended"],
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/naming-convention": [
                "error",
                { selector: "typeLike", format: ["PascalCase"] },
                {
                    selector: ["classProperty", "classMethod", "accessor"],
                    modifiers: ["private"],
                    format: ["camelCase"],
                    leadingUnderscore: "require"
                },
                {
                    selector: "variable",
                    modifiers: ["const"],
                    format: ["UPPER_CASE"]
                }
            ]
        }
    }
];
