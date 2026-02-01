# PR Review Checklist

- Correctness: requirements met, edge cases handled
- Types: no `any`, public APIs typed, unsafe casts avoided
- Tests: new behavior covered, no flake, good assertions
- Errors: user-friendly messages, logging, fallback UI
- Performance: avoid unnecessary rerenders, large loops, N+1
- Security: validate inputs, avoid injection, secrets not logged
- UX: loading/empty/error states, a11y basics, RTL if needed
