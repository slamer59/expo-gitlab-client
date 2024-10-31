# Contributing to Expo GitLab Client

## Commit Convention

This project uses [Commitizen](https://github.com/commitizen/cz-cli) for standardized commit messages and automated version management.

### Making Commits

Instead of using `git commit`, use:

```bash
npm run commit
```

This will start an interactive prompt that will guide you through the commit process:

1. **Select the type of change:**
   - `feat`: A new feature
   - `fix`: A bug fix
   - `docs`: Documentation only changes
   - `style`: Changes that do not affect the meaning of the code
   - `refactor`: A code change that neither fixes a bug nor adds a feature
   - `perf`: A code change that improves performance
   - `test`: Adding missing tests or correcting existing tests
   - `chore`: Changes to the build process or auxiliary tools

2. **Enter the scope** (optional):
   - The part of the codebase your change affects (e.g., auth, navigation)

3. **Write a short description**
   - A brief summary of your changes

4. **Provide a longer description** (optional)
   - More detailed explanation if needed

5. **Breaking changes**
   - Indicate if your change breaks backward compatibility

6. **Issues**
   - Reference any related issues

### Version Management

The commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) standard, which enables automatic version management through semantic-release:

- `fix:` commits trigger a patch version bump (1.0.0 → 1.0.1)
- `feat:` commits trigger a minor version bump (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` in commit body triggers a major version bump (1.0.0 → 2.0.0)

### Releasing

To create a new release:

```bash
npm run release
```

This command will:
1. Analyze commits since the last release
2. Determine the next version number
3. Update versions in both `package.json` and `app.json`
4. Increment the Android `versionCode` automatically
5. Generate/update `CHANGELOG.md`
6. Create a git tag
7. Create a GitHub release

### Example Commits

```bash
# Feature
feat(auth): add biometric authentication
# Bug fix
fix(navigation): resolve tab bar disappearing issue
# Documentation
docs(readme): update installation instructions
# Breaking change
feat(api)!: replace REST endpoints with GraphQL
