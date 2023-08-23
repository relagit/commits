export default (name: string) => {
    return class extends Error {
        name = name;
    };
};
