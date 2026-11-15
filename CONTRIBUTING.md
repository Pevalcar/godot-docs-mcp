# Contributing to Godot Docs MCP

Thank you for your interest in contributing to Godot Docs MCP! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issues](#issues)
- [Licensing](#licensing)

## Code of Conduct

This project follows the [MIT License](LICENSE). By participating, you are expected to uphold this license.

## How to Contribute

### Reporting Bugs

1. Search through existing issues to ensure the bug hasn't been reported
2. Create a new issue with the template "Bug Report"
3. Include:
   - Node.js version (`node -v`)
   - Operating system
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

### Suggesting Features

1. Verify the feature hasn't been suggested
2. Create a new issue with the template "Feature Request"
3. Explain the feature clearly
4. Provide examples of how it would be used

### Submitting Code

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/tu-usuario/godot-docs-mcp.git
cd godot-docs-mcp
npm install
```

### Available Scripts

- `npm run build` - Build the project
- `npm run dev` - Run in development mode with tsx
- `npm run index` - Index documentation
- `npm run update` - Update documentation index

## Coding Standards

### General Rules

1. **TypeScript Everywhere** - Use TypeScript for all new code
2. **Type Safety** - Always type your variables and parameters
3. **No `any` Types** - Avoid using `any` unless absolutely necessary
4. **Comments** - Write clear, concise comments explaining the "why"

### BM25 Search Algorithm

When modifying the search algorithm:
- Ensure case-insensitive matching
- Test with special characters
- Return relevant results with snippets
- Handle edge cases (empty query, no results)

### Error Handling

- Always handle errors gracefully
- Return informative error messages
- Use `console.error` for server-side errors
- Log helpful debugging information

### Code Structure

```typescript
// Good: Typed variables with clear names
interface DocumentEntry {
  title: string;
  class_name: string;
  section: string;
  url: string;
  content: string;
}

// Good: Helper functions
function bm25Score(query: string, content: string): number {
  // Implementation details...
}

// Good: Async handlers with proper typing
async function searchHandler(query: string, limit: number): Promise<SearchResult[]> {
  // Implementation
}
```

## Pull Request Process

1. **Update README** if your change affects the user interface or adds new features
2. **Update ROADMAP.md** if applicable
3. **Add tests** for new functionality
4. **Follow the commit message guidelines**:
   - Use present tense ("Add feature" not "Added feature")
   - Use imperative mood ("Move cursor to..." not "Moves cursor to...")
   - Limit first line to 72 characters or less

### Commit Messages

```
good: Add godot_read tool for full documentation
good: Fix BM25 score calculation for empty queries
good: Update README with usage examples
```

### PRs Will Not Be Merged If:

- Tests fail
- Linting errors exist
- Code doesn't follow the style guide
- Commit messages are unclear

## Issues

### Issue Labels

We use the following labels for issues:

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation updates
- `good first issue` - Beginner-friendly tasks
- `help wanted` - Need help with this issue

### Creating Good Issues

When creating issues, please:

1. Use a clear and descriptive title
2. Describe the current behavior and expected behavior
3. Include steps to reproduce (for bugs)
4. Add screenshots or code samples if applicable
5. Check that you haven't already created a similar issue

## Documentation

### How to Add New Documentation Entries

1. Edit `~/.godot-docs/godot-docs.json`
2. Add new entries following the schema:

```json
{
  "title": "ClassName",
  "class_name": "ClassName",
  "section": "category.class",
  "url": "https://docs.godotengine.org/en/stable/classes/class_classname.html",
  "content": "Full description with key methods, properties, and examples..."
}
```

### Documentation Standards

- Keep descriptions concise but informative
- Include key methods and properties
- Link to official documentation when available
- Use consistent formatting

## Testing

### Manual Testing

```bash
# Start server
npm run dev

# In another terminal
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/index.js
```

### Automated Testing

Currently we rely on manual testing. Future versions will include:
- Unit tests for BM25 algorithm
- Integration tests for MCP protocol
- Performance tests for large datasets

## Roadmap

See [ROADMAP.md](ROADMAP.md) for current and future features.

## Getting Help

- Open an issue on GitHub
- Check existing issues first
- Be specific about your question

## Licensing

By contributing to Godot Docs MCP, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Thanks for contributing to making Godot Docs MCP better! 🌟