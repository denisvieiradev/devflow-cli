# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-26

### Added

- 9-phase structured pipeline: init, prd, techspec, tasks, run-tasks, test, review, pr, done
- Intelligent model routing (Haiku/Sonnet/Opus) based on task complexity
- Project auto-detection (language, framework, test runner, CI)
- State persistence in `.devflow/` with file locking
- Customizable templates with `{{variable}}` interpolation
- Git and GitHub integration with Conventional Commits format
- Context modes (normal/light) for different project sizes
- Sensitive file filtering for commits
- Standalone `devflow commit` command with `--push` flag
- `devflow status` command for feature tracking

[1.0.0]: https://github.com/denisvieiradev/devflow-ai-kit/releases/tag/v1.0.0
