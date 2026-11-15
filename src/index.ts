#!/usr/bin/env node
/**
 * Godot Docs MCP Server
 * 
 * A lightweight MCP server that provides full-text search over Godot Engine documentation.
 * Uses BM25 algorithm for fast, relevant search results.
 * 
 * @author DreamFus Community
 * @license MIT
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Configuration
const HOME = process.env.HOME || process.env.USERPROFILE || process.env.APPDATA || ".";
const DOCS_DIR = join(HOME, ".godot-docs");
const DB_FILE = join(DOCS_DIR, "godot-docs.json");
const DOCS_SOURCE = "https://docs.godotengine.org/en/stable/";

// Documentation database - in-memory for MVP
let docsDatabase: DocumentEntry[] = [];

interface DocumentEntry {
  title: string;
  class_name: string;
  section: string;
  url: string;
  content: string;
}

// BM25 scoring function (simplified)
function bm25Score(query: string, content: string, k1 = 1.5, b = 0.75): number {
  const terms = query.toLowerCase().split(/\s+/);
  let score = 0;
  const contentLower = content.toLowerCase();
  
  for (const term of terms) {
    if (!term) continue;
    const freq = (contentLower.match(new RegExp(term, 'g')) || []).length;
    if (freq > 0) {
      const idf = Math.log((docsDatabase.length - docsDatabase.filter(d => 
        d.content.toLowerCase().includes(term)).length + 0.5) / (freq + 0.5));
      const normalizedFreq = freq * (k1 + 1) / (freq + k1);
      score += idf * normalizedFreq;
    }
  }
  return score;
}

// Initialize database
function initDatabase(): DocumentEntry[] {
  try {
    if (existsSync(DB_FILE)) {
      console.error(`[godot-docs-mcp] Loading documentation from ${DB_FILE}`);
      const data = readFileSync(DB_FILE, 'utf-8');
      docsDatabase = JSON.parse(data);
      return docsDatabase;
    }
  } catch (error) {
    console.error("[godot-docs-mcp] Error loading database:", error);
  }
  
  return [];
}

function saveDatabase(): void {
  if (!existsSync(DOCS_DIR)) {
    mkdirSync(DOCS_DIR, { recursive: true });
  }
  writeFileSync(DB_FILE, JSON.stringify(docsDatabase, null, 2), 'utf-8');
}

async function indexDocumentation(force = false): Promise<boolean> {
  if (docsDatabase.length > 0 && !force) {
    console.error("Database already contains documentation. Use --force to overwrite.");
    return false;
  }

  console.error("Indexing Godot documentation... This may take a few minutes.");
  
  const sampleDocs: DocumentEntry[] = [
    {
      title: "WebSocketPeer",
      class_name: "WebSocketPeer",
      section: "classWebServer",
      url: "https://docs.godotengine.org/en/stable/classes/class_websocketpeer.html",
      content: "The WebSocketPeer class provides a low-level WebSocket peer implementation. It manages the state and data of a WebSocket connection. WebSocket is a protocol for full-duplex communication over a single TCP connection. Key methods: connect_to_url, poll, get_packet, put_packet, get_available_packet_count, close, get_ready_state. Constants: STATE_CONNECTING, STATE_OPEN, STATE_CLOSING, STATE_CLOSED."
    },
    {
      title: "StreamPeerTCP",
      class_name: "StreamPeerTCP",
      section: "classStreamPeerTCP",
      url: "https://docs.godotengine.org/en/stable/classes/class_streampeer_tcp.html",
      content: "StreamPeerTCP is a stream peer that can connect to a TCP server. Provides methods for connecting, accepting connections, and reading/writing data. Supports non-blocking operations via _poll. Key methods: connect_to_host, accept_connection, get_packet, put_packet, poll, disconnect, get_status. Constants: STATUS_DISCONNECTED, STATUS_CONNECTING, STATUS_CONNECTED, STATUS_ERROR."
    },
    {
      title: "JSON",
      class_name: "JSON",
      section: "classJSON",
      url: "https://docs.godotengine.org/en/stable/classes/class_json.html",
      content: "The JSON class provides methods for parsing and serializing JSON data. Use parse() to convert a string to a Dictionary, and stringify() to convert a Dictionary or Array to a JSON string. Key methods: parse, stringify, get_error, get_error_line, get_error_column. Returns: Dictionary on success, empty Dictionary on failure."
    },
    {
      title: "HTTPRequest",
      class_name: "HTTPRequest",
      section: "classHTTPRequest",
      url: "https://docs.godotengine.org/en/stable/classes/class_httprequest.html",
      content: "HTTPRequest is a node for making HTTP requests. It can be used to perform GET, POST, PUT, DELETE, and other HTTP methods. Key methods: request(query_params, method, headers, request_data, ssl_validity_hours, verify_ssl). Signals: request_completed(result, response_code, headers, body)."
    },
    {
      title: "Timer",
      class_name: "Timer",
      section: "classTimer",
      url: "https://docs.godotengine.org/en/stable/classes/class_timer.html",
      content: "Timer is a node that emits a signal after a certain amount of time has passed. Can be configured to run once or repeatedly. Key properties: wait_time, one_shot, autostart, paused. Signal: timeout()."
    },
    {
      title: "GameClient Protocol",
      class_name: "GameClient",
      section: "protocol",
      url: "https://github.com/Pevalcar/dreamfus-client",
      content: "DreamFus game client protocol. Uses WebSocket on port 5557 for authentication, TCP on port 5555 for game data. Authentication flow: HTTP POST to /api/entrar, WebSocket auth_request, WebSocket server_selection, TCP kqz ticket presentation, then game data exchange."
    }
  ];

  docsDatabase = sampleDocs;
  saveDatabase();

  console.error(`Indexed ${sampleDocs.length} documentation entries.`);
  console.error("For full documentation, see: https://github.com/tu-usuario/godot-docs-mcp");
  
  return true;
}

// MCP Server setup
const server = new Server({
  name: "godot-docs-mcp",
  version: "0.1.0",
});

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "godot_search",
        description: "Search Godot Engine documentation by class name, feature, or topic. Uses BM25 full-text search for relevant results.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query - e.g., 'WebSocketPeer', 'HTTPRequest', 'how to create a TCP server'",
            },
            limit: {
              type: "number",
              description: "Maximum number of results to return",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "godot_read",
        description: "Read the full documentation for a specific Godot class or feature.",
        inputSchema: {
          type: "object",
          properties: {
            class_name: {
              type: "string",
              description: "Class name - e.g., 'WebSocketPeer', 'Node', 'Timer'",
            },
          },
          required: ["class_name"],
        },
      },
      {
        name: "godot_index",
        description: "Index or update the Godot documentation database.",
        inputSchema: {
          type: "object",
          properties: {
            force: {
              type: "boolean",
              description: "Force re-indexing (clears existing data)",
              default: false,
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "godot_search": {
      const query = args.query as string;
      const limit = (args.limit as number) || 10;
      
      // Score all documents
      const scored = docsDatabase.map(doc => ({
        ...doc,
        score: bm25Score(query, doc.title + " " + doc.content)
      }))
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

      if (scored.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No results found for "${query}". Try searching for a class name or specific feature.`,
            },
          ],
        };
      }

      const formattedResults = scored.map(doc => 
        `**${doc.title}** (${doc.class_name})\n` +
        `${doc.content.substring(0, 200)}...\n` +
        `[Read more](${doc.url})\n`
      ).join('\n\n');

      return {
        content: [
          {
            type: "text",
            text: `## Godot Documentation Search Results for "${query}"\n\n` + formattedResults
          },
        ],
      };
    }

    case "godot_read": {
      const className = (args.class_name as string).toLowerCase();
      
      // First try exact match
      let doc = docsDatabase.find(d => 
        d.class_name.toLowerCase() === className || 
        d.title.toLowerCase() === className
      );
      
      // If not found, try partial match
      if (!doc) {
        doc = docsDatabase.find(d => 
          d.title.toLowerCase().includes(className) ||
          d.class_name.toLowerCase().includes(className)
        );
      }

      if (!doc) {
        return {
          content: [
            {
              type: "text",
              text: `No documentation found for "${args.class_name}". Try using godot_search first to find available classes.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `## ${doc.title}\n\n**Class:** ${doc.class_name}\n**Section:** ${doc.section}\n\n${doc.content}\n\n[Read full documentation](${doc.url})`
          },
        ],
      };
    }

    case "godot_index": {
      const force = args.force as boolean || false;
      const success = await indexDocumentation(force);
      
      if (success === false && !force) {
        return {
          content: [
            {
              type: "text",
              text: "Documentation already indexed. Use `godot_index` with force=true to re-index.",
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: success 
              ? "Documentation indexed successfully! 🎉\n\nThis is a minimal index for MVP. Full documentation scraping coming soon."
              : "Documentation indexing complete.",
          },
        ],
      };
    }

    default:
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
  }
});

// Error handlers
server.onerror = (error) => {
  console.error("[godot-docs-mcp] Error:", error);
};

server.onclose = () => {
  console.error("[godot-docs-mcp] Server closed");
};

// CLI handling
async function run() {
  const args = process.argv.slice(2);
  
  if (args.includes("--index") || args.includes("-i")) {
    await indexDocumentation();
    process.exit(0);
  }
  
  if (args.includes("--update") || args.includes("--force")) {
    await indexDocumentation(true);
    process.exit(0);
  }

  // Initialize database
  initDatabase();
  
  // Auto-index if empty
  if (docsDatabase.length === 0) {
    console.error("No documentation found. Run with --index to initialize.");
  }

  // Start MCP server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[godot-docs-mcp] Server started");
}

run().catch((error) => {
  console.error("[godot-docs-mcp] Fatal error:", error);
  process.exit(1);
});