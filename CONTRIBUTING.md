# Contributing to devflow-ai-kit

Thank you for your interest in contributing! By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [Git](https://git-scm.com)
- [GitHub CLI (`gh`)](https://cli.github.com) (optional, for PR creation)

### Setup

```bash
git clone https://github.com/<your-username>/devflow-ai-kit.git
cd devflow-ai-kit
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
├── cli/           # CLI entry point, Commander.js setup, commands
├── core/          # Types, config, state, pipeline, templates, scanner
├── providers/     # LLM provider interface and implementations
├── infra/         # Filesystem, git, GitHub, env, logger utilities
└── templates/     # Default prompt templates (prd, techspec, tasks, etc.)
```

## Guidelines

- Write TypeScript in strict mode
- Follow ESM module conventions (`"type": "module"`)
- Add tests for new commands and core logic (tests go in `__tests__/`)
- Keep PRs focused — one feature or fix per PR
- Update the README if you add new commands or change behavior
- Never commit `.devflow/.env` or API keys

## Reporting Issues

Use [GitHub Issues](https://github.com/denisvieiradev/devflow-ai-kit/issues) to report bugs or request features. Include:

- Steps to reproduce
- Expected vs actual behavior
- Your environment (Node.js version, OS, devflow version)
