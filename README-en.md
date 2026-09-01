# Data4Library MCP

<p align="center">
  <img src="assets/data4library-mcp-logo.png" alt="Data4Library MCP logo" width="200" />
</p>

A Node.js MCP server for the Korean [Data4Library](https://www.data4library.kr/)
API. It registers 27 tools.

This is an independent open-source project and is not affiliated with or endorsed by the organization operating Data4Library or its official MCP server.

> **Service notice**
> The Data4Library API has recently shown intermittent latency and timeouts.
> When a tool call is slow or fails, check both the API status and this MCP
> server.

[한국어 문서](README.md)

## Tools

### Libraries

- `search_libraries`: search public libraries by region or name
- `search_nearby_libraries`: sort nearby libraries by straight-line distance
- `search_library_codes`: find a library code by name or region
- `get_library_info`: retrieve integrated library information

### Books and holdings

- `search_books`: search books by title, author, publisher, or subject
- `get_book_detail`: retrieve book details by ISBN
- `search_libraries_by_book`: find libraries holding a book
- `check_book_availability`: retrieve holdings and previous-day availability
- `get_new_arrival_books`: retrieve new arrivals by library

### Popularity and trends

- `search_popular_books`
- `search_popular_books_by_library`
- `get_popular_books_by_library`
- `get_hot_trend`
- `get_monthly_keywords`

### Statistics and analysis

- `get_usage_trend`
- `get_reading_quantity`
- `search_items`
- `get_book_usage_analysis`
- `get_book_keywords`

### Recommendations

- `get_mania_recommendations`
- `get_reader_recommendations`

### Code lookup

- `get_region_codes`
- `get_detailed_region_codes`
- `search_detailed_region_codes`
- `get_subject_codes`
- `get_detailed_subject_codes`
- `search_detailed_kdc_codes`

## Installation

Requirements:

- Node.js 18 or later
- A Data4Library API key

Apply for a key under `My Page > API Key` on the Data4Library website. Follow
the current Data4Library documentation for quotas and server-IP registration.

### NPX

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "command": "npx",
      "args": ["-y", "@isnow890/data4library-mcp"],
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

Set `LIBRARY_API_TIMEOUT_MS` to override the upstream request timeout. The
default is 10 seconds, and accepted values range from 50 to 60000 ms.

### Local installation

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

Configure the MCP client to run `dist/src/index.js` from the cloned repository.

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/data4library-mcp/dist/src/index.js"],
      "cwd": "/absolute/path/to/data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Local development

```bash
export LIBRARY_API_KEY="your-api-key"
npm run build
npm start
```

Docker is also supported.

```bash
docker build -t data4library-mcp .
docker run -i --rm -e LIBRARY_API_KEY="$LIBRARY_API_KEY" data4library-mcp
```

## Data limitations

- Data comes from Data4Library and follows its update schedule.
- Loan availability is a previous-day value and does not guarantee current
  circulation or reservation status.
- Nearby-library distance is straight-line distance, not route distance.

## Development commands

```bash
npm run build
npm run watch
```

Automated regression tests are not configured yet.

## License

[MIT](LICENSE)
