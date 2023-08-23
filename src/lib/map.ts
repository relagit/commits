import { Commit, parseCommitMessage, REGEX } from "./parse";
import { Git, GitError } from "./git";

const LOG_REGEX = /commit (?<hash>.+)\nAuthor:(?<Author>.+)\nDate:   (?<date>.+)\n(?<desc>(?:[\s\S](?!commit))+)/g;

export const Log = async (directory: string) => {
    try {
        const result = await Git({
            directory,
            command: "log",
            args: [],
        });

        return result;
    } catch (error) {
        if (String(error).includes("Not a git repository")) {
            throw new GitError(`Not a git repository: ${directory}`);
        }
    }
};

export default async <T extends string>(path: string, scope?: T): Promise<Commit[]> => {
    const result = await Log(path);

    if (!result) {
        throw new GitError(`No commits found in ${path}`);
    }

    const commits = result.matchAll(LOG_REGEX);

    let parsedCommits: Commit[] = [];

    for (const commit of commits) {
        const { hash, date, desc } = commit.groups || {};

        if (!desc) {
            continue;
        }

        const message = desc.trim().split("\n")[0].trim();

        const parsed = parseCommitMessage(message);

        parsedCommits.push(parsed);
    }

    const scopes: { [key: string]: number } = {};

    if (scope) {
        return parsedCommits.filter((commit) => commit.scope === scope);
    }

    for (const commit of parsedCommits) {
        const { scope } = commit;

        if (!scopes[scope]) {
            scopes[scope] = 0;
        }

        scopes[scope]++;
    }

    const sortedScopes = Object.entries(scopes)
        .sort((a, b) => b[1] - a[1])
        .reverse();

    for (let i = 0; i < sortedScopes.length; i++) {
        const [scope, count] = sortedScopes[i];

        console.log(`${scope} (${count})`);
    }

    return parsedCommits;
};
