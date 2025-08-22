<div align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/rottenbridge-e6efa.appspot.com/o/logo.jpg?alt=media&token=68d16fd2-799f-4aba-8c1e-da6977e2949e" alt="Data4Library MCP Server Logo" width="300"/>
</div>

# 📚 Data4Library MCP Server

**Data4Library MCP** is a comprehensive **MCP (Model Context Protocol) server** developed to fully leverage the **Data4Library API** provided by the **National Library of Korea**. It enables AI models to easily access and utilize information about all Korean public libraries, book searches, loan status, reading statistics, and more.

> 🇰🇷 **Korean Documentation**: [README-ko.md](README-ko.md)

## 🌟 What is Data4Library?

[Data4Library](https://www.data4library.kr/) is a **national public library integrated information service** operated by the **National Library of Korea**. It integrates and provides real-time data from over 1,000 public libraries nationwide, including:

- 📍 **Nationwide public library locations and operational information** (1,000+ libraries)
- 📖 **Book holdings and loan status** (real-time)
- 📊 **Loan statistics and trend analysis**
- 🔥 **Popular books and trending titles**
- 📈 **Regional/age-based reading quantity statistics**
- 🆕 **New arrival information**

## 🎯 Key Features (25 Tools)

### 📚 Library & Book Search

- **🏛️ Nationwide Public Library Search** (`search_libraries`): Search by region, library name
- **📖 Comprehensive Book Search** (`search_books`): Search by title, author, publisher, subject
- **🔍 Library Holdings Search** (`search_libraries_by_book`): Find libraries that hold specific books
- **📋 Book Details** (`get_book_detail`): Detailed information lookup by ISBN
- **✅ Loan Availability** (`check_book_availability`): Real-time loan availability status

### 📊 Popular Books & Trend Analysis

- **🔥 Popular Loan Books** (`search_popular_books`): National/regional bestsellers
- **🏆 Library-specific Popular Books** (`search_popular_books_by_library`): Popular books at specific libraries
- **📈 Trending Books** (`get_hot_trend`): Real-time trending book queries
- **🆕 New Arrivals** (`get_new_arrival_books`): Latest acquisitions by library
- **🏷️ Monthly Keywords** (`get_monthly_keywords`): Reading trend keywords

### 📈 Statistics & Analytics Tools

- **📊 Loan/Return Trends** (`get_usage_trend`): Library usage statistics graphs
- **🌍 Regional Reading Volume** (`get_reading_quantity`): Reading rate and volume comparison
- **📚 Collection/Loan Data** (`search_items`): Detailed library statistics
- **📖 Book Usage Analysis** (`get_book_usage_analysis`): Usage patterns for specific books

### 🎯 Personalized Recommendation System

- **🎓 Expert Recommendations** (`get_mania_recommendations`): Advanced books for specialists
- **📚 Avid Reader Recommendations** (`get_reader_recommendations`): Books for continuous reading
- **🏷️ Book Keyword Analysis** (`get_book_keywords`): Core keywords for each book

### 🗺️ Location-Based Services (Custom Implementation)

- **📍 Nearby Library Search** (`search_nearby_libraries`): GPS-based automatic nearby library search
  - **Distance Sorting**: Real-time distance calculation and nearest-first sorting
  - **Detailed Distance Information**: Precise distance (km) to each library

### 🔧 Code Search Tools (API Integration Support)

- **🏛️ Library Code Search** (`search_library_codes`): Find libCode by library name
- **🌍 Region Code Lookup** (`get_region_codes`, `get_detailed_region_codes`): National/detailed region codes
- **📚 Subject Classification Codes** (`get_subject_codes`, `get_detailed_subject_codes`): KDC major/sub-classifications
- **📊 Integrated Information Lookup** (`get_library_info`, `get_popular_books_by_library`): Comprehensive library information

### 🛠️ Session Management

- **📊 Usage Statistics** (`session_stats`): Real-time tool call statistics and session information

## 💡 Real-World Usage Scenarios

### 🔍 Finding Libraries

- **"Where are libraries near me?"** → Use `search_nearby_libraries`
- **"Find libraries in Gangnam-gu, Seoul"** → Sequential use of `search_detailed_region_codes` + `search_libraries`

### 📖 Book Search

- **"Where can I borrow Harry Potter books?"** → Link `search_books` + `search_libraries_by_book`
- **"Find novels by Kim Young-ha"** → `search_books` (author name search)

### 📊 Trend Analysis

- **"What books are popular these days?"** → `search_popular_books` or `get_hot_trend`
- **"Popular books at Gangnam Library"** → `search_library_codes` + `search_popular_books_by_library`

### 📈 Statistical Analysis

- **"How much do people in Seoul read?"** → `get_reading_quantity`
- **"Show me library usage graphs"** → `get_usage_trend`

### 🎯 Complex Query Examples

- **"New book status at nearby libraries"**

  1. `search_nearby_libraries` (location-based library search)
  2. `get_new_arrival_books` (new arrivals for each library)

- **"Show popular economics books ranking in Gangnam-gu libraries"**
  1. `search_detailed_region_codes` (lookup Gangnam-gu code)
  2. `get_subject_codes` (lookup economics field code)
  3. `search_popular_books_by_library` (search with filters applied)

## 🚀 Technical Features

- **✅ Complete API Wrapping**: Full support for all 25 Data4Library API endpoints
- **🔗 Smart Chaining**: Automatic tool linking for complex query processing
- **⚡ Real-time Data**: Real-time synchronization with Data4Library
- **🗺️ Location-based Algorithm**: Custom implementation using Haversine formula for distance calculation and sorting
- **🛡️ Zod Schema Validation**: Type safety assurance for all input values
- **📊 Session Statistics**: Real-time tool usage monitoring
- **🔧 Error Handling**: Detailed logging and debugging information
- **🎯 Scenario-based Descriptions**: Specific usage scenarios to help LLMs easily select appropriate tools

## 🎬 Use Cases

### 🏛️ Civic/Institutional Portals

- Neighborhood library status and operational information chatbots
- New/popular book notification services

### 🎓 Education/Research

- KDC subject-based reading trend analysis
- Age/regional reading statistics reports

### 📈 Publishing/Marketing

- Popular genre/book discovery (by age/gender/region)
- Trend change monitoring

### 📱 Apps/Services

- ISBN-based real-time holdings/loan availability UX
- Location-based library recommendations

## 🚀 Getting Started

### 1️⃣ Prerequisites

- Node.js 18+
- Data4Library API key

### 2️⃣ How to Get an API Key

1. Sign up at [Data4Library](https://www.data4library.kr/)
2. Log in and click **[MyPage]** in the top right
3. Select **Authentication Key** from the MyPage menu
4. Check appropriate **usage purpose** and **agree to personal information collection terms**
5. Click **Complete Modification** button
6. Status will show **Pending Approval** - approval takes time
7. After approval, copy the issued API key and store it in environment variables

💡 **Note**: Approval processing may take time. Usually approved the next morning after application.

### 📊 API Call Limits

- **Default**: 500 calls per day limit
- **After IP Registration**: 30,000 calls per day limit

**IP Registration Method**: In MyPage → Authentication Key Management, enter your computer's IP address in the **Server IP field** where the MCP server will run. This expands the call limit from 500 to 30,000 per day.

⚠️ **Important**: Since November 20, 2023, unlimited calls have been discontinued and the maximum limit is 30,000 calls per day.

### 3️⃣ Environment Variables

- **LIBRARY_API_KEY** (required): API key issued from Data4Library

Windows PowerShell (current session):

```powershell
$env:LIBRARY_API_KEY="your-api-key"
```

macOS/Linux:

```bash
export LIBRARY_API_KEY="your-api-key"
```

## 📦 Installation

### Method 1: NPX Installation (Recommended)

The easiest way to use this MCP server is through NPX installation. For detailed package information, see the [NPM package page](https://www.npmjs.com/package/@isnow890/data4library-mcp).

#### Claude Desktop Configuration

Add the following to your Claude Desktop config file (Windows: `%APPDATA%\Claude\claude_desktop_config.json`, macOS/Linux: `~/Library/Application Support/Claude/claude_desktop_config.json`):

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

#### Cursor AI Configuration

Add to `mcp.json`:

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

### Method 2: Local Installation

For local development or custom modifications:

#### Step 1: Download Source Code and Build

##### Clone with Git

```bash
git clone https://github.com/isnow890/data4library-mcp.git
cd data4library-mcp
npm install
npm run build
```

##### Or Download ZIP File

1. Download the latest version from [GitHub Releases page](https://github.com/isnow890/data4library-mcp/releases)
2. Extract the ZIP file to your desired location
3. Navigate to the extracted folder in terminal:

```bash
cd /path/to/data4library-mcp
npm install
npm run build
```

⚠️ **Important**: After installation, you must run `npm run build` to generate the compiled JavaScript files in the `dist` folder.

#### Step 2: Claude Desktop Configuration

After build completion, you'll need:

- **LIBRARY_API_KEY**: API key issued from Data4Library
- **Installation path**: Absolute path to the downloaded folder

##### Windows Configuration

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

##### macOS/Linux Configuration

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

##### Path Configuration Important Notes

⚠️ **Important**: Replace the following paths in the above configuration with your actual installation paths:

- **Windows**: Change `C:\\path\\to\\data4library-mcp` to your actual downloaded folder path
- **macOS/Linux**: Change `/path/to/data4library-mcp` to your actual downloaded folder path
- **Build path**: Make sure the path points to `dist/src/index.js` (not just `index.js`)

Finding the path:

```bash
# Check current location
pwd

# Absolute path examples
# Windows: C:\Users\YourName\Downloads\data4library-mcp
# macOS: /Users/YourName/Downloads/data4library-mcp
# Linux: /home/YourName/Downloads/data4library-mcp
```

#### Step 3: Restart Claude Desktop

After completing the configuration, completely close and restart Claude Desktop to activate the Data4Library MCP server.

## 🔧 Local Execution (Development/Testing)

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

## 💡 Usage Tips

- **Fuzzy search**: Use `search_library_codes` to find libraries by partial name/address
- **Code helpers**: `get_subject_codes`, `search_detailed_kdc_codes`, `search_detailed_region_codes` for required parameter code lookup
- **Session monitoring**: `session_stats` shows per-session tool usage/limits
- **Tool chaining**: Complex queries can be solved by using multiple tools sequentially

## 📝 License & Notices

- **License**: MIT (see LICENSE file)
- **Data source**: Data4Library public API
- **Usage**: Follow public API policies/quotas. Do not store/expose personal data.

---

💬 **Questions or feedback?** Please open a GitHub issue!
