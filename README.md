# Godot Docs MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/godot-docs-mcp.svg)](https://badge.fury.io/js/godot-docs-mcp)
[![Node.js Version](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)

A lightweight MCP (Model Context Protocol) server that provides full-text search over Godot Engine documentation.

## Features

- 🔍 BM25 full-text search for relevant documentation results
- 📚 Search by class name, feature, or topic
- 💡 Read full documentation for any class
- 🚀 Zero configuration - just install and use
- 🌐 Works offline after initial indexing

## Installation

```bash
npm install -g godot-docs-mcp
```

Or use directly with npx:

```bash
npx godot-docs-mcp
```

## Usage

### With PI Agent

1. Start the MCP server:

```bash
godot-docs-mcp
```

2. In PI, run `/mcp` and add the server:

```bash
pi mcp add godot-docs -- npx godot-docs-mcp
```

3. Use the tools:

```
User: How do I use WebSocketPeer in Godot?
Assistant: *calls godot_search*
```

### Available Tools

#### `godot_search(query, limit?)`

Search Godot documentation by keyword, class name, or topic.

**Parameters:**
- `query` (string, required): Search query
- `limit` (number, optional): Max results (default: 10)

**Example:**
```
godot_search("WebSocketPeer HTTPRequest")
```

#### `godot_read(class_name)`

Read full documentation for a specific class.

**Parameters:**
- `class_name` (string, required): Class name

**Example:**
```
godot_read("WebSocketPeer")
```

#### `godot_index(force?)`

Index or update the documentation database.

**Parameters:**
- `force` (boolean, optional): Force re-indexing

**Example:**
```
godot_index()
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
git clone https://github.com/tu-usuario/godot-docs-mcp.git
cd godot-docs-mcp
npm install
```

### Build

```bash
npm run build
```

### Run in Development

```bash
npm run dev
```

### Index Documentation

```bash
npm run index
```

## License

MIT License

Copyright (c) 2024 DreamFus Community

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a pull request**

### Development Guidelines

- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed
- Keep PRs focused and small

## Roadmap

- [x] ✅ Publish to npm as `godot-docs-mcp`
- [x] ✅ Integrate with PI MCP system
- [ ] Full documentation scraping from docs.godotengine.org
- [ ] Semantic search with embeddings (optional)
- [ ] Multi-language support
- [ ] DreamFus protocol documentation
- [ ] Community-contributed recipes and examples

## Acknowledgments

- [Godot Engine](https://godotengine.org/) - The fantastic game engine
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol this server implements
- [Better SQLite3](https://github.com/WiseLib/better-sqlite3) - Fast SQLite for Node.js

## Related

- [DreamFus Client](https://github.com/Pevalcar/dreamfus-client) - The game client this was originally built for
- [PI Coding Agent](https://github.com/earendil-works/pi-coding-agent) - The AI coding agent

## Support

If you find this useful, consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🤝 Contributing code

---

**Made with ❤️ for the Godot community**