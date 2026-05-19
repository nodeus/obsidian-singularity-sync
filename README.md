# Singularity Sync

![Version](https://img.shields.io/badge/version-2.0.1-blue)
![Obsidian](https://img.shields.io/badge/Obsidian-1.5%2B-purple)

> **🌐 [Русская версия](README.ru.md)**

> **Two-way task synchronization** between [Obsidian](https://obsidian.md) (Tasks plugin) and [Singularity](https://singularity-app.com) — a cross-platform task manager with habits, kanban, and time tracking.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔄 **Bidirectional sync** | Keep tasks in sync between Obsidian and Singularity — changes in either app are reflected in both |
| 📋 **Sidebar panel** | View and manage Singularity tasks directly inside Obsidian — grouped by project, with checkboxes and filters |
| ✅ **Habits (3 states)** | 14-day habit tracker with 3 states (not done / half / full), colors from Singularity |
| 🔔 **Smart notifications** | `#notify/30`, `#notify/1h`, `#notify/1d` — time-based reminders |
| 📁 **Per-project files** | Tasks are stored in project files (`/project/*.md`) — file location IS the project membership |
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
- [ ] #todo Task title #tags ⏫ ➕ 2026-05-11 🛫 2026-05-12 ⏳ 2026-05-12 15:30 📅 2026-05-14 #notify/30
```

**Projects**: Project membership is determined by file location, not by tags.
- Tasks in `/project/My Project.md` → belong to "My Project"
- Tasks in `/tasks/tasks.md` → inbox (no project)
- No `#project-name` tag needed in the task line

### Order of emoji
| Position | Emoji | Meaning | Format |
|----------|-------|---------|--------|
| 1 | `➕` | Created date | `YYYY-MM-DD` |
| 2 | `🛫` | Start date | `YYYY-MM-DD` |
| 3 | `⏳` | Scheduled date | `YYYY-MM-DD HH:mm` |
| 4 | `📅` | Due date | `YYYY-MM-DD` |
| 5 | `✅` | Done date | auto |
| 6 | `❌` | Cancelled date | auto |

Priority emoji (`🔺⏫🔼🔽⏬`) goes after date emoji, before notify tags.

### Priority mapping
| Obsidian | Singularity |
|----------|-------------|
| `🔺` `⏫` | **0** (high) |
| `🔼` | **1** (medium) |
| `🔽` `⏬` | **2** (low) |

### Notification tags
| Tag | Singularity notifies |
|-----|-------------------|
| `#notify` or `#notify/0` | `[0]` (immediately) |
| `#notify/30` | `[30]` (30 min before) |
| `#notify/1h` | `[60]` (1 hour before) |
| `#notify/5h` | `[300]` (5 hours before) |
| `#notify/1d` | `[1440]` (1 day before) |

Notification tags are always placed at the end of the task line.

### Date mapping rules
| Obsidian | Singularity | Rule |
|----------|-------------|------|
| `➕` | `createdDate` + `start` (fallback) | Used as start if no 🛫 |
| `🛫` | `start` (date only) | Overrides ➕ for start |
| `⏳` | `start` (date + time) | Overrides 🛫 for start |
| `📅` | `deadline` (date) | — |
| `✅` | `checked: 1` + archive | Completes task |

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Base URL | `https://api.singularity-app.com/v2` | Singularity API endpoint |
| Tasks file | `/tasks/tasks.md` | File for inbox tasks (no project) |
| Projects folder | `/project` | Folder with project task files — one `.md` per project |
| Tasks section marker | `#### 📝 Tasks` | Heading marker for the tasks section in project files |
| Sync direction | `both` | `both`, `forward`, or `reverse` |
| Conflict resolution | `latest_wins` | How to resolve conflicting edits |
| Exclude tags | `GC, nosync` | Comma-separated tags to skip |

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
- 14-day grid view
- 3 states: not done (empty) → full → half → not done
- Click to cycle through states
- Cell colors match habit colors from Singularity

---

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
│   │   └── utils/
│   │       ├── date-parser.ts     # Emoji date extraction
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
│       └── conflict-modal.ts      # Manual conflict resolver
└── tests/                         # Vitest tests
```

---

## 🧪 Tests

| Suite | Count |
|-------|-------|
| **TypeScript (Vitest)** | 72 / 72 |

---

## 📄 License

MIT
