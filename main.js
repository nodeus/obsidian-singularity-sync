"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => SingularitySyncPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian8 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  singularityApiKey: "",
  singularityApiBaseUrl: "https://api.singularity-app.com/v2",
  obsidianTasksFile: "/tasks/tasks.md",
  obsidianProjectsFolder: "/project",
  tasksSectionMarker: "#### \u{1F4DD} Tasks",
  projectTemplate: "",
  syncDirection: "both",
  syncConflictResolution: "latest_wins",
  syncExcludeTags: "GC,nd",
  syncDryRun: false
};
var SingularitySyncSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  async display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Singularity Sync \u2014 \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" });
    containerEl.createEl("h3", { text: "\u{1F511} Singularity API" });
    containerEl.createEl("p", {
      text: "\u041A\u043B\u044E\u0447 \u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F \u0432 \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u043E\u043C \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 Obsidian (SecretStorage).",
      cls: "setting-item-description"
    });
    const hasKey = await this.plugin.hasApiKey();
    const statusText = containerEl.createEl("span", {
      text: hasKey ? "\u2713 \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D" : "\u26D4 \u041A\u043B\u044E\u0447 \u043D\u0435 \u0437\u0430\u0434\u0430\u043D"
    });
    let keyInput;
    new import_obsidian.Setting(containerEl).setName("API Key").setDesc("\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u0432\u044B\u0439 \u043A\u043B\u044E\u0447 \u0438\u043B\u0438 \u0443\u0434\u0430\u043B\u0438\u0442\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439.").addText((text) => {
      keyInput = text.inputEl;
      text.setPlaceholder("sk_live_xxx").setValue("");
    }).addButton(
      (btn) => btn.setButtonText("\u{1F4BE} \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C").onClick(async () => {
        const val = keyInput.value.trim();
        if (!val) return;
        await this.plugin.saveApiKey(val);
        keyInput.value = "";
        statusText.textContent = "\u2713 \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D";
      })
    ).addButton(
      (btn) => btn.setButtonText("\u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0438\u0442\u044C").onClick(async () => {
        await this.plugin.removeApiKey();
        statusText.textContent = "\u26D4 \u041A\u043B\u044E\u0447 \u043D\u0435 \u0437\u0430\u0434\u0430\u043D";
      })
    );
    new import_obsidian.Setting(containerEl).setName("API Base URL").setDesc("\u0411\u0430\u0437\u043E\u0432\u044B\u0439 URL API Singularity").addText(
      (text) => text.setPlaceholder("https://api.singularity-app.com/v2").setValue(this.plugin.settings.singularityApiBaseUrl).onChange(async (val) => {
        this.plugin.settings.singularityApiBaseUrl = val;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "\u{1F4DD} Obsidian" });
    new import_obsidian.Setting(containerEl).setName("\u0424\u0430\u0439\u043B \u0437\u0430\u0434\u0430\u0447").setDesc("\u041F\u0443\u0442\u044C \u043A \u0444\u0430\u0439\u043B\u0443 \u0437\u0430\u0434\u0430\u0447 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430").addText(
      (text) => text.setPlaceholder("/tasks/tasks.md").setValue(this.plugin.settings.obsidianTasksFile).onChange(async (val) => {
        this.plugin.settings.obsidianTasksFile = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041F\u0430\u043F\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").setDesc("\u041F\u0443\u0442\u044C \u043A \u043F\u0430\u043F\u043A\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").addText(
      (text) => text.setPlaceholder("/project").setValue(this.plugin.settings.obsidianProjectsFolder).onChange(async (val) => {
        this.plugin.settings.obsidianProjectsFolder = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041C\u0430\u0440\u043A\u0435\u0440 \u0441\u0435\u043A\u0446\u0438\u0438 \u0437\u0430\u0434\u0430\u0447").setDesc("\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A, \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0440\u0430\u0441\u043F\u043E\u043B\u0430\u0433\u0430\u044E\u0442\u0441\u044F \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u0444\u0430\u0439\u043B\u0430\u0445 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").addText(
      (text) => text.setPlaceholder("#### \u{1F4DD} Tasks").setValue(this.plugin.settings.tasksSectionMarker).onChange(async (val) => {
        this.plugin.settings.tasksSectionMarker = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0428\u0430\u0431\u043B\u043E\u043D \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430").setDesc("\u0428\u0430\u0431\u043B\u043E\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u0434\u043B\u044F \u043D\u043E\u0432\u044B\u0445 \u0444\u0430\u0439\u043B\u043E\u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432. Placeholders: {{title}}, {{singularityId}}, {{date}}, {{emoji}}. \u041E\u0441\u0442\u0430\u0432\u044C \u043F\u0443\u0441\u0442\u044B\u043C \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u0442\u043E\u0433\u043E \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E.").addTextArea(
      (text) => text.setPlaceholder("\u041E\u0441\u0442\u0430\u0432\u044C \u043F\u0443\u0441\u0442\u044B\u043C \u0434\u043B\u044F \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E").setValue(this.plugin.settings.projectTemplate).onChange(async (val) => {
        this.plugin.settings.projectTemplate = val;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "\u{1F504} \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F" });
    new import_obsidian.Setting(containerEl).setName("\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435").setDesc("\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438").addDropdown(
      (dd) => dd.addOption("both", "\u0414\u0432\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u044F\u044F").addOption("forward", "Obsidian \u2192 Singularity").addOption("reverse", "Singularity \u2192 Obsidian").setValue(this.plugin.settings.syncDirection).onChange(async (val) => {
        this.plugin.settings.syncDirection = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432").setDesc("\u041A\u0430\u043A \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u0432 \u043E\u0431\u0435\u0438\u0445 \u0441\u0438\u0441\u0442\u0435\u043C\u0430\u0445").addDropdown(
      (dd) => dd.addOption("latest_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435").addOption("obsidian_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 Obsidian").addOption("singularity_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 Singularity").addOption("manual", "\u0420\u0443\u0447\u043D\u043E\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435").setValue(this.plugin.settings.syncConflictResolution).onChange(async (val) => {
        this.plugin.settings.syncConflictResolution = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0418\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u0435\u0433\u0438").setDesc("\u0422\u0435\u0433\u0438 \u0434\u043B\u044F \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0438\u0437 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)").addText(
      (text) => text.setPlaceholder("GC,nd").setValue(this.plugin.settings.syncExcludeTags).onChange(async (val) => {
        this.plugin.settings.syncExcludeTags = val;
        await this.plugin.saveSettings();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Dry Run").setDesc("\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0440\u0435\u0436\u0438\u043C \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.syncDryRun).onChange(async (val) => {
        this.plugin.settings.syncDryRun = val;
        await this.plugin.saveSettings();
      })
    );
    containerEl.createEl("h3", { text: "\u25B6\uFE0F \u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F" });
    new import_obsidian.Setting(containerEl).setName("\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E").setDesc("\u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E \u0441 \u0442\u0435\u043A\u0443\u0449\u0438\u043C\u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C\u0438").addButton(
      (btn) => btn.setButtonText("\u{1F504} Sync Now").onClick(() => {
        this.plugin.runSync();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435").setDesc("\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C API \u043A\u043B\u044E\u0447 \u0438 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \u0441 Singularity").addButton(
      (btn) => btn.setButtonText("\u2705 Validate").onClick(() => {
        this.plugin.validate();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438").setDesc("\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0411\u0414 \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0447\u0438\u0441\u0442\u0443\u044E \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044E Obsidian \u2192 Singularity").addButton(
      (btn) => btn.setButtonText("\u{1F5D1}\uFE0F Reset & Sync").setWarning().onClick(() => {
        this.plugin.resetAndSync();
      })
    );
  }
};

// src/adapters/singularity/api-client.ts
var import_obsidian2 = require("obsidian");
var SingularityAPIError = class extends Error {
  constructor(statusCode, message, response) {
    super(`Singularity API Error ${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.response = response;
    this.name = "SingularityAPIError";
  }
};
var SingularityAPIClient = class {
  constructor(config) {
    this._tagsCache = {};
    this._tagsLoaded = false;
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.headers = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json"
    };
  }
  async _req(opts) {
    const url = opts.params ? (() => {
      const u = new URL(`${this.baseUrl}${opts.path}`);
      for (const [k, v] of Object.entries(opts.params)) if (v !== void 0) u.searchParams.set(k, String(v));
      return u.toString();
    })() : `${this.baseUrl}${opts.path}`;
    const hasBody = opts.body !== void 0 && opts.body !== null;
    const req = { url, method: opts.method || "GET", headers: this.headers };
    if (hasBody) {
      req.body = typeof opts.body === "string" ? opts.body : JSON.stringify(opts.body);
      req.contentType = "application/json";
    }
    try {
      const resp = await (0, import_obsidian2.requestUrl)(req);
      if (resp.status >= 400) {
        const detail = resp.json?.message || resp.json?.error || resp.text;
        const msg = typeof detail === "string" ? detail : JSON.stringify(detail);
        console.error(`[Singularity API] ${opts.method || "GET"} ${opts.path} \u2192 ${resp.status}`, {
          requestBody: opts.body,
          response: msg
        });
        new import_obsidian2.Notice(`\u26A0\uFE0F API ${resp.status}: ${opts.method || "GET"} ${opts.path} \u2014 ${msg.slice(0, 120)}`, 8e3);
        throw new SingularityAPIError(resp.status, msg);
      }
      return resp.json;
    } catch (e) {
      if (e instanceof SingularityAPIError) throw e;
      const match = e.message?.match(/(\d{3})/);
      const statusCode = match ? parseInt(match[1]) : 0;
      console.error(`[Singularity API] ${opts.method || "GET"} ${opts.path} \u2192 ${statusCode}`, {
        requestBody: opts.body,
        error: e.message,
        response: e.response?.body
      });
      const msg = e.response?.body || e.message || String(e);
      new import_obsidian2.Notice(`\u26A0\uFE0F API ${statusCode}: ${opts.method || "GET"} ${opts.path} \u2014 ${msg.slice(0, 120)}`, 8e3);
      throw new SingularityAPIError(statusCode, msg);
    }
  }
  get(path, params) {
    return this._req({ path, params });
  }
  post(path, body) {
    return this._req({ path, method: "POST", body });
  }
  patch(path, body) {
    return this._req({ path, method: "PATCH", body });
  }
  async validateToken() {
    try {
      await this.get("/project", { maxCount: 1 });
      return true;
    } catch {
      return false;
    }
  }
  async getProjects(includeRemoved = false, includeArchived = false, maxCount = 100) {
    const data = await this.get("/project", { includeRemoved, includeArchived, maxCount });
    return data.projects ?? [];
  }
  async getTasks(includeRemoved = false, includeArchived = false, maxCount = 1e3, projectId) {
    const params = { includeRemoved, includeArchived, maxCount };
    if (projectId) params.projectId = projectId;
    const data = await this.get("/task", params);
    return data.tasks ?? [];
  }
  async getTaskById(taskId) {
    try {
      return await this.get(`/task/${taskId}`);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async createTask(task) {
    const body = {
      title: task.title,
      state: 1,
      checked: task.checked ?? 0,
      priority: task.priority ?? 1
    };
    if (task.note) body.note = task.note;
    if (task.projectId) body.projectId = task.projectId;
    if (task.start) body.start = task.start;
    if (task.deadline) body.deadline = task.deadline;
    if (task.externalId) body.externalId = task.externalId;
    if (task.tags?.length) body.tags = task.tags;
    if (task.useTime) body.useTime = true;
    if (task.notifies?.length) body.notifies = task.notifies;
    if (task.journalDate) body.journalDate = task.journalDate;
    if (task.deleteDate) body.deleteDate = task.deleteDate;
    return this.post("/task", body);
  }
  async updateTask(taskId, task) {
    const body = {};
    if (task.title !== void 0) body.title = task.title;
    if (task.note !== void 0) body.note = task.note;
    if (task.priority !== void 0) body.priority = task.priority;
    if (task.checked !== void 0) body.checked = task.checked;
    if (task.start !== void 0) body.start = task.start;
    if (task.deadline !== void 0) body.deadline = task.deadline;
    if (task.projectId !== void 0) body.projectId = task.projectId;
    if (task.tags !== void 0) body.tags = task.tags;
    if (task.useTime !== void 0) body.useTime = task.useTime;
    if (task.notifies !== void 0) body.notifies = task.notifies;
    if (task.journalDate !== void 0) body.journalDate = task.journalDate;
    if (task.deleteDate !== void 0) body.deleteDate = task.deleteDate;
    if (task.externalId !== void 0) body.externalId = task.externalId;
    if (Object.keys(body).length === 0) throw new SingularityAPIError(400, "No fields to update");
    return this.patch(`/task/${taskId}`, body);
  }
  async archiveTask(taskId, archiveDate) {
    try {
      const date = archiveDate ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return this.patch(`/task/${taskId}`, { journalDate: date });
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async softDeleteTask(taskId, deleteDate) {
    try {
      const date = deleteDate ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return this.patch(`/task/${taskId}`, { deleteDate: date });
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async deleteProject(projectId) {
    try {
      return this.patch(`/project/${projectId}`, { removed: true });
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async getTags(maxCount = 100, includeRemoved = false) {
    const data = await this.get("/tag", { maxCount, includeRemoved });
    return data.tags ?? [];
  }
  async createTag(title) {
    return this.post("/tag", { title });
  }
  async getOrCreateTag(title) {
    const lower = title.toLowerCase();
    if (this._tagsLoaded && lower in this._tagsCache) {
      return this._tagsCache[lower];
    }
    if (!this._tagsLoaded) {
      const tags = await this.getTags(500);
      for (const t of tags) {
        const tagTitle = (t.title ?? "").toLowerCase();
        if (tagTitle && t.id) this._tagsCache[tagTitle] = t.id;
      }
      this._tagsLoaded = true;
      if (lower in this._tagsCache) return this._tagsCache[lower];
    }
    try {
      const result = await this.createTag(title);
      const tagId = result.id;
      if (tagId) this._tagsCache[lower] = tagId;
      return tagId ?? null;
    } catch {
      return null;
    }
  }
  async getProjectById(projectId) {
    try {
      return await this.get(`/project/${projectId}`);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async createProject(title, emoji) {
    const body = { title };
    if (emoji) body.emoji = emoji;
    return this.post("/project", body);
  }
  async updateProject(projectId, data) {
    return this.patch(`/project/${projectId}`, data);
  }
  async getHabits(maxCount = 100) {
    const data = await this.get("/habit", { maxCount });
    return data.habits ?? [];
  }
  async getHabitProgress(habitId) {
    try {
      const data = await this.get("/habit-progress", { maxCount: 500 });
      const list = Array.isArray(data) ? data : data.progressRecords ?? data.progress ?? [];
      return list.filter((p) => p.habit === habitId);
    } catch {
      return [];
    }
  }
  async setHabitProgress(habitId, date, progress) {
    const body = { habit: habitId, date, progress };
    try {
      await this.post("/habit-progress", body);
    } catch (e) {
      if (e.statusCode === 409) {
        const dateKey = date.replace(/-/g, "");
        await this.patch(`/habit-progress/HDP-${habitId}-${dateKey}`, { progress });
      } else if (e.statusCode === 404) {
        throw new Error("API-\u043A\u043B\u044E\u0447 \u043D\u0435 \u0438\u043C\u0435\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0430\u043C\u0438. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0442\u043E\u043A\u0435\u043D \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435 Singularity.");
      } else {
        throw e;
      }
    }
  }
};

// src/ui/singularity-view.ts
var import_obsidian3 = require("obsidian");
var SINGULARITY_VIEW_TYPE = "singularity-tasks-view";
var DAY_MS = 864e5;
function fmtLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
var WEEKDAYS = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];
var COLORS = {
  red: "#f44336",
  pink: "#e91e63",
  purple: "#9c27b0",
  deepPurple: "#673ab7",
  indigo: "#3f51b5",
  lightBlue: "#03a9f4",
  cyan: "#00bcd4",
  teal: "#009688",
  green: "#4caf50",
  lightGreen: "#8bc34a",
  lime: "#cddc39",
  yellow: "#ffeb3b",
  amber: "#ffc107",
  orange: "#ff9800",
  deepOrange: "#ff5722",
  brown: "#795548",
  grey: "#9e9e9e",
  blueGrey: "#607d8b"
};
var SingularityTaskView = class extends import_obsidian3.ItemView {
  constructor(leaf) {
    super(leaf);
    this.apiClient = null;
    this.tasks = [];
    this.projects = [];
    this.habits = [];
    this.habitsProgress = {};
    // habitId → date → progress (1/2)
    this.activeTab = "tasks";
    this.taskExcludeTags = "";
    this.selectedProject = "";
    this.onStateChange = null;
    this.onTaskCheck = null;
  }
  setStateChangeCallback(cb) {
    this.onStateChange = cb;
  }
  setTaskCheckCallback(cb) {
    this.onTaskCheck = cb;
  }
  loadState(state) {
    this.habitsProgress = state;
  }
  getState() {
    return this.habitsProgress;
  }
  getViewType() {
    return SINGULARITY_VIEW_TYPE;
  }
  getDisplayText() {
    return "Singularity";
  }
  getIcon() {
    return "list-checks";
  }
  async setApiClient(client) {
    this.apiClient = client;
    await this.refresh();
  }
  async refresh() {
    if (!this.apiClient) return;
    try {
      this.projects = await this.apiClient.getProjects(false, false, 50);
      this.tasks = await this.apiClient.getTasks(false, false, 200);
    } catch (e) {
      this.contentEl.empty();
      this.contentEl.createEl("p", { text: `\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0434\u0430\u0447: ${e.message}`, cls: "singularity-view-error" });
      return;
    }
    try {
      this.habits = await this.apiClient.getHabits(100);
    } catch {
      this.habits = [];
    }
    await this.loadHabitProgress();
    this.render();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    const header = contentEl.createDiv("singularity-view-header");
    header.createEl("h3", { text: "Singularity" });
    const tabs = contentEl.createDiv("singularity-view-tabs");
    const tasksTab = tabs.createEl("span", { text: "\u{1F4CB} \u0417\u0430\u0434\u0430\u0447\u0438", cls: "singularity-view-tab" });
    const habitsTab = tabs.createEl("span", { text: "\u2705 \u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438", cls: "singularity-view-tab" });
    if (this.activeTab === "tasks") tasksTab.addClass("active");
    else habitsTab.addClass("active");
    tasksTab.onclick = () => {
      this.activeTab = "tasks";
      this.render();
    };
    habitsTab.onclick = () => {
      this.activeTab = "habits";
      this.render();
    };
    if (this.activeTab === "tasks") this.renderTasks(contentEl);
    else this.renderHabits(contentEl);
  }
  // =========== TASKS ===========
  renderTasks(container) {
    const excludeDiv = container.createDiv("singularity-view-exclude");
    excludeDiv.createEl("label", { text: "\u0418\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u0435\u0433\u0438:" });
    const excludeInput = excludeDiv.createEl("input", { type: "text", cls: "singularity-view-exclude-input" });
    excludeInput.value = this.taskExcludeTags;
    excludeInput.placeholder = "GC, nd";
    excludeInput.oninput = () => {
      this.taskExcludeTags = excludeInput.value;
    };
    const excludedList = this.taskExcludeTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    const filter = container.createEl("select", "singularity-view-filter");
    filter.createEl("option", { text: "\u0412\u0441\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u044B", value: "" });
    const projMap = {};
    for (const p of this.projects) {
      const name = p.title || p.id || "\u2014";
      projMap[p.id] = name;
      filter.createEl("option", { text: name, value: p.id });
    }
    filter.value = this.selectedProject;
    filter.onchange = () => {
      this.selectedProject = filter.value;
      this.render();
    };
    let filtered = this.selectedProject ? this.tasks.filter((t) => t.projectId === this.selectedProject) : this.tasks;
    filtered = filtered.filter((t) => !t.recurrence);
    if (excludedList.length > 0) {
      filtered = filtered.filter((t) => {
        const tagIds = t.tags ?? [];
        const tagNames = tagIds.map((id) => id.replace(/^A-/, "").toLowerCase());
        return !excludedList.some((ex) => tagNames.includes(ex));
      });
    }
    const list = container.createDiv("singularity-view-list");
    if (filtered.length === 0) {
      list.createEl("p", { text: "\u2705 \u041D\u0435\u0442 \u0437\u0430\u0434\u0430\u0447", cls: "singularity-view-empty" });
      return;
    }
    const grouped = {};
    for (const task of filtered) {
      const proj = task.projectId || "__no_project";
      if (!grouped[proj]) grouped[proj] = [];
      grouped[proj].push(task);
    }
    for (const [projId, tasks] of Object.entries(grouped)) {
      const projName = projId === "__no_project" ? "\u{1F4E5} \u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435" : projMap[projId] || projId;
      const groupEl = list.createDiv("singularity-view-group");
      groupEl.createEl("h4", { text: projName });
      for (const task of tasks) {
        const item = groupEl.createDiv("singularity-view-task");
        const done = task.checked === 1;
        const cb = item.createEl("input", { type: "checkbox" });
        cb.checked = done;
        cb.onclick = async () => {
          if (this.apiClient) {
            await this.apiClient.updateTask(task.id, { checked: cb.checked ? 1 : 0 });
            if (this.onTaskCheck) await this.onTaskCheck(task.id, cb.checked, task.title || "");
            new import_obsidian3.Notice(cb.checked ? "\u2705 \u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E" : "\u21A9\uFE0F \u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u043E");
            await this.refresh();
          }
        };
        item.createSpan({ text: task.title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)", cls: done ? "singularity-view-task-done" : "" });
        if (task.deadline) {
          const dl = task.deadline.includes("T") ? fmtLocal(new Date(task.deadline)) : task.deadline;
          item.createSpan({ text: ` \u{1F4C5} ${dl}`, cls: "singularity-view-task-date" });
        }
      }
    }
  }
  // =========== HABITS ===========
  async loadHabitProgress() {
    if (!this.apiClient) return;
    try {
      const data = await this.apiClient.get("/habit-progress", { maxCount: 500 });
      const list = Array.isArray(data) ? data : data.progressRecords ?? data.progress ?? [];
      for (const p of list) {
        const hid = p.habit;
        const val = p.progress ?? 0;
        if (!this.habitsProgress[hid]) this.habitsProgress[hid] = {};
        this.habitsProgress[hid][p.date] = val;
      }
    } catch {
    }
    if (this.onStateChange) this.onStateChange();
  }
  renderHabits(container) {
    if (this.habits.length === 0) {
      container.createEl("p", { text: "\u2705 \u041D\u0435\u0442 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A", cls: "singularity-view-empty" });
      return;
    }
    const today = /* @__PURE__ */ new Date();
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY_MS);
      days.push({
        date: fmtLocal(d),
        dow: WEEKDAYS[d.getDay()],
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }
    const wrapper = container.createDiv("singularity-habits-wrapper");
    const scrollEl = wrapper.createDiv("singularity-habits-scroll");
    const headerRow = scrollEl.createDiv("singularity-habits-row");
    headerRow.createSpan({ text: "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0430", cls: "singularity-habits-label" });
    for (const day of days) {
      const dayNum = parseInt(day.date.split("-")[2], 10);
      const cell = headerRow.createSpan({
        text: `${dayNum}
${day.dow}`,
        cls: `singularity-habits-day-header${day.isWeekend ? " singularity-habits-weekend" : ""}`
      });
    }
    for (const habit of this.habits) {
      const row = scrollEl.createDiv("singularity-habits-row");
      const labelCell = row.createDiv("singularity-habits-label");
      const color = COLORS[habit.color] || habit.color || "#888";
      labelCell.setAttr("style", `border-left:3px solid ${color};padding-left:6px`);
      labelCell.createSpan({ text: habit.title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)" });
      const progress = this.habitsProgress[habit.id] || {};
      for (const day of days) {
        const status = progress[day.date] || 0;
        const cellCls = status === 2 ? "singularity-habits-cell singularity-habits-cell-full" : status === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
        const cell = row.createDiv({ cls: cellCls });
        if (status === 2) cell.setAttr("style", `background:${color}`);
        else if (status === 1) cell.setAttr("style", `background:${color}55`);
        cell.setAttr("data-habit-id", habit.id);
        cell.setAttr("data-date", day.date);
        cell.onclick = async () => {
          if (!this.apiClient) return;
          const hid = habit.id;
          const date = day.date;
          const cur = progress[date] || 0;
          const next = cur === 0 ? 2 : cur === 2 ? 1 : 0;
          if (!this.habitsProgress[hid]) this.habitsProgress[hid] = {};
          this.habitsProgress[hid][date] = next;
          cell.className = next === 2 ? "singularity-habits-cell singularity-habits-cell-full" : next === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
          if (next === 2) cell.setAttr("style", `background:${color}`);
          else if (next === 1) cell.setAttr("style", `background:${color}55`);
          else cell.setAttr("style", "");
          try {
            await this.apiClient.setHabitProgress(hid, date, next);
            if (this.onStateChange) this.onStateChange();
          } catch (e) {
            this.habitsProgress[hid][date] = cur;
            cell.className = cur === 2 ? "singularity-habits-cell singularity-habits-cell-full" : cur === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
            if (cur === 2) cell.setAttr("style", `background:${color}`);
            else if (cur === 1) cell.setAttr("style", `background:${color}55`);
            else cell.setAttr("style", "");
            new import_obsidian3.Notice(`\u274C ${e.message}`, 3e3);
          }
        };
      }
    }
  }
};

// src/adapters/obsidian/vault-reader.ts
var import_obsidian4 = require("obsidian");

// src/domain/utils/date-parser.ts
var EMOJI_DATE_PATTERNS = {
  due: /\u{1F4C5}\s*(\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?)/u,
  scheduled: /\u23F3\s*(\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?)/u,
  start: /\u{1F6EB}\s*(\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?)/u,
  created: /\u2795\s*(\d{4}-\d{2}-\d{2})/u,
  done: /\u2705\s*(\d{4}-\d{2}-\d{2})/u,
  cancelled: /\u274C\s*(\d{4}-\d{2}-\d{2})/u
};
function parseEmojiDates(text) {
  const result = {
    due: null,
    scheduled: null,
    start: null,
    created: null,
    done: null,
    cancelled: null
  };
  for (const [field, pattern] of Object.entries(EMOJI_DATE_PATTERNS)) {
    const match = text.match(pattern);
    result[field] = match ? match[1] : null;
  }
  return result;
}
function removeEmojiDates(text) {
  let result = text;
  for (const pattern of Object.values(EMOJI_DATE_PATTERNS)) {
    result = result.replace(pattern, "");
  }
  return result.replace(/\s+/g, " ").trim();
}

// src/domain/utils/tag-extractor.ts
var TAG_RE = /#([a-zA-Zа-яА-ЯёЁ0-9_/-]+)/g;
var TODO_TAG_RE = /#todo\b/i;
var NOTIFY_SINGLE_RE = /#notify(?:\/(\d+)([dhm])?)?/gi;
function extractTags(text) {
  const matches = text.matchAll(TAG_RE);
  return Array.from(matches, (m) => m[1]);
}
function hasTodoTag(text) {
  return TODO_TAG_RE.test(text);
}
function extractProjectTag(tags, projectName) {
  if (projectName) return projectName;
  return null;
}
function notifyToMinutes(value, unit) {
  switch (unit) {
    case "d":
      return value * 1440;
    case "h":
      return value * 60;
    case "m":
      return value;
    default:
      return value;
  }
}
function extractNotifyMinutes(text) {
  const matches = text.matchAll(NOTIFY_SINGLE_RE);
  const minutes = [];
  for (const m of matches) {
    if (m[1] !== void 0) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n)) minutes.push(notifyToMinutes(n, m[2]));
    } else {
      minutes.push(0);
    }
  }
  return minutes.sort((a, b) => b - a);
}

// src/domain/parser.ts
var TASK_LINE_RE = /^\s*-\s*\[(?<status>[ x-])\]\s*(?<content>.+)$/;
var PRIORITY_RE = /[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]/u;
var PRIORITY_MAP = {
  "\u{1F53A}": "high" /* High */,
  "\u23EB": "high" /* High */,
  "\u{1F53C}": "medium" /* Medium */,
  "\u{1F53D}": "low" /* Low */,
  "\u23EC": "lowest" /* Lowest */
};
function generateTaskId(filePath, _lineNumber, content) {
  let desc = content.replace(/[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]/gu, "").replace(/[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C]\s*\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?/gu, "").replace(/#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g, "").replace(/-\s*\[\s*[ x-]\s*\]\s*#todo\s*/g, "").replace(/\s+/g, " ").trim();
  const key = `${filePath}:${desc}`;
  return simpleHash(key);
}
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
function parsePriority(text) {
  const match = text.match(PRIORITY_RE);
  if (match) {
    return PRIORITY_MAP[match[0]] ?? null;
  }
  return null;
}
function parseTaskLine(line, filePath, lineNumber, projectName) {
  const m = line.match(TASK_LINE_RE);
  if (!m || !m.groups) return null;
  const content = m.groups.content;
  if (!hasTodoTag(content)) return null;
  const allTags = extractTags(content);
  const projectTag = extractProjectTag(allTags, projectName ?? void 0);
  const dates = parseEmojiDates(content);
  const priority = parsePriority(content);
  let description = removeEmojiDates(content);
  description = description.replace(/[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]/gu, "").trim();
  description = description.replace(/#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g, "").trim();
  const statusChar = m.groups.status;
  const status = statusChar === "-" ? "cancelled" /* Cancelled */ : statusChar === "x" ? "done" /* Done */ : "todo" /* Todo */;
  const taskId = generateTaskId(filePath, lineNumber, content);
  const syncContent = [
    description,
    statusChar,
    priority?.toString() ?? "none",
    dates.due ?? "",
    dates.scheduled ?? "",
    dates.start ?? "",
    dates.created ?? "",
    dates.done ?? "",
    dates.cancelled ?? "",
    [...allTags].sort().join(","),
    projectTag ?? ""
  ].join("|");
  const syncHash = simpleHash(syncContent);
  return {
    id: taskId,
    description,
    status,
    filePath,
    lineNumber,
    tags: allTags,
    projectTag,
    dueDate: dates.due,
    scheduledDate: dates.scheduled,
    startDate: dates.start,
    createdDate: dates.created,
    doneDate: dates.done,
    cancelledDate: dates.cancelled,
    priority,
    lastSyncedAt: null,
    syncHash
  };
}

// src/adapters/obsidian/vault-reader.ts
function parseFrontmatterId(content) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const idMatch = fmMatch[1].match(/singularity-id:\s*["']?([^"'\s]+)["']?\s*$/m);
  return idMatch ? idMatch[1].trim() : null;
}
var ObsidianVaultReader = class {
  constructor(vault, tasksSectionMarker) {
    this.vault = vault;
    this.tasksSectionMarker = tasksSectionMarker;
  }
  async readTasksFile(tasksFile) {
    const relPath = tasksFile.replace(/^\/+/, "");
    const file = this.vault.getAbstractFileByPath(relPath);
    if (!file || !(file instanceof import_obsidian4.TFile)) return [];
    const content = await this.vault.read(file);
    const lines = content.split("\n");
    const tasks = [];
    for (let i = 0; i < lines.length; i++) {
      const task = parseTaskLine(lines[i], tasksFile, i + 1);
      if (task) tasks.push(task);
    }
    return tasks;
  }
  async readProjectFiles(projectsFolder) {
    const relPath = projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(relPath);
    if (!folder || !("children" in folder)) return [];
    const marker = this.tasksSectionMarker;
    const tasks = [];
    for (const child of folder.children) {
      if (child instanceof import_obsidian4.TFile && child.extension === "md") {
        const relativePath = `${projectsFolder}/${child.name}`;
        const projectName = child.name.replace(/\.md$/, "");
        const content = await this.vault.read(child);
        const lines = content.split("\n");
        const markerIdx = lines.findIndex((l) => l.trim() === marker);
        if (markerIdx === -1) continue;
        let inSection = false;
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === marker) {
            inSection = true;
            continue;
          }
          if (inSection) {
            const trimmed = lines[i].trim();
            if (trimmed.startsWith("#") && trimmed !== marker) break;
            const task = parseTaskLine(lines[i], relativePath, i + 1, projectName);
            if (task) tasks.push(task);
          }
        }
      }
    }
    return tasks;
  }
  async readAllTasks(tasksFile = "/tasks/tasks.md", projectsFolder = "/project") {
    const fromFile = await this.readTasksFile(tasksFile);
    const fromProjects = await this.readProjectFiles(projectsFolder);
    return [...fromFile, ...fromProjects];
  }
  async getFileMtime(filePath) {
    const relPath = filePath.replace(/^\/+/, "");
    const file = this.vault.getAbstractFileByPath(relPath);
    if (file instanceof import_obsidian4.TFile) {
      return new Date(file.stat.mtime).toISOString();
    }
    return null;
  }
  async getProjectFilesMap(projectsFolder) {
    const map = /* @__PURE__ */ new Map();
    const relPath = projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(relPath);
    if (!folder || !("children" in folder)) return map;
    for (const child of folder.children) {
      if (child instanceof import_obsidian4.TFile && child.extension === "md") {
        const name = child.name.replace(/\.md$/, "");
        const content = await this.vault.read(child);
        const sgId = parseFrontmatterId(content);
        map.set(name.toLowerCase(), { file: child, sgId });
      }
    }
    return map;
  }
};

// src/adapters/obsidian/vault-writer.ts
var import_obsidian5 = require("obsidian");
var EMOJI_PRIORITY = {
  highest: "\u{1F53A}",
  high: "\u{1F53A}",
  medium: "\u{1F53C}",
  low: "\u{1F53D}",
  lowest: "\u23EC"
};
function formatDateForObsidian(dateValue) {
  if (!dateValue) return "";
  if (dateValue.includes("T") && dateValue.includes(":")) {
    const dt = new Date(dateValue);
    if (dt.getHours() === 0 && dt.getMinutes() === 0) {
      return dt.toISOString().split("T")[0];
    }
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    const h = String(dt.getHours()).padStart(2, "0");
    const min = String(dt.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${d} ${h}:${min}`;
  }
  if (dateValue.includes(" ") && dateValue.includes(":")) {
    return dateValue;
  }
  return dateValue.split(" ")[0];
}
function formatTaskLine(task) {
  const statusChar = task.status === "cancelled" /* Cancelled */ ? "-" : task.status === "done" /* Done */ ? "x" : " ";
  const regularTags = task.tags.filter((t) => {
    const lower = t.toLowerCase();
    if (lower === "todo") return false;
    if (lower.startsWith("notify")) return false;
    return true;
  }).map((t) => `#${t}`).join(" ");
  const notifyTags = task.tags.filter((t) => t.toLowerCase().startsWith("notify")).map((t) => `#${t}`).join(" ");
  let priorityEmoji = "";
  if (task.priority) {
    priorityEmoji = EMOJI_PRIORITY[task.priority.toLowerCase()] ?? "";
  }
  const emojis = [];
  if (task.createdDate) {
    emojis.push(`\u2795 ${task.createdDate.split("T")[0]}`);
  }
  if (task.startDate) {
    emojis.push(`\u{1F6EB} ${formatDateForObsidian(task.startDate).split(" ")[0]}`);
  }
  if (task.scheduledDate) {
    emojis.push(`\u23F3 ${formatDateForObsidian(task.scheduledDate)}`);
  }
  if (task.dueDate) {
    emojis.push(`\u{1F4C5} ${formatDateForObsidian(task.dueDate).split(" ")[0]}`);
  }
  if (task.doneDate) {
    emojis.push(`\u2705 ${task.doneDate.split("T")[0]}`);
  }
  if (task.cancelledDate && /^\d{4}-\d{2}-\d{2}/.test(task.cancelledDate)) {
    emojis.push(`\u274C ${task.cancelledDate.split("T")[0]}`);
  }
  let line = `- [${statusChar}] #todo ${task.description}`;
  if (regularTags) line += ` ${regularTags}`;
  if (emojis.length) line += ` ${emojis.join(" ")}`;
  if (priorityEmoji) line += ` ${priorityEmoji}`;
  if (notifyTags) line += ` ${notifyTags}`;
  return line;
}
var ObsidianVaultWriter = class {
  constructor(vault, tasksSectionMarker) {
    this.vault = vault;
    this.tasksSectionMarker = tasksSectionMarker;
  }
  async ensureFile(path) {
    const relPath = path.replace(/^\/+/, "");
    let file = this.vault.getAbstractFileByPath(relPath);
    if (file instanceof import_obsidian5.TFile) return file;
    const dir = relPath.substring(0, relPath.lastIndexOf("/"));
    await this.vault.createFolder(dir).catch(() => {
    });
    return await this.vault.create(relPath, "");
  }
  async writeTasksToFile(filePath, tasks) {
    const file = await this.ensureFile(filePath);
    const content = await this.vault.read(file);
    const lines = content.split("\n");
    const marker = this.tasksSectionMarker;
    const markerIdx = lines.findIndex((l) => l.trim() === marker);
    const taskLines = tasks.map((t) => formatTaskLine(t));
    if (markerIdx === -1) {
      const lastLine = lines[lines.length - 1];
      const needsBlank = lastLine !== "";
      lines.push(
        needsBlank ? `
${marker}
${taskLines.join("\n")}
` : `${marker}
${taskLines.join("\n")}
`
      );
    } else {
      let sectionEnd = lines.length;
      for (let i = markerIdx + 1; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("#") && trimmed !== marker) {
          sectionEnd = i;
          break;
        }
      }
      const before = lines.slice(0, markerIdx + 1);
      const after = lines.slice(sectionEnd);
      const newContent = [
        ...before,
        "",
        ...taskLines,
        "",
        ...after
      ].join("\n");
      await this.vault.modify(file, newContent);
      return;
    }
    await this.vault.modify(file, lines.join("\n"));
  }
  async hasTasksSection(filePath) {
    const relPath = filePath.replace(/^\/+/, "");
    const file = this.vault.getAbstractFileByPath(relPath);
    if (!(file instanceof import_obsidian5.TFile)) return false;
    const content = await this.vault.read(file);
    return content.split("\n").some((l) => l.trim() === this.tasksSectionMarker);
  }
  async addFrontmatterIfMissing(file, sgId) {
    const content = await this.vault.read(file);
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      if (fmMatch[1].includes("singularity-id:")) return;
      const newFm = fmMatch[1] + `
singularity-id: "${sgId}"`;
      const updated = content.replace(fmMatch[0], `---
${newFm}
---`);
      await this.vault.modify(file, updated);
    } else {
      const updated = `---
singularity-id: "${sgId}"
---
${content}`;
      await this.vault.modify(file, updated);
    }
  }
};

// src/adapters/db/task-store.ts
var TaskStore = class {
  constructor(saveFn) {
    this.data = [];
    this.dirty = false;
    this.saveFn = saveFn;
  }
  load(records) {
    this.data = records;
    this.dirty = false;
  }
  async markDirty() {
    this.dirty = true;
    await this.saveFn();
  }
  getAll() {
    return [...this.data];
  }
  getByObsidianId(id) {
    return this.data.find((r) => r.id === id);
  }
  getBySingularityId(sgId) {
    return this.data.find((r) => r.singularityTaskId === sgId);
  }
  getSynced() {
    return this.data.filter((r) => r.syncStatus === "synced");
  }
  getSyncedWithSingularity() {
    return this.data.filter(
      (r) => r.syncStatus === "synced" && r.singularityTaskId
    );
  }
  getPending(limit = 100) {
    return this.data.filter((r) => r.syncStatus === "pending").slice(0, limit);
  }
  async upsert(state) {
    const idx = this.data.findIndex((r) => r.id === state.id);
    if (idx >= 0) {
      this.data[idx] = state;
    } else {
      this.data.push(state);
    }
    await this.markDirty();
  }
  async markSynced(obsidianId, singularityId, obsidianDescription, obsidianContentHash, singularityEtag, singularityModDate) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const existing = this.getByObsidianId(obsidianId);
    if (existing) {
      existing.singularityTaskId = singularityId;
      existing.singularityEtag = singularityEtag ?? null;
      existing.lastSyncedAt = now;
      existing.lastModifiedSingularity = singularityModDate ?? now;
      existing.syncStatus = "synced";
      existing.updatedAt = now;
      if (obsidianDescription) existing.obsidianDescription = obsidianDescription;
      if (obsidianContentHash) existing.obsidianContentHash = obsidianContentHash;
    } else {
      this.data.push({
        id: obsidianId,
        obsidianFilePath: "",
        obsidianLineNumber: 0,
        obsidianContentHash: obsidianContentHash ?? "",
        obsidianDescription: obsidianDescription ?? "",
        singularityTaskId,
        singularityEtag: singularityEtag ?? null,
        lastSyncedAt: now,
        lastModifiedObsidian: null,
        lastModifiedSingularity: singularityModDate ?? now,
        syncStatus: "synced",
        errorMessage: null,
        createdAt: now,
        updatedAt: now
      });
    }
    await this.markDirty();
  }
  async markConflict(obsidianId, reason) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const r = this.getByObsidianId(obsidianId);
    if (r) {
      r.syncStatus = "conflict";
      r.errorMessage = reason;
      r.updatedAt = now;
      await this.markDirty();
    }
  }
  async markError(obsidianId, errorMessage) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const r = this.getByObsidianId(obsidianId);
    if (r) {
      r.syncStatus = "error";
      r.errorMessage = errorMessage;
      r.updatedAt = now;
      await this.markDirty();
    }
  }
  async deleteOrphanedRecords(obsidianIds, singularityIds) {
    const before = this.data.length;
    this.data = this.data.filter((r) => {
      if (r.errorMessage === "deleted_from_obsidian") return false;
      if (!obsidianIds.has(r.id) && !(r.singularityTaskId && singularityIds.has(r.singularityTaskId))) {
        return false;
      }
      return true;
    });
    const deleted = before - this.data.length;
    if (deleted > 0) await this.markDirty();
    return deleted;
  }
  async deleteById(id) {
    const idx = this.data.findIndex((r) => r.id === id);
    if (idx >= 0) {
      this.data.splice(idx, 1);
      await this.markDirty();
      return true;
    }
    return false;
  }
  async deleteAll() {
    this.data = [];
    await this.markDirty();
  }
};

// src/domain/mapper.ts
function mapPriorityToSingularity(priority) {
  if (priority == null || priority === "none" /* None */) return 1;
  switch (priority) {
    case "highest" /* Highest */:
    case "high" /* High */:
      return 0;
    case "medium" /* Medium */:
      return 1;
    case "low" /* Low */:
    case "lowest" /* Lowest */:
      return 2;
    default:
      return 1;
  }
}
function mapPriorityFromSingularity(priority) {
  if (priority == null) return null;
  const p = Number(priority);
  if (isNaN(p)) return null;
  switch (p) {
    case 0:
      return "high" /* High */;
    case 1:
      return "medium" /* Medium */;
    case 2:
      return "low" /* Low */;
    default:
      return null;
  }
}
function formatDateForApi(dateValue) {
  if (!dateValue) return null;
  if (dateValue.includes("T")) {
    if (!dateValue.endsWith("Z") && !dateValue.includes("+")) return dateValue + "Z";
    return dateValue;
  }
  if (dateValue.includes(" ") && dateValue.includes(":")) {
    const parts = dateValue.split(" ");
    const [y, m, d] = parts[0].split("-").map(Number);
    const [h, min] = parts[1].split(":").map(Number);
    const dt = new Date(y, m - 1, d, h, min);
    return dt.toISOString();
  }
  return dateValue;
}

// src/domain/conflict-resolver.ts
var ConflictResolutionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictResolutionError";
  }
};
function parseSgDate(value) {
  if (value == null) return null;
  const d = new Date(String(value));
  if (!isNaN(d.getTime())) return d;
  const num = Number(value);
  if (!isNaN(num)) {
    return new Date(num > 1e12 ? num : num * 1e3);
  }
  return null;
}
function hasConflict(obsidianTask, singularityTask, dbState) {
  const obsidianChanged = obsidianTask.syncHash != null && dbState.obsidianContentHash != null && obsidianTask.syncHash !== dbState.obsidianContentHash;
  let singularityChanged = false;
  const sgModDate = singularityTask["modificatedDate"];
  const sgDt = parseSgDate(sgModDate);
  const dbDt = parseSgDate(dbState.lastModifiedSingularity);
  if (sgDt && dbDt) {
    singularityChanged = sgDt > dbDt;
  }
  return obsidianChanged && singularityChanged;
}
function resolveConflict(obsidianTask, singularityTask, dbState, strategy, promptFn) {
  switch (strategy) {
    case "latest_wins" /* LatestWins */:
      return resolveLatestWins(obsidianTask, singularityTask, dbState);
    case "obsidian_wins" /* ObsidianWins */:
      return obsidianTask;
    case "singularity_wins" /* SingularityWins */:
      return null;
    case "manual" /* Manual */:
      return resolveManual(obsidianTask, singularityTask, dbState, promptFn);
    default:
      throw new ConflictResolutionError(`Unknown strategy: ${strategy}`);
  }
}
function resolveLatestWins(obsidianTask, singularityTask, dbState) {
  const obsidianModified = dbState.lastModifiedObsidian ?? dbState.lastSyncedAt;
  const sgTs = singularityTask["modificatedDate"];
  let sgModified = parseSgDate(sgTs);
  sgModified ??= parseSgDate(dbState.lastModifiedSingularity) ?? parseSgDate(dbState.lastSyncedAt);
  if (obsidianModified && sgModified) {
    return new Date(obsidianModified) > sgModified ? obsidianTask : null;
  }
  return obsidianTask;
}
function resolveManual(obsidianTask, singularityTask, _dbState, promptFn) {
  const fn = promptFn ?? (() => "K");
  const choice = fn("Choose [O]bsidian / [S]ingularity / [K]ip").toUpperCase();
  switch (choice) {
    case "O":
      return obsidianTask;
    case "S":
      return null;
    default:
      throw new ConflictResolutionError(
        `Conflict skipped for task ${obsidianTask.id}`
      );
  }
}

// src/orchestrators/forward-sync.ts
var import_obsidian6 = require("obsidian");
function extractNotifyFromTask(task) {
  return extractNotifyMinutes(
    task.tags.filter((t) => /^notify/i.test(t)).map((t) => `#${t}`).join(" ")
  );
}
function resolveStartDate(task) {
  if (task.scheduledDate) {
    const hasTime = task.scheduledDate.includes(" ") || task.scheduledDate.includes("T");
    return { start: formatDateForApi(task.scheduledDate), useTime: hasTime };
  }
  if (task.startDate) {
    return { start: formatDateForApi(task.startDate), useTime: false };
  }
  if (task.createdDate) {
    return { start: formatDateForApi(task.createdDate), useTime: false };
  }
  return { start: null, useTime: false };
}
var ForwardSyncOrchestrator = class {
  constructor(vaultReader, apiClient, taskStore, dryRun = false, conflictStrategy = "latest_wins" /* LatestWins */, conflictPromptFn) {
    this.vaultReader = vaultReader;
    this.apiClient = apiClient;
    this.taskStore = taskStore;
    this.dryRun = dryRun;
    this.conflictStrategy = conflictStrategy;
    this.conflictPromptFn = conflictPromptFn;
    this._projectsCache = {};
    this._sgTasksCache = [];
    this._createdIds = /* @__PURE__ */ new Set();
    this._failedIds = /* @__PURE__ */ new Set();
  }
  getVaultReader() {
    return this.vaultReader;
  }
  getApiClient() {
    return this.apiClient;
  }
  getTaskStore() {
    return this.taskStore;
  }
  getCreatedObsidianIds() {
    return new Set(this._createdIds);
  }
  getFailedObsidianIds() {
    return new Set(this._failedIds);
  }
  async sync(tasksFile, projectsFolder) {
    const stats = {
      obsidianTasks: 0,
      singularityTasks: 0,
      created: 0,
      updated: 0,
      archived: 0,
      deleted: 0,
      errors: 0,
      skipped: 0,
      dbCleaned: 0
    };
    const obsidianTasks = await this.vaultReader.readAllTasks(tasksFile, projectsFolder);
    stats.obsidianTasks = obsidianTasks.length;
    const currentIds = new Set(obsidianTasks.map((t) => t.id));
    await this.loadProjects();
    await this.loadSingularityTasks();
    this._failedIds = /* @__PURE__ */ new Set();
    for (const task of obsidianTasks) {
      try {
        const result = await this.syncTask(task);
        if (result === "created") stats.created++;
        else if (result === "updated") stats.updated++;
        else if (result === "archived") stats.archived++;
        else if (result === "deleted") stats.deleted++;
        else if (result === "skipped") stats.skipped++;
      } catch (e) {
        stats.errors++;
        this._failedIds.add(task.id);
        console.error(`[ForwardSync] task error:`, e?.message || e, `task:`, task.description);
      }
    }
    return stats;
  }
  normalizeForComparison(text) {
    if (!text) return "";
    return text.trim().toLowerCase().replace(/\s+/g, " ").replace(/<[^>]+>/g, "");
  }
  async syncTask(task) {
    if (task.status === "cancelled" /* Cancelled */) {
      for (const sgExisting of this._sgTasksCache) {
        if (sgExisting.externalId === task.id) {
          return this.updateExisting(task, sgExisting);
        }
      }
      const taskDescNorm2 = this.normalizeForComparison(task.description);
      for (const sgExisting of this._sgTasksCache) {
        const sgTitleNorm = this.normalizeForComparison(sgExisting.title ?? "");
        if (taskDescNorm2 && sgTitleNorm && taskDescNorm2 === sgTitleNorm) {
          return this.updateExisting(task, sgExisting);
        }
      }
      return this.createNewTask(task);
    }
    if (task.status === "done" /* Done */) {
      if (task.cancelledDate) {
        const state2 = this.taskStore.getByObsidianId(task.id);
        if (state2?.singularityTaskId) {
          const sgTask = await this.apiClient.getTaskById(state2.singularityTaskId);
          if (sgTask?.journalDate) return "skipped";
          if (sgTask?.checked === 2) return "skipped";
          return this.updateExisting(task, sgTask, 2);
        }
        const taskDescNorm2 = this.normalizeForComparison(task.description);
        for (const sgExisting of this._sgTasksCache) {
          if (sgExisting.checked === 2) continue;
          const sgTitleNorm = this.normalizeForComparison(sgExisting.title ?? "");
          if (taskDescNorm2 && sgTitleNorm && taskDescNorm2 === sgTitleNorm) {
            return this.updateExisting(task, sgExisting, 2);
          }
        }
        return this.createNewTask(task, 2);
      }
      const state = this.taskStore.getByObsidianId(task.id);
      if (state?.singularityTaskId) {
        const sgTask = await this.apiClient.getTaskById(state.singularityTaskId);
        if (sgTask?.journalDate) return "skipped";
        if (sgTask?.checked === 2) return "skipped";
        if (state.obsidianContentHash === task.syncHash && sgTask && (sgTask.checked ?? 0) !== 1) return "skipped";
      }
      if (!state?.singularityTaskId) {
        const taskDescNorm2 = this.normalizeForComparison(task.description);
        for (const sgExisting of this._sgTasksCache) {
          if (sgExisting.checked === 2) continue;
          const sgTitleNorm = this.normalizeForComparison(sgExisting.title ?? "");
          if (taskDescNorm2 && sgTitleNorm && taskDescNorm2 === sgTitleNorm) {
            return this.updateExisting(task, sgExisting);
          }
        }
      }
      return this.archiveCompletedTask(task);
    }
    for (const sgExisting of this._sgTasksCache) {
      if (sgExisting.externalId === task.id) {
        const state = this.taskStore.getByObsidianId(task.id);
        if (sgExisting.journalDate && state?.obsidianContentHash === task.syncHash) {
          return "skipped";
        }
        return this.updateExisting(task, sgExisting);
      }
    }
    const taskDescNorm = this.normalizeForComparison(task.description);
    let matchedCancelled = false;
    for (const sgExisting of this._sgTasksCache) {
      const sgTitle = sgExisting.title ?? "";
      const sgTitleNorm = this.normalizeForComparison(sgTitle);
      if (!taskDescNorm || !sgTitleNorm) continue;
      if (taskDescNorm === sgTitleNorm) {
        if (sgExisting.checked === 2) {
          matchedCancelled = true;
          continue;
        }
        return this.updateExisting(task, sgExisting);
      }
    }
    if (matchedCancelled) return "skipped";
    return this.createNewTask(task);
  }
  async resolveTags(task) {
    const tagIds = [];
    for (const tag of task.tags) {
      const lower = tag.toLowerCase();
      if (lower === "todo" || lower.startsWith("notify")) continue;
      const id = await this.apiClient.getOrCreateTag(tag);
      if (id) tagIds.push(id);
    }
    return tagIds;
  }
  async resolveProjectId(task) {
    if (!task.projectTag) return null;
    return this.findOrCreateProject(task.projectTag);
  }
  async updateExisting(task, sgExisting, overrideChecked) {
    const sgTaskId = sgExisting.id;
    if (!sgTaskId) return "skipped";
    const state = this.taskStore.getByObsidianId(task.id);
    if (state?.lastModifiedObsidian) {
      const currentMtime = await this.getFileMtime(task.filePath);
      if (currentMtime && state.lastModifiedObsidian === currentMtime) return "skipped";
    } else if (state?.obsidianContentHash === task.syncHash) {
      return "skipped";
    }
    if (state && sgExisting.modificatedDate) {
      const sgDt = parseSgDate(sgExisting.modificatedDate);
      const dbDt = parseSgDate(state.lastModifiedSingularity);
      const expectedChecked = task.status === "cancelled" /* Cancelled */ ? 2 : task.status === "done" /* Done */ ? 1 : 0;
      if (sgDt && dbDt && sgDt > dbDt && state.obsidianContentHash === task.syncHash && sgExisting.checked === expectedChecked) {
        this.taskStore.markSynced(task.id, sgTaskId, task.description, task.syncHash ?? "", null, sgExisting.modificatedDate);
        return "skipped";
      }
    }
    if (state && hasConflict(task, sgExisting, state)) {
      try {
        const resolved = resolveConflict(task, sgExisting, state, this.conflictStrategy, this.conflictPromptFn);
        if (resolved === null) {
          this.taskStore.markSynced(task.id, sgTaskId, task.description, task.syncHash ?? "", null, sgExisting.modificatedDate);
          return "skipped";
        }
      } catch (e) {
        if (e instanceof ConflictResolutionError) {
          new import_obsidian6.Notice(`\u26A0\uFE0F ${e.message}`);
          return "skipped";
        }
        throw e;
      }
    }
    const projectId = await this.resolveProjectId(task);
    const notifies = extractNotifyFromTask(task);
    const { start, useTime } = resolveStartDate(task);
    const tags = await this.resolveTags(task);
    const checked = overrideChecked ?? (task.status === "cancelled" /* Cancelled */ ? 2 : task.status === "done" /* Done */ ? 1 : 0);
    await this.apiClient.updateTask(sgTaskId, {
      title: task.description,
      start,
      deadline: formatDateForApi(task.dueDate),
      priority: task.priority != null ? mapPriorityToSingularity(task.priority) : sgExisting.priority ?? 1,
      checked,
      useTime,
      notifies: notifies.length ? notifies : void 0,
      tags: tags.length ? tags : void 0,
      projectId,
      externalId: task.id
    });
    const sgModDate = sgExisting.modificatedDate;
    const mtime = await this.getFileMtime(task.filePath);
    await this.taskStore.upsert({
      id: task.id,
      obsidianFilePath: task.filePath,
      obsidianLineNumber: task.lineNumber,
      obsidianContentHash: task.syncHash ?? task.id,
      obsidianDescription: task.description,
      singularityTaskId: sgTaskId,
      singularityEtag: null,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastModifiedObsidian: mtime,
      lastModifiedSingularity: sgModDate ?? null,
      syncStatus: "synced",
      errorMessage: null,
      createdAt: null,
      updatedAt: null
    });
    return "updated";
  }
  async createNewTask(task, overrideChecked) {
    if (this.dryRun) return "created";
    const projectId = await this.resolveProjectId(task);
    const notifies = extractNotifyFromTask(task);
    const { start, useTime } = resolveStartDate(task);
    const tags = await this.resolveTags(task);
    const checked = overrideChecked ?? (task.status === "cancelled" /* Cancelled */ ? 2 : task.status === "done" /* Done */ ? 1 : 0);
    const data = await this.apiClient.createTask({
      id: null,
      title: task.description,
      note: null,
      priority: mapPriorityToSingularity(task.priority),
      projectId,
      start,
      deadline: formatDateForApi(task.dueDate),
      createdDate: task.createdDate,
      journalDate: null,
      deleteDate: null,
      state: 1,
      checked,
      tags,
      externalId: task.id,
      useTime,
      notifies: notifies.length ? notifies : [],
      alarmNotify: false,
      notify: 1
    });
    const sgId = data.id;
    if (sgId) {
      this._createdIds.add(task.id);
      const mtime = await this.getFileMtime(task.filePath);
      await this.taskStore.upsert({
        id: task.id,
        obsidianFilePath: task.filePath,
        obsidianLineNumber: task.lineNumber,
        obsidianContentHash: task.syncHash ?? task.id,
        obsidianDescription: task.description,
        singularityTaskId: sgId,
        singularityEtag: null,
        lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
        lastModifiedObsidian: mtime,
        lastModifiedSingularity: data.modificatedDate ?? (/* @__PURE__ */ new Date()).toISOString(),
        syncStatus: "synced",
        errorMessage: null,
        createdAt: null,
        updatedAt: null
      });
    }
    return "created";
  }
  async archiveCompletedTask(task) {
    if (this.dryRun) return "archived";
    const state = this.taskStore.getByObsidianId(task.id);
    const projectId = await this.resolveProjectId(task);
    const notifies = extractNotifyFromTask(task);
    const { start, useTime } = resolveStartDate(task);
    const tags = await this.resolveTags(task);
    if (state?.singularityTaskId) {
      await this.apiClient.updateTask(state.singularityTaskId, {
        title: task.description,
        checked: 1,
        start,
        deadline: formatDateForApi(task.dueDate),
        priority: task.priority != null ? mapPriorityToSingularity(task.priority) : void 0,
        useTime,
        notifies: notifies.length ? notifies : void 0,
        tags: tags.length ? tags : void 0,
        projectId
      });
      await this.apiClient.archiveTask(state.singularityTaskId);
      const mtime = await this.getFileMtime(task.filePath);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await this.taskStore.upsert({
        id: task.id,
        obsidianFilePath: task.filePath,
        obsidianLineNumber: task.lineNumber,
        obsidianContentHash: task.syncHash ?? task.id,
        obsidianDescription: task.description,
        singularityTaskId: state.singularityTaskId,
        singularityEtag: null,
        lastSyncedAt: now,
        lastModifiedObsidian: mtime,
        lastModifiedSingularity: now,
        syncStatus: "synced",
        errorMessage: null,
        createdAt: null,
        updatedAt: null
      });
      return "archived";
    }
    const data = await this.apiClient.createTask({
      id: null,
      title: task.description,
      note: null,
      priority: mapPriorityToSingularity(task.priority),
      projectId,
      start,
      deadline: formatDateForApi(task.dueDate),
      createdDate: task.createdDate,
      journalDate: null,
      deleteDate: null,
      state: 1,
      checked: 1,
      tags,
      externalId: task.id,
      useTime,
      notifies: notifies.length ? notifies : [],
      alarmNotify: false,
      notify: 1
    });
    const sgId = data.id;
    if (sgId) {
      this._createdIds.add(task.id);
      await this.apiClient.archiveTask(sgId);
      const mtime = await this.getFileMtime(task.filePath);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await this.taskStore.upsert({
        id: task.id,
        obsidianFilePath: task.filePath,
        obsidianLineNumber: task.lineNumber,
        obsidianContentHash: task.syncHash ?? task.id,
        obsidianDescription: task.description,
        singularityTaskId: sgId,
        singularityEtag: null,
        lastSyncedAt: now,
        lastModifiedObsidian: mtime,
        lastModifiedSingularity: now,
        syncStatus: "synced",
        errorMessage: null,
        createdAt: null,
        updatedAt: null
      });
    }
    return "archived";
  }
  async getFileMtime(filePath) {
    return this.vaultReader.getFileMtime(filePath);
  }
  async loadProjects() {
    try {
      const projects = await this.apiClient.getProjects(false, false, 100);
      this._projectsCache = {};
      for (const p of projects) {
        const title = (p.title ?? "").toLowerCase();
        if (title) this._projectsCache[title] = p;
      }
    } catch {
      this._projectsCache = {};
    }
  }
  async loadSingularityTasks() {
    try {
      this._sgTasksCache = await this.apiClient.getTasks(false, true);
    } catch {
      this._sgTasksCache = [];
    }
  }
  /** Returns Obsidian IDs of tasks that were deleted, for reverse sync to ignore */
  async syncDeletedObsidianTasks(currentIds) {
    const deletedIds = /* @__PURE__ */ new Set();
    const synced = this.taskStore.getSyncedWithSingularity();
    const sgRefCount = /* @__PURE__ */ new Map();
    for (const s of synced) {
      if (s.singularityTaskId) {
        sgRefCount.set(s.singularityTaskId, (sgRefCount.get(s.singularityTaskId) ?? 0) + 1);
      }
    }
    for (const state of synced) {
      if (!currentIds.has(state.id)) {
        deletedIds.add(state.id);
        const sgId = state.singularityTaskId;
        if (sgId && !this.dryRun) {
          const refCount = sgRefCount.get(sgId) ?? 1;
          if (refCount <= 1) {
            try {
              await this.apiClient.softDeleteTask(sgId);
            } catch {
            }
          }
        }
        await this.taskStore.deleteById(state.id);
      }
    }
    return deletedIds;
  }
  findProjectByTag(tag) {
    return this._projectsCache[tag.toLowerCase()]?.id ?? null;
  }
  async findOrCreateProject(projectTag) {
    const existing = this.findProjectByTag(projectTag);
    if (existing) return existing;
    if (this.dryRun) return null;
    try {
      const project = await this.apiClient.createProject(projectTag);
      const newId = project.id;
      if (newId) {
        this._projectsCache[projectTag.toLowerCase()] = project;
      }
      return newId ?? null;
    } catch {
      return null;
    }
  }
};

// src/orchestrators/reverse-sync.ts
var import_obsidian7 = require("obsidian");
function extractNoteText(note) {
  if (!note) return "";
  if (typeof note === "string") {
    try {
      const delta = JSON.parse(note);
      if (Array.isArray(delta)) {
        return delta.map((op) => op.insert ?? "").join("");
      }
    } catch {
    }
    return note;
  }
  if (Array.isArray(note)) {
    return note.map((op) => op.insert ?? "").join("");
  }
  return String(note);
}
function utcIsoToLocalDate(value) {
  if (!value) return null;
  if (/^\d{10,}$/.test(value.trim())) return null;
  if (!value.includes("T")) return value.split(" ")[0];
  const d = new Date(value);
  if (isNaN(d.getTime())) return value.split("T")[0];
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
var ReverseSyncOrchestrator = class {
  constructor(apiClient, taskStore, obsidianTasksFile, vault, vaultWriter, excludeTags = [], dryRun = false, projectsFolder = "/project", projectTemplate = "", lastKnownProjectFiles = {}) {
    this.apiClient = apiClient;
    this.taskStore = taskStore;
    this.obsidianTasksFile = obsidianTasksFile;
    this.vault = vault;
    this.vaultWriter = vaultWriter;
    this.excludeTags = excludeTags;
    this.dryRun = dryRun;
    this.projectsFolder = projectsFolder;
    this.projectTemplate = projectTemplate;
    this._projectsCache = {};
    this._projectsFull = {};
    this._tagsCache = {};
    this._tagsLoaded = false;
    this._obsidianProjects = null;
    this.deletedFromObsidian = /* @__PURE__ */ new Set();
    this.syncedObsidianIds = /* @__PURE__ */ new Set();
    this.isLoadedProject = false;
    this._currentProjectFiles = {};
    this._lastKnownProjectFiles = lastKnownProjectFiles;
  }
  getProjectFiles() {
    return { ...this._currentProjectFiles };
  }
  setDeletedFromObsidian(ids) {
    this.deletedFromObsidian = ids;
  }
  setSyncedObsidianIds(ids) {
    this.syncedObsidianIds = ids;
  }
  async sync() {
    const stats = {
      obsidianTasks: 0,
      singularityTasks: 0,
      created: 0,
      updated: 0,
      archived: 0,
      deleted: 0,
      errors: 0,
      skipped: 0,
      dbCleaned: 0
    };
    await this.loadProjects();
    await this.ensureProjectFiles();
    await this.loadTags();
    this.loadObsidianProjects();
    const sgTasks = await this.apiClient.getTasks(false, true);
    stats.singularityTasks = sgTasks.length;
    const tasksToWrite = [];
    for (const sgTask of sgTasks) {
      try {
        const [shouldSync, task] = await this.processTask(sgTask);
        if (shouldSync && task) {
          tasksToWrite.push(task);
        }
      } catch (e) {
        stats.errors++;
        console.error(`[ReverseSync] task error:`, e?.message || e, `sgTask:`, sgTask.id);
      }
    }
    if (!this.dryRun && tasksToWrite.length > 0) {
      await this.writeTasks(tasksToWrite);
    }
    stats.created = tasksToWrite.length;
    return stats;
  }
  async loadProjects() {
    try {
      const projects = await this.apiClient.getProjects(false, false, 100);
      this._projectsCache = {};
      this._projectsFull = {};
      for (const p of projects) {
        const id = p.id;
        const title = p.title ?? "";
        if (id && title) {
          this._projectsCache[id] = title;
          this._projectsFull[id] = p;
        }
      }
    } catch {
      this._projectsCache = {};
      this._projectsFull = {};
    }
  }
  async ensureProjectFiles() {
    if (this.dryRun) return;
    const relPath = this.projectsFolder.replace(/^\/+/, "");
    let folder = this.vault.getAbstractFileByPath(relPath);
    if (!folder) {
      try {
        await this.vault.createFolder(relPath);
      } catch {
        return;
      }
      folder = this.vault.getAbstractFileByPath(relPath);
      if (!folder) return;
    }
    const existingByName = /* @__PURE__ */ new Map();
    const existingById = /* @__PURE__ */ new Map();
    if ("children" in folder) {
      for (const child of folder.children) {
        if (child instanceof import_obsidian7.TFile && child.extension === "md") {
          const content = await this.vault.read(child);
          const sgId = parseFrontmatterId(content);
          const name = child.name.replace(/\.md$/, "");
          existingByName.set(name.toLowerCase(), child);
          if (sgId) existingById.set(sgId, child);
        }
      }
    }
    for (const [projId, proj] of Object.entries(this._projectsFull)) {
      const title = (proj.title ?? "").trim();
      if (!title || title.toLowerCase() === "\u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435" || title.toLowerCase() === "inbox") continue;
      const titleLower = title.toLowerCase();
      const filePath = `${relPath}/${title}.md`;
      const byId = existingById.get(projId);
      if (byId) {
        this._currentProjectFiles[projId] = filePath;
        const currentName = byId.name.replace(/\.md$/, "");
        if (currentName !== title) {
          if (existingByName.has(titleLower) && existingByName.get(titleLower).path.toLowerCase() !== filePath.toLowerCase()) {
            await this.vaultWriter.addFrontmatterIfMissing(byId, projId);
          } else {
            await this.vault.rename(byId, filePath);
            existingByName.delete(currentName.toLowerCase());
            existingByName.set(titleLower, byId);
          }
        }
        continue;
      }
      const byName = existingByName.get(titleLower);
      if (byName) {
        this._currentProjectFiles[projId] = filePath;
        const content2 = await this.vault.read(byName);
        const currentId = parseFrontmatterId(content2);
        if (!currentId) {
          await this.vaultWriter.addFrontmatterIfMissing(byName, projId);
        }
        continue;
      }
      const exists = this.vault.getAbstractFileByPath(filePath);
      if (exists instanceof import_obsidian7.TFile) {
        this._currentProjectFiles[projId] = filePath;
        await this.vaultWriter.addFrontmatterIfMissing(exists, projId);
        existingByName.set(titleLower, exists);
        continue;
      }
      const emoji = proj.emoji ? String.fromCodePoint(parseInt(proj.emoji, 16)) : "";
      const note = proj.note ?? "";
      let content;
      if (this.projectTemplate) {
        const now = /* @__PURE__ */ new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        content = this.projectTemplate.replace(/\{\{title\}\}/g, title).replace(/\{\{singularity-id\}\}/g, projId).replace(/\{\{date\}\}/g, dateStr).replace(/\{\{emoji\}\}/g, emoji).replace(/\{\{note\}\}/g, extractNoteText(note));
      } else {
        const lines = [
          "---",
          `singularity-id: "${projId}"`,
          "---",
          "",
          `# ${emoji} ${title}`.trim()
        ];
        if (note) lines.push("", extractNoteText(note));
        lines.push("");
        content = lines.join("\n");
      }
      try {
        const newFile = await this.vault.create(filePath, content);
        existingByName.set(titleLower, newFile);
        this._currentProjectFiles[projId] = filePath;
      } catch {
      }
    }
    for (const [projId, prevPath] of Object.entries(this._lastKnownProjectFiles)) {
      if (this._currentProjectFiles[projId]) continue;
      const file = this.vault.getAbstractFileByPath(prevPath);
      if (file instanceof import_obsidian7.TFile) continue;
      await this.apiClient.deleteProject(projId);
      delete this._projectsFull[projId];
      delete this._projectsCache[projId];
    }
  }
  async loadTags() {
    try {
      const tags = await this.apiClient.getTags(200);
      this._tagsCache = {};
      for (const t of tags) {
        const tagId = t.id ?? "";
        const title = t.title ?? "";
        const cleanId = tagId.replace(/^A-/, "");
        this._tagsCache[cleanId] = title;
        this._tagsCache[tagId] = title;
      }
    } catch {
      this._tagsCache = {};
    }
  }
  loadObsidianProjects() {
    const folder = this.vault.getAbstractFileByPath(this.projectsFolder.replace(/^\/+/, ""));
    if (!folder || !("children" in folder)) {
      this._obsidianProjects = null;
      this._projectFileMap = /* @__PURE__ */ new Map();
      return;
    }
    this._obsidianProjects = /* @__PURE__ */ new Set();
    this._projectFileMap = /* @__PURE__ */ new Map();
    for (const child of folder.children) {
      if (child instanceof import_obsidian7.TFile && child.extension === "md") {
        const name = child.name.replace(/\.md$/, "").toLowerCase();
        this._obsidianProjects.add(name);
      }
    }
    this._obsidianProjects.add("\u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435");
    this._obsidianProjects.add("inbox");
  }
  getTagName(tagId) {
    const cleanId = tagId.replace(/^A-/, "");
    if (cleanId in this._tagsCache) return this._tagsCache[cleanId];
    if (tagId in this._tagsCache) return this._tagsCache[tagId];
    return cleanId || tagId;
  }
  shouldSyncTask(sgTask) {
    const projectId = sgTask.projectId;
    const title = sgTask.title ?? "";
    const tags = sgTask.tags ?? [];
    const sgId = sgTask.id;
    if (sgTask.recurrence) return { ok: false, reason: "recurrence template" };
    const excluded = this.excludeTags.map((t) => t.toLowerCase());
    for (const tagVal of tags) {
      const raw = tagVal.toLowerCase().replace(/^a-/, "");
      const tagName = (this.getTagName(tagVal) ?? raw).toLowerCase();
      if (excluded.includes(tagName) || excluded.includes(raw)) {
        return { ok: false, reason: `excluded tag #${tagName}` };
      }
    }
    if (projectId) {
      const projName = (this._projectsCache[projectId] ?? "").toLowerCase();
      if (projName && excluded.includes(projName)) {
        return { ok: false, reason: `excluded project ${projName}` };
      }
    }
    if (!projectId) return { ok: true, reason: "no project" };
    if (this._obsidianProjects === null) return { ok: true, reason: "projects not configured" };
    const projectName = this._projectsCache[projectId] ?? "";
    const projectNameLower = projectName.toLowerCase();
    if (this._obsidianProjects.has(projectNameLower)) {
      return { ok: true, reason: `project ${projectName} in Obsidian` };
    }
    if (["\u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435", "inbox"].includes(projectNameLower)) {
      return { ok: true, reason: "inbox project" };
    }
    return { ok: false, reason: "project not in Obsidian" };
  }
  async processTask(sgTask) {
    const { ok, reason } = this.shouldSyncTask(sgTask);
    if (!ok) return [false, null];
    const extId = sgTask.externalId;
    if (extId && this.deletedFromObsidian.has(extId)) return [false, null];
    if (extId && this.syncedObsidianIds.has(extId)) return [false, null];
    const sgId = sgTask.id;
    const title = sgTask.title ?? "";
    const checked = sgTask.checked ?? 0;
    const priority = sgTask.priority;
    const start = sgTask.start;
    const deadline = sgTask.deadline;
    const tags = sgTask.tags ?? [];
    const notifies = this.extractNotifies(sgTask);
    const externalId = sgTask.externalId;
    const priorityEmojis = /* @__PURE__ */ new Set(["\u{1F53A}", "\u23EB", "\u{1F53C}", "\u{1F53D}", "\u23EC"]);
    const filteredTags = tags.filter(
      (t) => !priorityEmojis.has(t) && !/^[🔺⏫🔼🔽⏬]+$/.test(t)
    );
    const obsidianTags = ["todo"];
    const projectId = sgTask.projectId;
    const projectName = projectId ? this._projectsCache[projectId] : void 0;
    for (const tagId of filteredTags) {
      const tagName = this.getTagName(tagId);
      if (tagName) obsidianTags.push(tagName.replace(/\s+/g, "_"));
    }
    if (notifies.length > 0) {
      for (const n of notifies) {
        obsidianTags.push(`notify/${n}`);
      }
    }
    let startDate = null;
    let scheduledDate = null;
    if (checked !== 2 && start) {
      const hasTime = start.includes("T") && start.includes(":");
      if (hasTime) {
        const dt = new Date(start);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const d = String(dt.getDate()).padStart(2, "0");
        startDate = `${y}-${m}-${d}`;
        const useTime = sgTask.useTime ?? false;
        const hasNotifies = notifies.length > 0;
        if (useTime || hasNotifies) {
          const h = String(dt.getHours()).padStart(2, "0");
          const min = String(dt.getMinutes()).padStart(2, "0");
          scheduledDate = `${y}-${m}-${d} ${h}:${min}`;
        }
      } else {
        startDate = start.split("T")[0].split(" ")[0];
        scheduledDate = null;
      }
    }
    const obsidianTask = {
      id: externalId ?? `sg_${sgId}`,
      description: title,
      status: checked === 2 ? "cancelled" /* Cancelled */ : checked === 1 ? "done" /* Done */ : "todo" /* Todo */,
      filePath: this.obsidianTasksFile,
      lineNumber: 0,
      tags: obsidianTags,
      projectTag: projectName ?? null,
      dueDate: utcIsoToLocalDate(deadline),
      scheduledDate,
      startDate,
      createdDate: utcIsoToLocalDate(sgTask.createdDate),
      doneDate: checked === 1 ? utcIsoToLocalDate(sgTask.journalDate ?? start) : null,
      cancelledDate: checked === 2 ? utcIsoToLocalDate(sgTask.deleteDate) ?? utcIsoToLocalDate(sgTask.journalDate) ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : null,
      priority: priority != null ? mapPriorityFromSingularity(Number(priority)) : "high" /* High */,
      lastSyncedAt: null,
      syncHash: null
    };
    return [true, obsidianTask];
  }
  extractNotifies(sgTask) {
    const raw = sgTask.notifies;
    if (raw !== void 0 && raw !== null) {
      if (Array.isArray(raw)) {
        if (raw.length > 0) {
          const nums = raw.map(Number).filter((n2) => !isNaN(n2));
          if (nums.length > 0) return nums;
        }
        return [];
      }
      const n = Number(raw);
      if (!isNaN(n)) return [n];
    }
    const fromTitle = extractNotifyMinutes(sgTask.title ?? "");
    if (fromTitle.length > 0) return fromTitle;
    return [];
  }
  async getAllExistingTaskFiles() {
    const files = [];
    const tasksRel = this.obsidianTasksFile.replace(/^\/+/, "");
    const tasksFile = this.vault.getAbstractFileByPath(tasksRel);
    if (tasksFile instanceof import_obsidian7.TFile) files.push(this.obsidianTasksFile);
    const projRel = this.projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(projRel);
    if (folder && "children" in folder) {
      for (const child of folder.children) {
        if (child instanceof import_obsidian7.TFile && child.extension === "md") {
          files.push(`${this.projectsFolder}/${child.name}`);
        }
      }
    }
    return files;
  }
  async writeTasks(tasks) {
    const byFile = /* @__PURE__ */ new Map();
    for (const task of tasks) {
      const targetPath = task.projectTag ? `${this.projectsFolder}/${task.projectTag}.md` : this.obsidianTasksFile;
      if (!byFile.has(targetPath)) byFile.set(targetPath, []);
      byFile.get(targetPath).push(task);
    }
    for (const existingPath of await this.getAllExistingTaskFiles()) {
      if (!byFile.has(existingPath)) byFile.set(existingPath, []);
    }
    const createdMap = await this.buildCreatedDateMap();
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const excluded = this.excludeTags.map((t) => t.toLowerCase());
    for (const [filePath, fileTasks] of byFile) {
      const processed = fileTasks.map((task) => {
        const line = formatTaskLine({
          ...task,
          createdDate: createdMap.get(this.normalizeCompare(task.description)) ?? task.createdDate ?? today
        });
        const lineLower = line.toLowerCase();
        if (excluded.some((tag) => lineLower.includes(`#${tag}`))) return null;
        return { raw: line, parsed: task };
      }).filter((x) => x !== null).map((x) => x.parsed);
      if (processed.length === 0 && !await this.vaultWriter.hasTasksSection(filePath)) continue;
      await this.vaultWriter.writeTasksToFile(filePath, processed);
    }
  }
  normalizeCompare(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
  }
  async buildCreatedDateMap() {
    const map = /* @__PURE__ */ new Map();
    const CREATED_RE = /\u2795\s*(\d{4}-\d{2}-\d{2})/u;
    const relPath = this.obsidianTasksFile.replace(/^\/+/, "");
    const tasksFile = this.vault.getAbstractFileByPath(relPath);
    if (tasksFile instanceof import_obsidian7.TFile) {
      const content = await this.vault.read(tasksFile);
      for (const line of content.split("\n")) {
        const desc = this.extractLineDescription(line);
        if (desc) {
          const m = line.match(CREATED_RE);
          if (m) map.set(desc, m[1]);
        }
      }
    }
    const projRel = this.projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(projRel);
    if (folder && "children" in folder) {
      for (const child of folder.children) {
        if (child instanceof import_obsidian7.TFile && child.extension === "md") {
          const content = await this.vault.read(child);
          for (const line of content.split("\n")) {
            const desc = this.extractLineDescription(line);
            if (desc) {
              const m = line.match(CREATED_RE);
              if (m) map.set(desc, m[1]);
            }
          }
        }
      }
    }
    return map;
  }
  extractLineDescription(raw) {
    if (!raw.includes("- [")) return null;
    let _emojiDatesRe;
    try {
      _emojiDatesRe = /[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C]\s*\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?/gu;
    } catch {
      _emojiDatesRe = /[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C]\s*\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?)?/g;
    }
    let s = raw.replace(/^-\s*\[[ x-]\]\s*/, "");
    s = s.replace(/^#todo\s+/, "");
    s = s.replace(/#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g, "");
    s = s.replace(/[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]/gu, "");
    s = s.replace(_emojiDatesRe, "");
    return s.trim().toLowerCase().replace(/\s+/g, " ");
  }
};

// src/orchestrators/bidirectional-sync.ts
var BidirectionalSyncOrchestrator = class {
  constructor(vaultReader, apiClient, taskStore, obsidianTasksFile, vault, vaultWriter, excludeTags = [], dryRun = false, projectsFolder = "/project", conflictStrategy = "latest_wins" /* LatestWins */, conflictPromptFn, projectTemplate = "", lastKnownProjectFiles = {}) {
    this.conflictStrategy = conflictStrategy;
    this.conflictPromptFn = conflictPromptFn;
    this.projectTemplate = projectTemplate;
    this.lastKnownProjectFiles = lastKnownProjectFiles;
    this.forward = new ForwardSyncOrchestrator(
      vaultReader,
      apiClient,
      taskStore,
      dryRun,
      conflictStrategy,
      conflictPromptFn
    );
    this.reverse = new ReverseSyncOrchestrator(
      apiClient,
      taskStore,
      obsidianTasksFile,
      vault,
      vaultWriter,
      excludeTags,
      dryRun,
      projectsFolder,
      projectTemplate,
      lastKnownProjectFiles
    );
  }
  getProjectFiles() {
    return this.reverse.getProjectFiles();
  }
  async sync(tasksFile, projectsFolder) {
    const stats = await this.forward.sync(tasksFile, projectsFolder);
    const obsidianTasks = await this.forward.getVaultReader().readAllTasks(tasksFile, projectsFolder);
    const currentIds = new Set(obsidianTasks.map((t) => t.id));
    const deletedIds = await this.forward.syncDeletedObsidianTasks(currentIds);
    stats.deleted += deletedIds.size;
    this.reverse.setDeletedFromObsidian(deletedIds);
    this.reverse.setSyncedObsidianIds(this.forward.getFailedObsidianIds());
    const reverseStats = await this.reverse.sync();
    stats.singularityTasks = reverseStats.singularityTasks;
    stats.created += reverseStats.created;
    stats.updated += reverseStats.updated;
    stats.archived += reverseStats.archived;
    stats.errors += reverseStats.errors;
    stats.skipped += reverseStats.skipped;
    const sgTasks = await this.forward.getApiClient().getTasks(true, true);
    const sgIds = new Set(sgTasks.map((t) => t.id).filter(Boolean));
    stats.dbCleaned = await this.forward.getTaskStore().deleteOrphanedRecords(currentIds, sgIds);
    return stats;
  }
};

// src/main.ts
var SingularitySyncPlugin = class extends import_obsidian8.Plugin {
  constructor() {
    super(...arguments);
    this._ssWorking = true;
  }
  async onload() {
    await this.loadSettings();
    this.taskStore = new TaskStore(async () => {
      const existing = await this.loadData() ?? {};
      const clean = { ...this.settings };
      delete clean.singularityApiKey;
      clean.syncState = this.taskStore.getAll();
      if (existing.habitState) clean.habitState = existing.habitState;
      await this.saveData(clean);
    });
    this.statusBar = this.addStatusBarItem();
    this.statusBar.setText("Singularity: \u2014");
    this.statusBar.addClass("singularity-sync-status");
    this.statusBar.onclick = () => this.runSync();
    this.addSettingTab(new SingularitySyncSettingTab(this.app, this));
    this.addCommand({
      id: "sync-now",
      name: "\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441 Singularity",
      callback: () => this.runSync()
    });
    this.addCommand({
      id: "sync-validate",
      name: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A Singularity",
      callback: () => this.validate()
    });
    this.addRibbonIcon("sync", "Singularity Sync", () => this.runSync());
    this.addRibbonIcon("list-checks", "Singularity Panel", () => this.openSingularityView());
    this.registerView(SINGULARITY_VIEW_TYPE, (leaf) => new SingularityTaskView(leaf));
    this.app.workspace.onLayoutReady(() => {
      setTimeout(() => this.initSingularityView().catch(() => {
      }), 500);
    });
    this.addCommand({
      id: "open-singularity-view",
      name: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043D\u0435\u043B\u044C Singularity",
      callback: () => this.openSingularityView()
    });
  }
  /** Init a view leaf: restore habit state, set up change callback, attach API client */
  async initView(view) {
    if (typeof view?.loadState !== "function") return;
    const data = await this.loadData() ?? {};
    if (data.habitState) view.loadState(data.habitState);
    view.setStateChangeCallback(async () => {
      const d = await this.loadData() ?? {};
      d.habitState = view.getState();
      await this.saveData(d);
    });
    view.setTaskCheckCallback(async (sgTaskId, checked, title) => {
      if (!title) return;
      const state = this.taskStore.getBySingularityId(sgTaskId);
      const filePath = state?.obsidianFilePath || this.settings.obsidianTasksFile;
      const relPath = filePath.replace(/^\/+/, "");
      const file = this.app.vault.getAbstractFileByPath(relPath);
      if (!(file instanceof import_obsidian8.TFile)) return;
      let content = await this.app.vault.read(file);
      const lines = content.split("\n");
      const statusChar = checked ? "x" : " ";
      let updated = false;
      if (state?.obsidianLineNumber) {
        const idx = state.obsidianLineNumber - 1;
        if (idx >= 0 && idx < lines.length && lines[idx].includes("- [")) {
          lines[idx] = lines[idx].replace(/-\s*\[.\]\s*/, `- [${statusChar}] `);
          updated = true;
        }
      }
      if (!updated) {
        const desc = title.toLowerCase().trim();
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(desc) && lines[i].includes("- [") && lines[i].includes("#todo")) {
            lines[i] = lines[i].replace(/-\s*\[.\]\s*/, `- [${statusChar}] `);
            updated = true;
            break;
          }
        }
      }
      if (updated) await this.app.vault.modify(file, lines.join("\n"));
    });
    const apiKey = this.getApiKey();
    if (apiKey) {
      const client = new SingularityAPIClient({
        apiKey,
        baseUrl: this.settings.singularityApiBaseUrl
      });
      await view.setApiClient(client);
    }
  }
  /** Initialize all existing Singularity view leaves, or open one if none exist */
  async initSingularityView() {
    const leaves = this.app.workspace.getLeavesOfType(SINGULARITY_VIEW_TYPE);
    if (leaves.length === 0) {
      await this.openSingularityView();
      return;
    }
    for (const leaf of leaves) {
      await this.initView(leaf.view);
    }
  }
  async openSingularityView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(SINGULARITY_VIEW_TYPE).first();
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      if (!leaf) return;
      await leaf.setViewState({ type: SINGULARITY_VIEW_TYPE, active: true });
    }
    workspace.revealLeaf(leaf);
    await this.initView(leaf.view);
  }
  getApiKey() {
    if (this._ssWorking) {
      try {
        const ss = this.app?.secretStorage;
        if (ss?.getSecret) {
          const k = ss.getSecret("singularity");
          if (k) return k;
        }
      } catch {
        this._ssWorking = false;
      }
    }
    return this.settings.singularityApiKey || "";
  }
  hasApiKey() {
    return this.getApiKey() !== "";
  }
  saveApiKey(key) {
    try {
      const ss = this.app?.secretStorage;
      if (ss && typeof ss.setSecret === "function") {
        ss.setSecret("singularity", key);
        this.settings.singularityApiKey = "";
        this.saveSettings();
        new import_obsidian8.Notice("\u{1F511} \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 Obsidian", 3e3);
        return;
      }
    } catch (e) {
      new import_obsidian8.Notice(`\u274C ${e?.message || e}`, 3e3);
    }
    this.settings.singularityApiKey = key;
    this.saveSettings();
    new import_obsidian8.Notice("\u{1F511} \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445", 3e3);
  }
  removeApiKey() {
    try {
      const ss = this.app?.secretStorage;
      if (ss && typeof ss.setSecret === "function") ss.setSecret("singularity", "");
    } catch {
    }
    this.settings.singularityApiKey = "";
    this.saveSettings();
    new import_obsidian8.Notice("\u{1F5D1}\uFE0F \u041A\u043B\u044E\u0447 \u0443\u0434\u0430\u043B\u0451\u043D", 3e3);
  }
  async runSync() {
    new import_obsidian8.Notice("\u{1F504} \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F...");
    let stats = null;
    try {
      const apiKey = await this.getApiKey();
      const apiClient = new SingularityAPIClient({
        apiKey,
        baseUrl: this.settings.singularityApiBaseUrl
      });
      const vaultReader = new ObsidianVaultReader(this.app.vault, this.settings.tasksSectionMarker);
      const vaultWriter = new ObsidianVaultWriter(this.app.vault, this.settings.tasksSectionMarker);
      const data = await this.loadData();
      const savedState = data.syncState ?? [];
      this.taskStore.load(savedState);
      const conflictPromptFn = (_obTask, _sgTitle) => {
        const result = prompt("\u26A0\uFE0F \u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442: \u0432\u044B\u0431\u0440\u0430\u0442\u044C [O]bsidian / [S]ingularity / \u043F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C [K]");
        return result?.toUpperCase() || "K";
      };
      const orchestrator = new BidirectionalSyncOrchestrator(
        vaultReader,
        apiClient,
        this.taskStore,
        this.settings.obsidianTasksFile,
        this.app.vault,
        vaultWriter,
        this.settings.syncExcludeTags.split(",").map((t) => t.trim()).filter(Boolean),
        this.settings.syncDryRun,
        this.settings.obsidianProjectsFolder,
        this.settings.syncConflictResolution,
        conflictPromptFn,
        this.settings.projectTemplate,
        data.projectFiles ?? {}
      );
      stats = await orchestrator.sync(
        this.settings.obsidianTasksFile,
        this.settings.obsidianProjectsFolder
      );
      const syncState = this.taskStore.getAll();
      data.syncState = syncState;
      data.projectFiles = orchestrator.getProjectFiles();
      await this.saveData(data);
      const now = /* @__PURE__ */ new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      this.statusBar.setText(`Singularity: \u2705 ${time}`);
      let msg = `\u2705 \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430`;
      if (stats.dbCleaned > 0) msg += `. \u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0435\u043D\u043E ${stats.dbCleaned} \u0437\u0430\u0434\u0430\u0447-\u043F\u0440\u0438\u0437\u0440\u0430\u043A\u043E\u0432`;
      new import_obsidian8.Notice(msg, 3e3);
      this.refreshSingularityView();
    } catch (e) {
      const errMsg = e?.message || String(e);
      new import_obsidian8.Notice(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430: ${errMsg}`, 5e3);
    }
  }
  async refreshSingularityView() {
    const leaves = this.app.workspace.getLeavesOfType(SINGULARITY_VIEW_TYPE);
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view?.refresh) await view.refresh();
    }
  }
  async resetAndSync() {
    new import_obsidian8.Notice("\u{1F5D1}\uFE0F \u0421\u0431\u0440\u043E\u0441 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F...", 2e3);
    this.taskStore.deleteAll();
    const data = await this.loadData() ?? {};
    data.syncState = [];
    await this.saveData(data);
    new import_obsidian8.Notice("\u{1F504} \u0427\u0438\u0441\u0442\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F...", 2e3);
    await this.runSync();
  }
  async validate() {
    const apiKey = await this.getApiKey();
    const apiClient = new SingularityAPIClient({
      apiKey,
      baseUrl: this.settings.singularityApiBaseUrl
    });
    try {
      const ok = await apiClient.validateToken();
      this.statusBar.setText(`Singularity: ${ok ? "\u2705" : "\u274C"}`);
      new import_obsidian8.Notice(ok ? "\u2705 \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A Singularity \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442" : "\u274C \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 API \u043A\u043B\u044E\u0447");
    } catch (e) {
      this.statusBar.setText("Singularity: \u274C");
      new import_obsidian8.Notice(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430: ${e.message}`);
    }
  }
  async loadSettings() {
    let data = await this.loadData() ?? {};
    const syncState = data.syncState;
    delete data.singularityApiKey;
    delete data.singularityMcpToken;
    delete data.singularityMcpBaseUrl;
    delete data.dbPath;
    delete data.logLevel;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    this.settings = Object.assign(this.settings, syncState ? { syncState } : {});
  }
  async saveSettings() {
    const data = await this.loadData() ?? {};
    const clean = { ...this.settings };
    delete clean.singularityApiKey;
    if (data.syncState) clean.syncState = data.syncState;
    await this.saveData(clean);
  }
};
