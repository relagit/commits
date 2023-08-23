import error from "./error";

import child_process, { ExecException } from "child_process";
import fs from "fs";

export const GitError = error("GitError");

export interface IGitParams {
    directory: string;
    command: string;
    args: string[];
}

export const Git = async (params: IGitParams): Promise<string> => {
    const { directory, command, args } = params;

    let hasError: Boolean | ExecException | string = false;

    if (!fs.existsSync(directory)) {
        throw new Error(`Directory does not exist: ${directory}`);
    }

    const cmd = `git ${command} ${args.join(" ")}`;

    const result: string = await new Promise((resolve, reject) => {
        child_process.exec(cmd, { cwd: directory }, (error, stdout, stderr) => {
            if (error) {
                hasError = error;
                reject(error);
            } else if (stderr) {
                hasError = stderr;
                reject(stderr);
            } else {
                resolve(stdout.trim());
            }
        });
    });

    if (hasError) {
        throw hasError;
    }

    return result;
};
