# Roadmap - Godot Docs MCP

## MVP Status: ✅ COMPLETED

### Completed Features

- [x] BCP25 full-text search implementation
- [x] Basic documentation database (6 sample entries)
- [x] Three core tools: godot_search, godot_read, godot_index
- [x] MIT License (opensource)
- [x] TypeScript implementation
- [x] Zero-dependencies build (only @modelcontextprotocol/sdk)
- [x] Works on Windows, Linux, macOS
- [x] Offline functionality after indexing

## Phase 1: Production Ready

- [ ] Full documentation scraping from docs.godotengine.org
- [ ] Automated indexing script
- [ ] Multi-class documentation support
- [ ] Property/method documentation extraction

## Phase 2: Enhanced Features

- [ ] Semantic search with embeddings (optional)
- [ ] Multi-language support (en, es, fr, de, etc.)
- [ ] Search result highlighting
- [ ] Documentation version selection (3.x, 4.x, 5.x)

## Phase 3: Community Features

- [ ] DreamFus protocol documentation
- [ ] Community-contributed recipes
- [ ] User-contributed examples
- [ ] Plugin documentation

## Phase 4: Distribution

- [ ] Publish to npm as `godot-docs-mcp`
- [ ] GitHub releases
- [ ] Docker image
- [ ] Documentation website

## Technical Debt / Shortcuts

### Current Limitations (MVP)

1. **Sample documentation only** - Currently has 6 sample entries
   - WebSocketPeer
   - StreamPeerTCP
   - JSON
   - HTTPRequest
   - Timer
   - GameClient Protocol (DreamFus)

2. **No automatic scraping** - Documentation needs to be manually scraped
   - Future: Add scraper script to fetch from docs.godotengine.org

3. **Simple BM25** - No advanced NLP features
   - Could add vector embeddings later

4. **Single file storage** - Uses JSON file instead of SQLite
   - Simpler, no native dependencies
   - Could migrate to SQLite for larger datasets

## Known Issues

- None currently (MVP is minimal)

## Contributing

See README.md for contribution guidelines.

## License

MIT - See LICENSE file for details.