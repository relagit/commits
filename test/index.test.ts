import { test } from "vitest";

import parse from "../src";

const basic__message = "(package) chore: Updated typescript to 4.4.2";
const basic__result = {
    raw: basic__message,
    type: "chore",
    scope: "package",
    description: "Updated typescript to 4.4.2",
    breaking: false,
};

const breaking__message = "!(package) feat: Updated typescript to 4.4.2";
const breaking__result = {
    raw: breaking__message,
    type: "feat",
    scope: "package",
    description: "Updated typescript to 4.4.2",
    breaking: true,
};

test("relational", async (t) => {
    t.expect(parse(basic__message)).toEqual(basic__result);

    t.expect(parse(breaking__message)).toEqual(breaking__result);
});
