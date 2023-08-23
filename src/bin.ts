#!/usr/bin/env node

import path from "path";

import { parseCommitMessage } from "./lib/parse";
import map from "./lib/map";

const args = process.argv.slice(2);

(async () => {
    switch (args[0]) {
        case undefined: {
            console.log("Usage: relational <command> [args]");
            console.log();
            console.log("Commands:");
            console.log("  parse <message>  Parse a commit message");
            console.log("  map <path>       Generate a map of commit history");

            break;
        }
        case "parse": {
            const commit = parseCommitMessage(args[1]);

            console.log(args[1]);
            console.log();
            console.log(`breaking       ${commit.breaking ? "true" : "false"}`);
            console.log(`type           ${commit.type || "none"}`);
            console.log(`scope          ${commit.scope}`);
            console.log(`summary        ${commit.description}`);

            break;
        }
        case "map": {
            if (args[2]) {
                const match = await map(path.join(process.cwd(), args[1]), args[2]);

                for (const commit of match) {
                    console.log(commit.raw);
                }

                break;
            }

            map(path.join(process.cwd(), args[1]));

            break;
        }
    }
})();
