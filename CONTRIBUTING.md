# Contributing to devflow-cli

Thank you for your interest in contributing! By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [Git](https://git-scm.com)
- [GitHub CLI (`gh`)](https://cli.github.com) (optional, for PR creation)

### Setup

```bash
git clone https://github.com/<your-username>/devflow-cli.git
cd devflow-cli
npm install
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run build` | Production build with tsup |
| `npm run dev` | Watch mode (rebuilds on changes) |
| `npm test` | Run tests with Jest |
| `npm run test:coverage` | Run tests with coverage report (80% threshold) |
| `npm run lint` | Type checking (`tsc --noEmit`) |

### Running Locally

To test your local changes as the `devflow` CLI command:

```bash
# Build the project
npm run build

# Link it globally — makes `devflow` point to your local build
npm link

# Now you can use `devflow` anywhere and it runs your local version
devflow --help
```

For active development, use watch mode so the build updates automatically as you edit:

```bash
npm run dev
```

You can also run the local build directly without linking:

```bash
node dist/index.js
```

## Development Workflow

1. **Fork** the repository and create a branch from `main`:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** — write code, add tests, update docs if needed.

3. **Run checks** before committing:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

4. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/) format:
   ```bash
   git commit -m "feat: add support for X"
   ```
   Common prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `ci:`

   > **Tip:** Use `devflow commit` to automatically generate conventional commit messages. It analyzes your staged changes and, when multiple contexts are detected, suggests a commit plan to split them into separate commits.

5. **Push** your branch and **open a Pull Request** against `main`.

## Project Structure

```
src/
├── cli/
│   ├── index.ts              # Entry point (shebang + bootstrap)
│   ├── program.ts            # Commander.js setup, loads all commands
│   ├── context.ts            # Shared context helper for feature resolution
│   └── commands/             # One file per command (init, prd, techspec, ...)
├── core/
│   ├── types.ts              # Type definitions (Config, State, Phases, Tasks)
│   ├── config.ts             # Configuration management
│   ├── state.ts              # Feature state persistence with file locking
│   ├── pipeline.ts           # Feature numbering, slug generation, reference resolution
│   ├── template.ts           # Template engine with {{variable}} interpolation
│   ├── context.ts            # ContextBuilder for smart document chunking
│   ├── scanner.ts            # Project auto-detection (language, framework, tests, CI)
│   └── drift.ts              # Artifact change detection
├── providers/
│   ├── types.ts              # LLMProvider interface
│   ├── claude.ts             # Anthropic SDK implementation
│   └── model-router.ts       # Model selection by task complexity
├── infra/
│   ├── env.ts                # .devflow/.env loading and writing
│   ├── filesystem.ts         # File operations (read/write JSON, existence checks)
│   ├── git.ts                # Git operations wrapper
│   ├── github.ts             # GitHub PR creation and releases via gh CLI
│   └── logger.ts             # Debug logging
└── templates/
    ├── prd.md
    ├── techspec.md
    ├── tasks.md
    ├── commit.md
    ├── pr.md
    ├── release-version.md
    ├── release-changelog.md
    └── release-notes.md
```

## Model Routing

devflow automatically selects the optimal model for each operation:

| Tier | Model | Used For |
|---|---|---|
| **Fast** | Haiku | Commits, PR generation, task execution guidance |
| **Balanced** | Sonnet | PRD, techspec, tasks, code review, test plans, releases |
| **Powerful** | Opus | Reserved for high-complexity analysis |

## Guidelines

- Write TypeScript in strict mode
- Follow ESM module conventions (`"type": "module"`)
- Add tests for new commands and core logic (tests go in `__tests__/`)
- Keep PRs focused — one feature or fix per PR
- Update the README if you add new commands or change behavior
- Never commit `.devflow/.env` or API keys

## Releasing a New Version

> Only maintainers with npm publish access can release new versions.

1. **Ensure `main` is green** — all CI checks must pass and there are no uncommitted changes.

2. **Run `devflow release`** — this handles the entire release process interactively:
   ```bash
   devflow release
   ```
   The command will:
   - Analyze commits since the last tag and suggest a version bump (patch/minor/major)
   - Generate a changelog entry and update `CHANGELOG.md`
   - Generate release notes in your chosen language
   - Bump the version in `package.json`
   - Create a git commit (`chore(release): v<version>`) and annotated tag
   - Optionally push to remote and create a GitHub Release

3. **Publish to npm** — the `prepublishOnly` hook automatically runs `lint → test → build` before publishing:
   ```bash
   npm publish
   ```

## Reporting Issues

Use [GitHub Issues](https://github.com/denisvieiradev/devflow-cli/issues) to report bugs or request features. Include:

- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node.js version, OS, devflow version)
