# Changelog

## 2.0.1 (2026-05-19)

### Fixed
- **Cancelled task support**: строки `[-]` теперь корректно парсятся и записываются. Добавлен статус `TaskStatus.Cancelled` (checked=2).
- **Priority display**: `🔺` используется для всех задач высокой важности (вместо `⏫`). Оба символа `⏫` и `🔺` парсятся как `Priority.High`.
- **Null-propagation в API-клиенте**: значения `null` корректно отправляются в API для очистки полей (даты, теги). Защита от случайной зачистки SG-тегов пустым массивом.
- **Round-trip стабильность**: Phase 2a guard проверяет статус задачи в SG перед skip-ом — предотвращает ложное срабатывание на основе хеша.
- **Soft-delete защита**: `syncDeletedObsidianTasks()` проверяет refCount SG-задачи, не удаляет при наличии других ссылок.
- **lastModifiedSingularity сохранение**: поле больше не теряется — сохраняется во всех upsert-операциях, гарантируя корректную работу Phase 2a.
- **forward/reverse изоляция**: `_failedIds` трекает упавшие forward-задачи, reverse sync пропускает их — ошибки forward не затираются.
- **Done date из journalDate**: `✅` теперь получает дату из `journalDate` (а не `start`).
- **Date-only без дублирования эмодзи**: date-only задачи не получают дублирующие `🛫`/`⏳`.
- **Строгое сравнение тегов**: `getTagName` использует точное совпадение, а не `includes()`, предотвращая ложное матчинг.
- **projectTag в syncHash**: добавлен в содержимое хеша для корректного отслеживания перемещений между проектами.
- **404-handling**: `softDeleteTask`/`archiveTask` возвращают `null` при 404 без Notice/console.error.

## 2.0.0 (2026-05-19)

### Added
- **Per-project task files**: задачи каждого проекта хранятся в отдельном файле `/project/{название}.md`. Задачи без проекта — в `/tasks/tasks.md`. Файл = принадлежность к проекту.
- **Section-aware I/O**: секция `#### 📝 Tasks` (настраиваемый маркер) — единственное место для задач в файлах проектов. Остальное содержимое файла (frontmatter, описание, другие секции) сохраняется.
- **Frontmatter `singularity-id`**: автоматическая привязка файлов Obsidian к проектам Singularity. Позволяет отслеживать переименования проектов.
- **Auto-create проектов**: forward sync создаёт проекты в Singularity, если Obsidian-задача ссылается на проект, которого нет в SG.
- **Rename detection**: при переименовании проекта в Singularity reverse sync переименовывает соответствующий файл в Obsidian.
- **Create/Update Project API**: `POST /project`, `PATCH /project/{id}`.
- **Теги проектов в Singularity**: при синхронизации forward sync создаёт тег с именем проекта в Singularity (для кросс-фильтрации).
- **`tasksSectionMarker` в настройках**: пользователь может настроить маркер секции задач (по умолчанию `#### 📝 Tasks`).

### Changed
- **Модель связывания проектов**: принадлежность к проекту определяется файлом, а не тегом. Тег `#my-project` в строке задачи больше не нужен — достаточно поместить задачу в `/project/My Project.md`.
- **`extractProjectTag()`**: без эвристики первого не-todo тега. Только контекст файла определяет `projectTag`. Для задач из `tasks.md` → `null`.
- **`processTask()`**: название проекта больше не добавляется в `obsidianTags`. `projectTag` заполняется, но не выводится как тег.
- **`writeTasks()`**: группировка задач по `projectTag`, роутинг в per-project файлы через `vaultWriter.writeTasksToFile()`.
- **`formatTaskLine()`**: фильтрует `projectTag` из `regularTags` — тег проекта не выводится в строку задачи.
- **`ensureProjectFiles()`**: читает frontmatter для `singularity-id`, переименовывает файлы при смене названия проекта, добавляет frontmatter в существующие файлы.
- **`resolveTags()`**: создаёт тег проекта в Singularity (ранее `projectTag` пропускался).

### Migration from v1.x
- Задачи в `tasks.md` с тегом `#my-project` теряют привязку к проекту. Перенесите их в `/project/My Project.md` вручную.
- После первого sync задачи с `externalId` автоматически мигрируют в соответствующие проектные файлы через reverse sync.
- Проектные файлы без `singularity-id` получат его автоматически при ближайшей синхронизации.

## 1.2.6 (2026-05-17)

### Fixed
- **Created date preservation**: Если задача уже имеет `➕` в Obsidian — дата создания сохраняется при синхронизации. Для новых задач из Singularity ставится сегодняшняя дата.
- **UTC→Local conversion**: `utcIsoToLocalDate()` конвертирует все date-only поля (createdDate, deadline, journalDate, deleteDate) из UTC ISO в локальный часовой пояс.

## 1.2.5 (2026-05-17)

### Fixed
- **Date-only scheduled/start dates**: Reverse sync больше не теряет `⏳` или `🛫` когда дата без времени. Для date-only `start` проставляются оба поля.

## 1.2.4 (2026-05-17)

### Fixed
- **Priority emoji position**: Эмодзи приоритета (`🔺⏫🔼🔽⏬`) перемещён после всех emoji-дат для совместимости с плагином Obsidian Tasks.

## 1.2.3 (2026-05-17)

### Fixed
- **Reverse sync blocked**: Reverse sync теперь обрабатывает задачи, уже существующие в Obsidian. Ранее `setSyncedObsidianIds` получал все ID, из-за чего reverse sync полностью пропускал задачи, которые forward sync не создавал.
- **Done-статус из Singularity**: Reverse sync включает архивированные задачи (`includeArchived=true`). Задачи, отмеченные выполненными в Singularity, теперь отмечаются `[x]` в Obsidian.
- **Возврат из архива**: Forward sync проверяет `checked` статус SG-задачи. Если в SG задачу вернули в невыполненные, forward sync не архивирует её повторно.
- **Undone в Obsidian**: Если SG говорит `checked=0` (не выполнено), reverse sync обновляет строку в Obsidian обратно в `[ ]` без `✅`.
- **Duplicate строк в файле**: `extractLineDescription` и `_emojiDatesRe` исправлены — больше не оставляют `:00.000` в extracted description, не плодят дубликаты.
- **API key leak**: TaskStore.saveFn скрабит `singularityApiKey` и сохраняет `syncState` + `habitState`.
- **Conflict resolver**: Парсинг `modificatedDate` через `parseSgDate()` — корректно обрабатывает ISO-строки, Unix-секунды и Unix-миллисекунды.
- **Ошибки инициализации**: Guard на `view.loadState`, null-safe `loadData()` в `resetAndSync`.

## 1.2.2 (2026-05-15)

### Added
- **Auto-create `/project/` folder and project notes on first sync**: `ensureProjectFiles()` создаёт папку `/project/` и `.md` файлы для каждого проекта из Singularity, если их ещё нет. Файлы содержат название, эмодзи и описание проекта.
- **Tasks plugin prerequisite**: В README добавлен раздел с требованием установки плагина Obsidian Tasks.

### Changed
- `_projectCache` дополнен `_projectsFull` для хранения полных данных проектов (emoji, note).

### Fixed
- **Version badge in README**: Обновлён до 1.2.2 в обоих README.

## 1.2.1 (2026-05-15)

### Fixed
- **400 error on task sync**: `maxCount=5000` превышал лимит API (max 1000) → `GET /task` возвращал 400. Исправлено до 1000.
- **Silent error swallowing**: Ошибки в forward-sync и reverse-sync проглатывались пустыми `catch {}` без логирования. Добавлен `console.error`.
- **Duplicate tasks in reverse sync**: Reverse sync не фильтровал задачи, только что созданные forward sync, что приводило к дублям. Добавлен `syncedObsidianIds`.
- **Empty PATCH body**: `updateTask()` не обрабатывал `externalId`, из-за чего вызов `updateTask(sgId, { externalId })` отправлял пустой body `{}` → API возвращал 400.
- **Missing contentType**: `requestUrl()` Obsidian не получал `contentType: "application/json"` — Content-Type из headers мог игнорироваться.

### Added
- `AGENTS.md` — инструкция для OpenCode-сессий (GitFlow, команды, архитектура, API-спецификация, MCP-конвенции).

### Changed
- `updateTask()` теперь принимает `externalId` и выбрасывает ошибку при пустом теле запроса.
- `updateExisting()` проставляет `externalId` при матчинге задач по описанию.
- Улучшена диагностика: `new Notice` с телом ответа API при 400-ошибках.
