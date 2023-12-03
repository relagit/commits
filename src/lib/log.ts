import { Git } from "./git";

const SCOPE = /([\[\(](.+)[\)\]])/;
const TYPE = /(\w+:)/;

const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const blue = (text: string) => `\x1b[34m${text}\x1b[0m`;
const grey = (text: string) => `\x1b[90m${text}\x1b[0m`;
const brightGrey = (text: string) => `\x1b[97m${text}\x1b[0m`;

export const relative = (ms: number) => {
    const seconds = Math.floor((Date.now() - ms) / 1000);

    const timeIntervals = [
        { interval: 31536000, label: "Year" },
        { interval: 2592000, label: "Month" },
        { interval: 86400, label: "Day" },
        { interval: 3600, label: "Hour" },
        { interval: 60, label: "Minute" },
        { interval: 1, label: "Second" },
    ];

    for (let i = 0; i < timeIntervals.length; i++) {
        const { interval, label } = timeIntervals[i];
        const quotient = Math.floor(seconds / interval);

        if (quotient > 0) {
            return `${quotient} ${label}${quotient > 1 ? "s" : ""} ago`;
        }
    }

    return "now";
};

export default async (path: string) => {
    console.clear();
    console.log("");

    try {
        const res = await Git({
            directory: path,
            command: "log",
            args: ["--pretty=format:%H%n%an%n%ad%n%s%n", "--stat", "--no-color", "--stat-width=1"],
        });

        const commits = res.split(/\n(?=[\w]{40})/g).map((commit) => {
            const [hash, author, date, message] = commit.split("\n");

            const changesLine = commit.split("\n")[commit.split("\n").length - 2].split(",");

            if (!changesLine[0].includes("file")) {
                return {
                    hash,
                    author,
                    date,
                    message,
                    files: 0,
                    insertions: 0,
                    deletions: 0,
                };
            }

            const files = Number(changesLine[0]?.trim()?.split(" ")[0]);
            const insertions = changesLine[1]?.includes("insert") ? Number(changesLine[1]?.trim()?.split(" ")[0]) : 0;
            const deletions = changesLine[1]?.includes("del")
                ? Number(changesLine[1]?.trim()?.split(" ")[0])
                : changesLine[2]?.includes("del")
                ? Number(changesLine[2]?.trim()?.split(" ")[0])
                : 0;

            return {
                hash,
                author,
                date,
                message,
                files,
                insertions,
                deletions,
            };
        });

        for (const commit of commits.reverse()) {
            const { hash, author, date, message, files, insertions, deletions } = commit;

            const scope = message.match(SCOPE)?.[2] || "none";
            const type = message.match(TYPE)?.[1] || "";

            console.log(
                message
                    .replace(SCOPE, yellow(`(${scope})`))
                    .replace(TYPE, blue(`${type}`))
                    .replace(/^!/, red("!"))
            );
            console.log(`${brightGrey(relative(new Date(date).getTime()))} ${grey("by")} ${brightGrey(author)}`);
            if (process.argv.includes("-h") || process.argv.includes("--hash")) console.log(`${grey(hash)}`);
            console.log("");
        }
    } catch (error) {
        console.log("Could not run log", error);
    }
};
