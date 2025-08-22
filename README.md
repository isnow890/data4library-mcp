# data4library-mcp · Data4Library MCP Server

MCP server exposing the Data4Library (Korean public libraries) API. It lets AI agents (Claude, Cursor, Windsurf, etc.) query and analyze Korean public library and book data via natural language.

This document focuses on what it does and how to use it. For Korean, see README-ko.md.

## What can it do?

- Find libraries: search and view details by region/district/name
- Find books: advanced search by title/author/ISBN/keywords with rich bibliographic data
- Check holdings/loans: see if a book is held and currently loanable at a library
- Popular/rising books: trend insights with region/age/gender filters
- New arrivals: latest acquisitions by library
- Reading stats: reading quantity/rate by region, monthly trending keywords
- Recommendations/insights: mania/reader recommendations, book keywords and usage analysis

## Available Tools

### 📚 Library Management
- **`search_libraries`**: Search public libraries nationwide (by region, library name)
- **`get_library_info`**: Integrated library information (basic info + loan trends + new arrivals)
- **`get_usage_trend`**: Library loan/return trends (by day of week/hour)
- **`get_new_arrival_books`**: New arrival books by library
- **`search_library_codes`**: Search library codes by library name/region

### 📖 Book Operations
- **`search_books`**: Book search (by title, author, ISBN, keywords)
- **`get_book_detail`**: Detailed book information by ISBN
- **`check_book_availability`**: Check book holdings and loan availability at specific library
- **`search_items`**: Library collection/loan data query
- **`search_libraries_by_book`**: Find libraries holding specific books

### 🔥 Popular Books & Trends
- **`search_popular_books`**: National popular loan books (filter by gender, age, region, subject)
- **`search_popular_books_by_library`**: Popular loan books by library/region
- **`get_popular_books_by_library`**: Integrated popular books by library (top 20 by age group)
- **`get_hot_trend`**: Rising loan books (rank changes over last 7 days)

### 📊 Statistics & Analytics
- **`get_reading_quantity`**: Regional reading quantity and reading rate statistics
- **`get_monthly_keywords`**: Monthly trending keywords (based on rising loan books)

### 🔍 Advanced Book Analysis
- **`get_book_keywords`**: Book's core keyword list (up to 50 keywords)
- **`get_book_usage_analysis`**: Book usage analysis (loan trends, keywords, co-borrowed books)
- **`get_mania_recommendations`**: Recommendations for enthusiasts (conditional probability based)
- **`get_reader_recommendations`**: Recommendations for avid readers (exponential conditional probability)

### 🗂️ Code Helper Tools
- **`get_region_codes`**: Region code list query
- **`get_detailed_region_codes`**: Detailed region codes for specific regions
- **`search_detailed_region_codes`**: Search detailed region codes (for dtl_region parameter)
- **`get_subject_codes`**: KDC major subject classification codes
- **`get_detailed_subject_codes`**: Detailed subject codes for specific major subjects
- **`search_detailed_kdc_codes`**: Search detailed KDC subject codes (for dtl_kdc parameter)

### ⚙️ System
- **`session_stats`**: Check current session's tool usage and statistics

> 💡 **Note**: Detailed parameters for each tool can be found in `src/schemas/book.schema.ts`.

## Where is it useful?

- Civic/Institutional portals: neighborhood library status, operations, new/popular book chatbots
- Education/Research: KDC-topic reading trends and age/region statistics reports
- Publishing/Marketing: discover popular genres/titles by age/gender/region and monitor trend shifts
- Apps/Services: real-time UX for ISBN-based holdings and loan availability

Prompt examples

- “Show only public libraries in Gangnam-gu, Seoul, with phone and website.”
- “Can I borrow ISBN 9788936434120 at Seoul Metropolitan Library?”
- “Top 20 books most borrowed by teens in Seoul.”
- “Find KDC detailed codes related to ‘algorithms’ in computer science.”

## Getting started

### 1) Prerequisites

- Node.js 18+
- Data4Library API key

### 2) How to get an API key

1. Visit https://www.data4library.kr/ and sign up
2. Log in and click **[MyPage]** in the top-right corner
3. Select **인증키 (Authentication Key)** from the MyPage menu
4. Check an appropriate **usage purpose** and **agree to personal information collection terms**
5. Click **수정완료 (Complete Modification)** button
6. Status will show **승인대기중 (Pending Approval)** - approval takes time
7. After approval, copy the issued API key and store it in environment variables

💡 **Note**: Approval processing may take time. Usually approved the next morning after application.

### API Call Limits

- **Default**: 500 calls per day limit
- **After IP registration**: 30,000 calls per day limit

**IP Registration Method**: In MyPage → Authentication Key Management, enter your computer's IP address in the **Server IP field** where the MCP server will run. This expands the call limit from 500 to 30,000 per day.

⚠️ **Important**: Since November 20, 2023, unlimited calls have been discontinued and the maximum limit is 30,000 calls per day.

### 3) Environment variables

- **LIBRARY_API_KEY** (required): API key issued from Data4Library

Windows PowerShell (current session):

```powershell
$env:LIBRARY_API_KEY="your-api-key"
```

macOS/Linux:

```bash
export LIBRARY_API_KEY="your-api-key"
```

## Install

### Step 1: Download source code

To use this MCP server, first download the source code:

#### Clone with Git

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

#### Or download ZIP file

1. Download the latest version from [GitHub Releases page](https://github.com/isnow890/data4library-mcp/releases)
2. Extract the ZIP file to your desired location
3. Navigate to the extracted folder in terminal:

```bash
cd /path/to/data4library-mcp
npm install
npm run build
```

### Step 2: Claude Desktop Configuration

After installation, you'll need:

- **LIBRARY_API_KEY**: API key issued from Data4Library
- **Installation path**: Absolute path to the downloaded folder

#### Windows Configuration

Add the following to Claude Desktop config file (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "cmd",
      "args": [
        "/c",
        "node",
        "C:\\path\\to\\data4library-mcp\\dist\\src\\index.js"
      ],
      "cwd": "C:\\path\\to\\data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

#### macOS/Linux Configuration

Add the following to Claude Desktop config file (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/data4library-mcp/dist/src/index.js"],
      "cwd": "/path/to/data4library-mcp",
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Step 3: Path Configuration Important Notes

⚠️ **Important**: Replace the following paths in the above configuration with your actual installation paths:

- **Windows**: Change `C:\\path\\to\\data4library-mcp` to your actual downloaded folder path
- **macOS/Linux**: Change `/path/to/data4library-mcp` to your actual downloaded folder path

Finding the path:

```bash
# Check current location
pwd

# Absolute path examples
# Windows: C:\Users\YourName\Downloads\data4library-mcp
# macOS: /Users/YourName/Downloads/data4library-mcp
# Linux: /home/YourName/Downloads/data4library-mcp
```

### Step 4: Restart Claude Desktop

After completing the configuration, completely close and restart Claude Desktop to activate the Data4Library MCP server.

## Local execution (for development/testing)

To run directly without Claude Desktop integration:

```bash
npm start
# or
node dist/src/index.js
```

Docker (optional):

```bash
docker build -t data4library-mcp .
docker run -i --rm -e LIBRARY_API_KEY=$LIBRARY_API_KEY data4library-mcp
```

MCP client integration (.mcp.json example, local run):

```json
{
  "mcpServers": {
    "data4library-mcp": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/src/index.js"],
      "env": {
        "LIBRARY_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Tips

- Fuzzy search: use `search_library_codes` to find libraries by partial name/address
- Code helpers: `get_subject_codes`, `search_detailed_kdc_codes`, `search_detailed_region_codes`
- Session monitoring: `session_stats` shows per-session tool usage/limits

## License & notices

- License: MIT (see LICENSE)
- Data source: Data4Library public API
- Usage: follow public API policies/quotas. Do not store/expose personal data.

---

Questions/feedback? Please open a GitHub issue.
