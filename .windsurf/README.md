# .windsurf Configuration

This directory contains AI assistant configuration for the Persian Tools project.

## Structure

### `rules/`
Contains coding standards and guidelines that apply automatically:
- **global_rules.md**: Baseline engineering standards for all projects
- **React.md**: TypeScript/React specific standards
- **UX.md**: Error handling and user experience guidelines
- **Coverage.md**: Testing and coverage requirements

### `skills/`
Defines AI assistant capabilities and workflows:
- **SKILL.md**: Code review skill with structured workflow
- **review-checklist.md**: Quick reference for PR reviews
- **run-tests/SKILL.md**: Test execution and failure analysis
- **pr-template.md**: Standard PR template
- **security-checklist.md**: Security review guidelines

### `workflows/`
Step-by-step processes for common tasks:
- **pr-review.md**: End-to-end PR review workflow

## Usage

These files are automatically loaded by the AI assistant to:
- Enforce consistent coding standards
- Provide structured code reviews
- Guide testing and quality assurance
- Ensure security best practices

## Maintenance

- Update modified dates when making changes
- Keep author field as `persian-tools-team`
- Maintain consistent frontmatter structure
- Review and update content regularly

## Integration

The configuration integrates with:
- ESLint/Prettier for code formatting
- Vitest for testing
- TypeScript for type safety
- Git hooks for pre-commit checks
