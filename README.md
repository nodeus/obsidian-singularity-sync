# Singularity Sync

![Version](https://img.shields.io/badge/version-2.2.1-blue)
![Obsidian](https://img.shields.io/badge/Obsidian-1.5%2B-purple)

> **🌐 [Русская версия](README.ru.md)**

> **Two-way task synchronization** between [Obsidian](https://obsidian.md) (Tasks plugin) and [Singularity](https://singularity-app.com) — a cross-platform task manager with habits, kanban, and time tracking.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Bidirectional sync** | Keep tasks in sync between Obsidian and Singularity — changes in either app are reflected in both |
| 📋 **Sidebar panel** | View and manage Singularity tasks directly inside Obsidian — grouped by project, with checkboxes and filters |
| ✅ **Habits (3 states)** | Configurable habit tracker with 3 states (not done / half / full), colors from Singularity |
| 📝 **Inline habits panel** | Embed an interactive habits tracker inside any note via ```` ```singularity-habits ```` code block |
| 🔔 **Smart notifications** | `⏰` reminder + `#notify/30` offset from ⏰ — time-based reminders synced to Singularity |
| 📁 **Per-project files** | Tasks are stored in project files (`/project/*.md`) — file location IS the project membership |
| 📝 **Project descriptions** | Description from Singularity projects is synced to `#### 📝 Notes` section in project files |
| 📄 **Project template** | Customizable template for new project files with `{{title}}`, `{{singularity-id}}`, `{{date}}`, `{{emoji}}`, `{{note}}` |
| 🗑️ **Soft-delete** | Removing tasks or project files in Obsidian soft-deletes them in Singularity |
| ⚡ **Priority mapping** | 🔺⏫🔼🔽⏬ ↔ 0 / 1 / 2 |
| 🗂️ **Conflict resolution** | 4 strategies: Latest Wins / Obsidian Wins / Singularity Wins / Manual |
| 🔒 **SecretStorage** | API key stored securely in Obsidian's protected storage, never in plain text |
| ⏱️ **Status bar** | Last sync time displayed in the status bar |
| 📱 **Mobile support** | Works on desktop and mobile |

---

## 📥 Prerequisites

- **[Obsidian Tasks](https://obsidian.md/plugins?id=obsidian-tasks-plugin)** plugin must be installed and enabled. Singularity Sync relies on the Tasks plugin's task format — emoji dates (`➕🛫⏳📅✅❌`) and priority markers (`🔺⏫🔼🔽⏬`) are parsed using the Tasks plugin standard.

## 📥 Installation

### From BRAT (recommended)
1. Install [BRAT](https://obsidian.md/plugins?id=obsidian42-brat) from Community Plugins
2. Add `https://github.com/nodeus/singularity-sync` to BRAT
3. Enable **Singularity Sync** in Community Plugins

### Manual
Copy `main.js`, `manifest.json`, `styles.css` to `.obsidian/plugins/singularity-sync/`.

---

## 🚀 Quick Start

1. **Get an API key** from your [Singularity account](https://singularity-app.com/profile)
2. Open **Settings → Singularity Sync** in Obsidian
3. Enter your API key and base URL (default: `https://api.singularity-app.com/v2`)
4. Run **Singularity Sync: Sync now** from the command palette (or click the ribbon icon)
5. Open the **Singularity Panel** via ribbon icon or command palette

---

## 📝 Task Format

Only tasks with the `#todo` tag are synced. The expected format:

```
- [ ] #todo Task title #tags ➕ YYYY-MM-DD ⏰ YYYY-MM-DD HH:mm 🛫 YYYY-MM-DD ⏳ YYYY-MM-DD 📅 YYYY-MM-DD 🔼 #notify/30 #notify
```

**Standard order**: `#todo` → description → regular tags → `➕` → `⏰` → `🛫` → `⏳` → `📅` → `✅` → `❌` → priority → `#notify` tags.

Time is only allowed in `⏰` (reminder). All other date emojis (`🛫⏳📅`) use date-only format — this is required for Obsidian Tasks Plugin compatibility.

**Projects**: Project membership is determined by file location, not by tags.
- Tasks in `/project/My Project.md` → belong to "My Project"
- Tasks in `/tasks/tasks.md` → inbox (no project)
- No `#project-name` tag needed in the task line

### Frontmatter

Each project file (`/project/<name>.md`) contains a `singularity-id` in its frontmatter that links it to the Singularity project:

```
---
singularity-id: 550e8400-e29b-41d4-a716-446655440000
---
```

This is set automatically when the file is created. Do not remove or modify it manually.

### Order of emoji
| Position | Emoji | Meaning | Format |
|----------|-------|---------|--------|
| 1 | `➕` | Created date | `YYYY-MM-DD` |
| 2 | `⏰` | Reminder | `YYYY-MM-DD HH:mm` |
| 3 | `🛫` | Start date | `YYYY-MM-DD` |
| 4 | `⏳` | Scheduled date | `YYYY-MM-DD` |
| 5 | `📅` | Due date | `YYYY-MM-DD` |
| 6 | `✅` | Done date | auto |
| 7 | `❌` | Cancelled date | auto |

Priority emoji (`🔺⏫🔼🔽⏬`) goes after date emoji, before notify tags. `⏰` is the only emoji that supports time — all others are date-only.

### Priority mapping
| Obsidian | Singularity |
|----------|-------------|
| `🔺` `⏫` | **0** (high) |
| `🔼` | **1** (medium) |
| `🔽` `⏬` | **2** (low) |

### Notification tags
`#notify` is an offset from `⏰` (reminder time), NOT from deadline.

| Tag | Meaning |
|-----|---------|
| `#notify` or `#notify/0` | Notify at exactly `⏰` time |
| `#notify/30` | 30 min before `⏰` |
| `#notify/1h` | 1 hour before `⏰` |
| `#notify/5h` | 5 hours before `⏰` |
| `#notify/1d` | 1 day before `⏰` |

If `⏰` is set without `#notify`, the plugin sends `notifies: [0]` (notify at `⏰` time). If no `⏰` exists, no notifications are sent.

### Date mapping rules
| Obsidian | Singularity | Rule |
|----------|-------------|------|
| `➕` | `createdDate` + `start` (fallback) | Used as start if no 🛫 |
| `⏰` | `start` (date + time) | Reminder datetime |
| `🛫` | `start` (date only) | Overrides ➕ for start |
| `⏳` | `start` (date + time) | Overrides 🛫 for start |
| `📅` | `deadline` (date) | — |
| `✅` | `checked: 1` + archive | Completes task |

### Behavior

| Rule | Description |
|------|-------------|
| **Task matching** | Tasks are matched first by `externalId` (stored in local database), then by normalized title as fallback |
| **Soft-delete** | Removing the last synced `#todo` from a file soft-deletes the task in Singularity. Deleting a project file soft-deletes the entire project |
| **Rename detection** | Renaming a project in Singularity automatically renames the corresponding `.md` file in Obsidian |
| **SG tags with spaces** | Tags containing spaces from Singularity are converted: `#my tag` → `#my_tag` |

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Base URL | `https://api.singularity-app.com/v2` | Singularity API endpoint |
| Tasks file | `/tasks/tasks.md` | File for inbox tasks (no project) |
| Projects folder | `/project` | Folder with project task files — one `.md` per project |
| Tasks section marker | `#### 📝 Tasks` | Heading marker for the tasks section in project files |
| Notes section marker | `#### 📝 Notes` | Heading marker for project description (synced from Singularity) |
| Project template | *(empty)* | Template for new project files. Placeholders: `{{title}}`, `{{singularity-id}}`, `{{date}}`, `{{emoji}}`, `{{note}}` |
| Sync direction | `both` | `both`, `forward`, or `reverse` |
| Conflict resolution | `latest_wins` | How to resolve conflicting edits |
| Exclude tags | `GC, nosync` | Comma-separated tags to skip |
| Habits days count | `14` | Number of past days to show in sidebar habits tab (1–14) |

---

## 📄 Project Template

When a new project is created on Singularity, the plugin creates a corresponding `.md` file locally. You can customize its content via the `projectTemplate` setting.

| Placeholder | Replaced with |
|-------------|---------------|
| `{{title}}` | Project name |
| `{{singularity-id}}` | Singularity project UUID |
| `{{date}}` | Current date (`YYYY-MM-DD HH:mm:ss`) |
| `{{emoji}}` | Project emoji (Unicode hex) |
| `{{note}}` | Project description (synced from Singularity) |

Default (empty setting) produces:

```markdown
---
singularity-id: {{singularityId}}
---
# {{title}}
#### 📝 Notes
```

---

## 🖥️ Sidebar Panel

Opens automatically on startup if it was open before. Two tabs:

### 📋 Tasks tab
- Grouped by Singularity project
- Filter by project dropdown
- Exclude tags (comma-separated input)
- Checkbox toggles task completion (updates both Singularity and Obsidian immediately)
- Shows due dates inline

### ✅ Habits tab
- Configurable day range (1–14, set in Settings → ✅ Привычки)
- 3 states: not done (empty) → full → half → not done
- Click to cycle through states
- Cell colors match habit colors from Singularity

---

## 📝 Inline Habits Panel

Embed an interactive habit tracker directly inside any note using the `singularity-habits` code block.

### Syntax

````markdown
```singularity-habits
days: 14
- зарядка
- all
```
````

### Parameters

| Parameter | Description |
|-----------|-------------|
| `days: N` | Number of past days to show (default: 14) |
| `- all` | Show all habits from your Singularity account (default) |
| `- <name>` | Show only specific habits (filter by title) |

### Behavior

- The block renders a grid matching the sidebar habits tab
- Click a cell to cycle: empty → half (2) → full (1) → empty (0)
- Changes sync to Singularity API instantly and update both the sidebar panel and any other inline panels on the page
- Works in both **Live Preview** and **Reading View**

## ⌨️ Commands

| Command | Description |
|---------|-------------|
| `Singularity Sync: Sync now` | Run full bidirectional sync |
| `Singularity Sync: Check connection` | Validate API key and connection |
| `Singularity Sync: Open Singularity Panel` | Open the sidebar view |

---

## 📊 Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| Tasks (sync) | 1000 | Automatically synced per run. API returns max 1000 tasks per request. |
| Tasks (panel) | 200 | Sidebar panel shows up to 200 recent tasks. |
| Projects | 100 | All projects are loaded. |
| Tags | 500 | All tags are loaded and cached. |
| Habits | 100 | All habits are loaded for the panel. |

If you have more than 1000 active tasks, sync will process the first 1000. Completed/archived tasks don't count towards this limit.

## 🛡️ Security

- **API key** is stored in Obsidian's `SecretStorage` (not in `data.json`)
- Key is never written to logs or settings files
- On save, `settings` and `data.json` are scrubbed of any key traces

---

## 🏗️ Development

```bash
cd obsidian-plugin
npm install
npm run build        # production build
npm test             # run TypeScript tests
```

### Project structure
```
obsidian-plugin/
├── src/
│   ├── main.ts                    # Plugin entry, commands, panel lifecycle
│   ├── settings.ts                # Settings tab
│   ├── domain/
│   │   ├── models.ts              # TypeScript interfaces & enums
│   │   ├── mapper.ts              # Priority, state, date mapping
│   │   ├── parser.ts              # Obsidian task line parser
│   │   ├── conflict-resolver.ts   # Conflict resolution strategies
│   │   └── utils/
│   │       ├── date-parser.ts     # Emoji date extraction
│   │       ├── delta-parser.ts    # Singularity Delta format parser
│   │       └── tag-extractor.ts   # Tag & notification parsing
│   ├── adapters/
│   │   ├── singularity/
│   │   │   └── api-client.ts      # Singularity REST API client
│   │   ├── obsidian/
│   │   │   ├── vault-reader.ts    # Read tasks from vault
│   │   │   └── vault-writer.ts    # Write tasks to vault
│   │   └── db/
│   │       └── task-store.ts      # Sync state persistence
│   ├── orchestrators/
│   │   ├── forward-sync.ts        # Obsidian → Singularity
│   │   ├── reverse-sync.ts        # Singularity → Obsidian
│   │   └── bidirectional-sync.ts  # Combined sync orchestrator
│   └── ui/
│       ├── singularity-view.ts    # Sidebar panel (tasks + habits)
│       ├── habits-inline.ts       # Inline habits code block processor
│       └── conflict-modal.ts      # Manual conflict resolver
└── tests/                         # Vitest tests
```

---

## 🧪 Tests

| Suite | Count |
|-------|-------|
| **TypeScript (Vitest)** | 80 / 80 |

---

## 📄 License

MIT
