import error from "./error";

export const REGEX = /^(?<breaking>!)?(?:[\[\(](?<scope>.+)[\)\]])(?: (?<type>\w+):)? (?<description>.+)$/;

const InvalidCommitMessageError = error("InvalidCommitMessageError");

export type Commit = {
    raw: string;
    breaking?: boolean;
    type?: string;
    scope: string;
    description: string;
};

export const parseCommitMessage = (message: string): Commit => {
    const match = message.match(REGEX);

    if (!match || !match.groups) {
        throw new InvalidCommitMessageError(`Invalid commit message: ${message}`);
    }

    const { breaking, scope, type, description } = match.groups;

    return {
        raw: message,
        breaking: !!breaking,
        type,
        scope,
        description,
    };
};
