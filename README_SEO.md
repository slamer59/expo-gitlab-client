# GitAlchemy SEO Analyzer

Comprehensive SEO analysis tool for GitAlchemy using DataForSEO API and UV script runner.

## Features

🔍 **Keyword Analysis**
- Track GitAlchemy rankings for target keywords
- Monitor competitor positions
- Analyze search volume and difficulty

📊 **SERP Analysis**
- Real-time search engine results
- Competitor position tracking
- SERP feature identification

🎯 **SEO Insights**
- Automated recommendations
- Performance tracking
- Rich console reports

## Setup

### 1. Install UV (if not installed)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Configure Credentials
```bash
# Copy the example environment file
cp .env.local.example .env.local

# Edit with your DataForSEO credentials
# Get credentials from: https://dataforseo.com/apis
```

### 3. Set DataForSEO Credentials
Add to `.env.local`:
```env
DATAFORSEO_LOGIN=your_login_email@example.com
DATAFORSEO_PASSWORD=your_password_here
```

## Usage

### Basic Analysis
```bash
# Analyze default GitAlchemy keywords
uv run seo_analyzer.py

# Quick analysis with default settings
./seo_analyzer.py
```

### Advanced Options
```bash
# Analyze custom keywords
uv run seo_analyzer.py -k "gitlab mobile app,gitlab android client"

# Different location targeting
uv run seo_analyzer.py -l "United Kingdom"

# Include competitor analysis
uv run seo_analyzer.py --competitors

# Generate full report with JSON export
uv run seo_analyzer.py --full-report -o gitalchemy_analysis.json

# All options combined
uv run seo_analyzer.py -k "gitlab mobile" -l "United States" --competitors --full-report -o report.json
```

## Default Keywords Analyzed

**Primary GitAlchemy Keywords:**
- gitlab mobile client
- gitlab android app
- gitlab ios app
- mobile gitlab management
- gitlab client app
- gitalchemy

**Feature-Specific Keywords:**
- gitlab merge request mobile
- gitlab ci cd mobile
- gitlab project management android
- mobile devops gitlab

**Competitor Keywords:**
- labcoat gitlab
- git+ gitlab
- mgvora gitplus
- gitlab mobile devops

## Output Examples

### Console Report
```
📊 GitAlchemy SEO Performance Summary
┌─────────────────────────────┬──────────┬───────────────┬────────────┬─────────────────────┐
│ Keyword                     │ Position │ Search Volume │ Difficulty │ Top Competitor      │
├─────────────────────────────┼──────────┼───────────────┼────────────┼─────────────────────┤
│ gitlab mobile client        │ Not Found│ 480          │ Medium     │ LabCoat GitLab      │
│ gitlab android app          │ 15       │ 320          │ Low        │ Official GitLab Docs│
│ gitalchemy                  │ 1        │ 90           │ Very Low   │ None                │
└─────────────────────────────┴──────────┴───────────────┴────────────┴─────────────────────┘

🎯 SEO Recommendations
• 🔍 Target missing keywords: gitlab mobile client, mobile devops gitlab
• 🏆 12 competitor opportunities identified
• 📱 Optimize for mobile-first indexing
• 🔗 Build quality backlinks from developer communities
• 📄 Create comprehensive GitLab tutorial content
• ⚡ Improve Core Web Vitals performance
• 🎯 Target long-tail keywords with lower competition
```

### JSON Report Structure
```json
{
  "gitlab mobile client": {
    "serp_results": { /* Full SERP data */ },
    "difficulty": { /* Keyword difficulty metrics */ },
    "search_volume": { /* Search volume data */ },
    "gitalchemy_position": null,
    "competitor_analysis": [
      {
        "position": 2,
        "url": "https://github.com/mgvora/gitplus_for_gitlab",
        "title": "Git+ GitLab Mobile App",
        "type": "Git+ Mobile App"
      }
    ],
    "analyzed_at": "2025-09-04T16:54:08Z"
  }
}
```

## DataForSEO API Endpoints Used

- **SERP Analysis**: `serp/google/organic/task_post`
- **Keyword Difficulty**: `dataforseo_labs/google/keyword_difficulty/task_post`
- **Search Volume**: `keywords_data/google_ads/search_volume/task_post`

## Rate Limiting

The script includes built-in rate limiting (1 second between requests) to respect DataForSEO API limits.

## Troubleshooting

### Common Issues

**Missing Credentials**
```
Error: DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD must be set in .env.local
```
Solution: Ensure `.env.local` exists with valid DataForSEO credentials.

**API Request Failed**
```
API Request failed: 401 Unauthorized
```
Solution: Verify your DataForSEO credentials are correct.

**UV Not Found**
```
uv: command not found
```
Solution: Install UV using the installation script above.

## Advanced Features

### Custom Keywords File
Create `keywords.txt` with one keyword per line:
```
gitlab mobile client
gitlab android app
mobile devops gitlab
```

Then analyze:
```bash
uv run seo_analyzer.py -k "$(cat keywords.txt | tr '\n' ',')"
```

### Scheduled Analysis
Add to crontab for daily reports:
```bash
# Daily GitAlchemy SEO analysis at 9 AM
0 9 * * * cd /path/to/project && uv run seo_analyzer.py --full-report -o "reports/daily_$(date +\%Y\%m\%d).json"
```

## Integration with CI/CD

Add to GitLab CI pipeline:
```yaml
seo_analysis:
  stage: analyze
  script:
    - uv run seo_analyzer.py --full-report -o seo_report.json
  artifacts:
    reports:
      junit: seo_report.json
    expire_in: 1 week
```

## Support

For DataForSEO API documentation: https://docs.dataforseo.com/v3/
For UV documentation: https://docs.astral.sh/uv/