# Relational Commits

This document describes the specification of the Relational Commits format.

```
<breaking>([<scope>]) <type?>: <description>
```

|     Field     | Optional | Description                                                           |
| ------------- | :------: | --------------------------------------------------------------------- |
| `breaking`    |    ✅    | A `!` to indicate a breaking change.                                  |
| `scope`       |    ❌    | The scope of the commit. This can be a file, directory, or a package. |
| `type`        |    ✅    | The type of commit. This can be `fix`, `feat` or any other type.      |
| `description` |    ❌    | A short description of the commit.                                    |

Commit messages **must** be written in the imperative present tense. For example, "Add pizza" instead of "Added pizza". 

They must specify the scope of the commit, and the type of commit. The scope can be a file, directory, or a package. The type can be `fix`, `feat` or any other type.

The commit message **may** be prefixed with a `!` to indicate a breaking change.

# Examples

The initial commit to the `main` branch.
```
[main] Initial Commit
```

A new feature named 'pizza'
```
(foods) feat: Add pizza
```

A commit done by continuous integration to document the new feature.
```
[docs] CI: Document pizza
```

A commit to fix a bug in the `foods` package.
```
[foods] fix: Stop soup from throwing when passed an Array
```

A breaking change to a method in the `foods/initialise` file.
```
![foods/initialise] Update link format
```