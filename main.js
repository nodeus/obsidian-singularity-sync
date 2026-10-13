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
var import_obsidian11 = require("obsidian");

// src/settings.ts
var import_obsidian = require("obsidian");
var DEFAULT_SETTINGS = {
  singularityApiKey: "",
  singularityApiBaseUrl: "https://api.singularity-app.com/v2",
  obsidianTasksFile: "/tasks/tasks.md",
  obsidianProjectsFolder: "/project",
  tasksSectionMarker: "#### \u{1F4DD} Tasks",
  projectTemplate: "",
  notesSectionMarker: "#### \u{1F4DD} Notes",
  syncDirection: "both",
  syncConflictResolution: "latest_wins",
  syncExcludeTags: "GC,nd",
  syncDryRun: false,
  deleteProjectOnFileDelete: false,
  localOnlyTimer: false,
  habitDaysCount: 14
};
function validateSyncSettings(s, hasApiKey) {
  const problems = [];
  if (!hasApiKey) problems.push("\u041D\u0435 \u0437\u0430\u0434\u0430\u043D API-\u043A\u043B\u044E\u0447 Singularity");
  try {
    const u = new URL(s.singularityApiBaseUrl);
    if (u.protocol !== "https:" && u.protocol !== "http:") {
      problems.push(`API Base URL \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C http(s): ${s.singularityApiBaseUrl}`);
    }
  } catch {
    problems.push(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 API Base URL: ${s.singularityApiBaseUrl || "(\u043F\u0443\u0441\u0442\u043E)"}`);
  }
  const tasksFile = (s.obsidianTasksFile ?? "").trim();
  if (!tasksFile) problems.push("\u041D\u0435 \u0437\u0430\u0434\u0430\u043D \u0444\u0430\u0439\u043B \u0437\u0430\u0434\u0430\u0447");
  else if (!tasksFile.startsWith("/")) problems.push(`\u0424\u0430\u0439\u043B \u0437\u0430\u0434\u0430\u0447 \u0434\u043E\u043B\u0436\u0435\u043D \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 /: ${tasksFile}`);
  else if (!tasksFile.endsWith(".md")) problems.push(`\u0424\u0430\u0439\u043B \u0437\u0430\u0434\u0430\u0447 \u0434\u043E\u043B\u0436\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F .md: ${tasksFile}`);
  const projFolder = (s.obsidianProjectsFolder ?? "").trim();
  if (!projFolder) problems.push("\u041D\u0435 \u0437\u0430\u0434\u0430\u043D\u0430 \u043F\u0430\u043F\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432");
  else if (!projFolder.startsWith("/")) problems.push(`\u041F\u0430\u043F\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432 \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 /: ${projFolder}`);
  if (!(s.tasksSectionMarker ?? "").trim()) problems.push("\u041D\u0435 \u0437\u0430\u0434\u0430\u043D \u043C\u0430\u0440\u043A\u0435\u0440 \u0441\u0435\u043A\u0446\u0438\u0438 \u0437\u0430\u0434\u0430\u0447");
  if (!(s.notesSectionMarker ?? "").trim()) problems.push("\u041D\u0435 \u0437\u0430\u0434\u0430\u043D \u043C\u0430\u0440\u043A\u0435\u0440 \u0441\u0435\u043A\u0446\u0438\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F");
  if (!Number.isInteger(s.habitDaysCount) || s.habitDaysCount < 1 || s.habitDaysCount > 31) {
    problems.push(`\u0414\u043D\u0435\u0439 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C 1..31, \u0441\u0435\u0439\u0447\u0430\u0441: ${s.habitDaysCount}`);
  }
  const tpl = s.projectTemplate ?? "";
  if (tpl.trim()) {
    if (!tpl.includes("{{title}}")) problems.push("\u0428\u0430\u0431\u043B\u043E\u043D \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0431\u0435\u0437 {{title}} \u2014 \u0444\u0430\u0439\u043B\u044B \u043E\u0441\u0442\u0430\u043D\u0443\u0442\u0441\u044F \u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F");
    if (!tpl.includes("{{singularity-id}}")) problems.push("\u0428\u0430\u0431\u043B\u043E\u043D \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0431\u0435\u0437 {{singularity-id}} \u2014 \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0430 \u043A \u043F\u0440\u043E\u0435\u043A\u0442\u0443 \u043F\u043E\u0442\u0435\u0440\u044F\u0435\u0442\u0441\u044F");
  }
  return problems;
}
var SingularitySyncSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.saveTimer = null;
    this.plugin = plugin;
  }
  /** Debounced settings persist (500ms): text inputs fire onChange per keystroke. */
  scheduleSave() {
    if (this.saveTimer) clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.plugin.saveSettings().catch(() => {
      });
    }, 500);
  }
  hide() {
    if (this.saveTimer) {
      clearTimeout(this.saveTimer);
      this.saveTimer = null;
      this.plugin.saveSettings().catch(() => {
      });
    }
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
        this.scheduleSave();
      })
    );
    containerEl.createEl("h3", { text: "\u{1F4DD} Obsidian" });
    new import_obsidian.Setting(containerEl).setName("\u0424\u0430\u0439\u043B \u0437\u0430\u0434\u0430\u0447").setDesc("\u041F\u0443\u0442\u044C \u043A \u0444\u0430\u0439\u043B\u0443 \u0437\u0430\u0434\u0430\u0447 \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430").addText(
      (text) => text.setPlaceholder("/tasks/tasks.md").setValue(this.plugin.settings.obsidianTasksFile).onChange(async (val) => {
        this.plugin.settings.obsidianTasksFile = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041F\u0430\u043F\u043A\u0430 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").setDesc("\u041F\u0443\u0442\u044C \u043A \u043F\u0430\u043F\u043A\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").addText(
      (text) => text.setPlaceholder("/project").setValue(this.plugin.settings.obsidianProjectsFolder).onChange(async (val) => {
        this.plugin.settings.obsidianProjectsFolder = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041C\u0430\u0440\u043A\u0435\u0440 \u0441\u0435\u043A\u0446\u0438\u0438 \u0437\u0430\u0434\u0430\u0447").setDesc("\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A, \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0440\u0430\u0441\u043F\u043E\u043B\u0430\u0433\u0430\u044E\u0442\u0441\u044F \u0437\u0430\u0434\u0430\u0447\u0438 \u0432 \u0444\u0430\u0439\u043B\u0430\u0445 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432").addText(
      (text) => text.setPlaceholder("#### \u{1F4DD} Tasks").setValue(this.plugin.settings.tasksSectionMarker).onChange(async (val) => {
        this.plugin.settings.tasksSectionMarker = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0428\u0430\u0431\u043B\u043E\u043D \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430").setDesc("\u0428\u0430\u0431\u043B\u043E\u043D \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u0434\u043B\u044F \u043D\u043E\u0432\u044B\u0445 \u0444\u0430\u0439\u043B\u043E\u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u0432. Placeholders: {{title}}, {{singularity-id}}, {{date}}, {{emoji}}, {{note}}. \u041E\u0441\u0442\u0430\u0432\u044C \u043F\u0443\u0441\u0442\u044B\u043C \u0434\u043B\u044F \u043F\u0440\u043E\u0441\u0442\u043E\u0433\u043E \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E.").then((setting2) => {
      setting2.controlEl.style.width = "66%";
    }).addTextArea(
      (text) => text.setPlaceholder("\u041E\u0441\u0442\u0430\u0432\u044C \u043F\u0443\u0441\u0442\u044B\u043C \u0434\u043B\u044F \u0448\u0430\u0431\u043B\u043E\u043D\u0430 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E").setValue(this.plugin.settings.projectTemplate).onChange(async (val) => {
        this.plugin.settings.projectTemplate = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u041C\u0430\u0440\u043A\u0435\u0440 \u0441\u0435\u043A\u0446\u0438\u0438 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F").setDesc("\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043E\u043A, \u043F\u043E\u0441\u043B\u0435 \u043A\u043E\u0442\u043E\u0440\u043E\u0433\u043E \u0440\u0430\u0441\u043F\u043E\u043B\u0430\u0433\u0430\u0435\u0442\u0441\u044F \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u0430 (\u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0438\u0437 Singularity \u0432 Obsidian)").addText(
      (text) => text.setPlaceholder("#### \u{1F4DD} Notes").setValue(this.plugin.settings.notesSectionMarker).onChange(async (val) => {
        this.plugin.settings.notesSectionMarker = val;
        this.scheduleSave();
      })
    );
    containerEl.createEl("h3", { text: "\u{1F504} \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F" });
    new import_obsidian.Setting(containerEl).setName("\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435").setDesc("\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438").addDropdown(
      (dd) => dd.addOption("both", "\u0414\u0432\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u044F\u044F").addOption("forward", "Obsidian \u2192 Singularity").addOption("reverse", "Singularity \u2192 Obsidian").setValue(this.plugin.settings.syncDirection).onChange(async (val) => {
        this.plugin.settings.syncDirection = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044F \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432").setDesc("\u041A\u0430\u043A \u0440\u0430\u0437\u0440\u0435\u0448\u0430\u0442\u044C \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u044B \u043F\u0440\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0438 \u0432 \u043E\u0431\u0435\u0438\u0445 \u0441\u0438\u0441\u0442\u0435\u043C\u0430\u0445").addDropdown(
      (dd) => dd.addOption("latest_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435").addOption("obsidian_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 Obsidian").addOption("singularity_wins", "\u041F\u043E\u0431\u0435\u0436\u0434\u0430\u0435\u0442 Singularity").addOption("manual", "\u0420\u0443\u0447\u043D\u043E\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435").setValue(this.plugin.settings.syncConflictResolution).onChange(async (val) => {
        this.plugin.settings.syncConflictResolution = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0418\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0442\u0435\u0433\u0438").setDesc("\u0422\u0435\u0433\u0438 \u0434\u043B\u044F \u0438\u0441\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0438\u0437 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)").addText(
      (text) => text.setPlaceholder("GC,nd").setValue(this.plugin.settings.syncExcludeTags).onChange(async (val) => {
        this.plugin.settings.syncExcludeTags = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("Dry Run").setDesc("\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0440\u0435\u0436\u0438\u043C \u0431\u0435\u0437 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.syncDryRun).onChange(async (val) => {
        this.plugin.settings.syncDryRun = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0423\u0434\u0430\u043B\u044F\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442 \u0432 Singularity \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0444\u0430\u0439\u043B\u0430").setDesc("\u0415\u0441\u043B\u0438 \u0444\u0430\u0439\u043B \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0443\u0434\u0430\u043B\u0451\u043D \u0432 Obsidian \u2014 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442 \u0432 Singularity. \u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E: \u043F\u0440\u043E\u0435\u043A\u0442 \u043E\u0441\u0442\u0430\u0451\u0442\u0441\u044F, \u0444\u0430\u0439\u043B \u043D\u0435 \u043F\u0435\u0440\u0435\u0441\u043E\u0437\u0434\u0430\u0451\u0442\u0441\u044F, \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u044C \u043F\u0438\u0448\u0435\u0442\u0441\u044F \u043F\u0440\u0435\u0434\u0443\u043F\u0440\u0435\u0436\u0434\u0435\u043D\u0438\u0435.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.deleteProjectOnFileDelete).onChange(async (val) => {
        this.plugin.settings.deleteProjectOnFileDelete = val;
        this.scheduleSave();
      })
    );
    new import_obsidian.Setting(containerEl).setName("\u0422\u043E\u043B\u044C\u043A\u043E \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0440\u0435\u043A\u0438\u043D\u0433 \u0432\u0440\u0435\u043C\u0435\u043D\u0438").setDesc("\u041D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u0438 \u0442\u0430\u0439\u043C\u0435\u0440\u0430 \u0432 Singularity (\u0434\u043B\u044F \u0442\u0430\u0440\u0438\u0444\u043E\u0432 \u0431\u0435\u0437 time-stat API). \u0421\u0435\u0441\u0441\u0438\u0438 \u043F\u0438\u0448\u0443\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0436\u0443\u0440\u043D\u0430\u043B.").addToggle(
      (toggle) => toggle.setValue(this.plugin.settings.localOnlyTimer ?? false).onChange(async (val) => {
        this.plugin.settings.localOnlyTimer = val;
        this.scheduleSave();
        this.plugin.syncTimerToViews();
        this.plugin.refreshSingularityView();
      })
    );
    containerEl.createEl("h3", { text: "\u2705 \u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438" });
    const setting = new import_obsidian.Setting(containerEl).setName("\u0414\u043D\u0435\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F").setDesc(`\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0434\u043D\u0435\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438 (\u0441\u0435\u0439\u0447\u0430\u0441: ${this.plugin.settings.habitDaysCount})`).addSlider(
      (slider) => slider.setLimits(1, 14, 1).setValue(this.plugin.settings.habitDaysCount).onChange(async (val) => {
        this.plugin.settings.habitDaysCount = val;
        this.scheduleSave();
        setting.setDesc(`\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 \u0434\u043D\u0435\u0439 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u043D\u0430 \u043F\u0430\u043D\u0435\u043B\u0438 (\u0441\u0435\u0439\u0447\u0430\u0441: ${val})`);
        this.plugin.refreshSingularityView();
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

// src/ui/conflict-modal.ts
var import_obsidian2 = require("obsidian");

// src/domain/mapper.ts
function mapPriorityToSingularity(priority) {
  if (priority == null || priority === "none" /* None */) return void 0;
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
      return void 0;
  }
}
function mapPriorityFromSingularity(priority) {
  if (priority == null) return null;
  if (typeof priority === "string" && priority.trim() === "") return null;
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
function localOffsetString() {
  return offsetStringFor(/* @__PURE__ */ new Date());
}
function offsetStringFor(d) {
  const offsetMin = -d.getTimezoneOffset();
  const sign = offsetMin >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `${sign}${h}:${m}`;
}
function formatDateForApi(dateValue, useTime) {
  void useTime;
  if (!dateValue) return null;
  const cleaned = dateValue.trim();
  if (/Z$/i.test(cleaned) || /[+-]\d{2}:\d{2}$/.test(cleaned)) return cleaned;
  const m = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) throw new Error(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u0430\u044F \u0434\u0430\u0442\u0430 \u0434\u043B\u044F API: "${dateValue}"`);
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const h = m[4] !== void 0 ? Number(m[4]) : 0;
  const mi = m[5] !== void 0 ? Number(m[5]) : 0;
  const s = m[6] !== void 0 ? Number(m[6]) : 0;
  if (mo < 1 || mo > 12) throw new Error(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043C\u0435\u0441\u044F\u0446 \u0432 \u0434\u0430\u0442\u0435 \u0434\u043B\u044F API: "${dateValue}"`);
  const dim = new Date(y, mo, 0).getDate();
  if (d < 1 || d > dim) throw new Error(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0434\u0435\u043D\u044C \u0432 \u0434\u0430\u0442\u0435 \u0434\u043B\u044F API: "${dateValue}"`);
  if (h > 23 || mi > 59 || s > 59) throw new Error(`\u041D\u0435\u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F \u0432 \u0434\u0430\u0442\u0435 \u0434\u043B\u044F API: "${dateValue}"`);
  const at = new Date(y, mo - 1, d, h, mi, s);
  const p22 = (n) => String(n).padStart(2, "0");
  return `${m[1]}-${m[2]}-${m[3]}T${p22(h)}:${p22(mi)}:${p22(s)}${offsetStringFor(at)}`;
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
      if (!isNaN(n)) minutes.push(notifyToMinutes(n, m[2]?.toLowerCase()));
    } else {
      minutes.push(0);
    }
  }
  return minutes.sort((a, b) => b - a);
}

// src/domain/utils/duration-parser.ts
var VS = String.fromCharCode(65039) + "?";
var TOKEN = "\u23F1" + VS;
var DURATION_RE = new RegExp(TOKEN + "\\s*((?:\\d+\\s*[mhdMHD]\\s*)+)", "u");
var DURATION_GLOBAL_RE = new RegExp(TOKEN + "\\s*(?:\\d+\\s*[mhdMHD]\\s*)+", "gu");
var GROUP_RE = /(\d+)\s*([mhdMHD])/g;
var UNIT_MINUTES = { m: 1, h: 60, d: 1440 };
function parseDurationMinutes(text) {
  const match = text.match(DURATION_RE);
  if (!match) return null;
  let total = 0;
  let found = false;
  GROUP_RE.lastIndex = 0;
  let g;
  while ((g = GROUP_RE.exec(match[1])) !== null) {
    const unit = g[2].toLowerCase();
    total += parseInt(g[1], 10) * (UNIT_MINUTES[unit] ?? 0);
    found = true;
  }
  return found ? total : null;
}
function removeDuration(text) {
  return text.replace(DURATION_GLOBAL_RE, "").replace(/\s+/g, " ").trim();
}
function formatDuration(minutes) {
  const total = Math.max(0, Math.floor(minutes));
  const d = Math.floor(total / 1440);
  const h = Math.floor(total % 1440 / 60);
  const m = total % 60;
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || parts.length === 0) parts.push(`${m}m`);
  return `\u23F1 ${parts.join("")}`;
}

// src/domain/conflict-view.ts
var PRIORITY_EMOJI = {
  highest: "\u{1F53A}",
  high: "\u23EB",
  medium: "\u{1F53C}",
  low: "\u{1F53D}",
  lowest: "\u23EC"
};
var STATUS_LABEL = {
  todo: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430",
  done: "\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430",
  cancelled: "\u041E\u0442\u043C\u0435\u043D\u0435\u043D\u0430"
};
var STATUS_EMOJI = {
  todo: "\u25CB",
  done: "\u2705",
  cancelled: "\u274C"
};
var DASH = "\u2014";
function normalize(text) {
  if (!text) return "";
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}
function hasTime(value) {
  return /\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(value);
}
function parseLocal(value) {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (m[4] !== void 0) d.setHours(Number(m[4]), Number(m[5] ?? 0), Number(m[6] ?? 0), 0);
  return d;
}
function formatLocal(value) {
  if (!value) return null;
  const v = value.trim();
  if (!v || v === DASH) return null;
  let date = null;
  let withTime = false;
  if (/^\d{10,}$/.test(v)) {
    const num = Number(v);
    date = new Date(num < 1e12 ? num * 1e3 : num);
    withTime = true;
  } else if (hasTime(v)) {
    withTime = true;
    date = v.includes("T") ? new Date(v) : parseLocal(v);
  } else {
    date = parseLocal(v);
  }
  if (!date || isNaN(date.getTime())) return v;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  if (!withTime || date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0) {
    return `${dd}.${mm}.${yyyy}`;
  }
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} ${hh}:${mi}`;
}
function emojiForStatus(status) {
  return STATUS_EMOJI[status] ?? "\u25CB";
}
function visibleObTags(task) {
  return task.tags.filter((t) => !/^(todo|notify)(\/|$)/i.test(t)).map((t) => t.replace(/\s+/g, "_")).sort();
}
function notifyMinutesFromTask(task) {
  return extractNotifyMinutes(
    task.tags.filter((t) => /^notify/i.test(t)).map((t) => `#${t}`).join(" ")
  );
}
function buildConflictView(ob, sg, dbState) {
  const fields = [];
  const summary = [];
  const push = (key, label, obsidian, singularity, diff) => {
    fields.push({ key, label, obsidian, singularity: singularity ?? DASH, diff });
    if (diff && summary.indexOf(label) === -1) summary.push(label);
  };
  const obStatusKey = ob.status;
  const sgStatusKey = sg?.status ?? null;
  push(
    "status",
    "\u0421\u0442\u0430\u0442\u0443\u0441",
    `${emojiForStatus(obStatusKey)} ${STATUS_LABEL[obStatusKey] ?? obStatusKey}`,
    sg ? `${emojiForStatus(sgStatusKey)} ${STATUS_LABEL[sgStatusKey] ?? sgStatusKey}` : null,
    !!sg && sgStatusKey !== obStatusKey
  );
  const obPriority = ob.priority ? PRIORITY_EMOJI[ob.priority.toLowerCase()] ?? ob.priority.toLowerCase() : DASH;
  const sgPriority = sg ? sg.priorityEmoji || DASH : null;
  push("priority", "\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442", obPriority, sgPriority, !!sg && normalize(ob.priority ?? "") !== normalize(sg?.priorityKey ?? ""));
  const obProject = ob.projectTag ?? DASH;
  push("project", "\u041F\u0440\u043E\u0435\u043A\u0442", obProject, sg?.projectName ?? null, !!sg && normalize(obProject) !== normalize(sg.projectName));
  const obTags = visibleObTags(ob).join(", ") || DASH;
  const sgTags = sg && sg.tags.length ? [...sg.tags].sort().join(", ") : null;
  push("tags", "\u0422\u0435\u0433\u0438", obTags, sgTags, !!sg && normalize(obTags) !== normalize(sgTags ?? ""));
  const startSources = [ob.reminderDate, ob.startDate, ob.scheduledDate].filter(Boolean).map((d) => normalize(formatLocal(d)));
  const startMatches = !!sg?.start && startSources.includes(normalize(formatLocal(sg.start)));
  const dateRow = (key, label, obValue, sgValue, opts = {}) => {
    const obFmt = formatLocal(obValue) ?? DASH;
    const sgFmt = sg ? formatLocal(sgValue) ?? DASH : null;
    const obCompare = opts.dateOnly ? obFmt.split(" ")[0] : normalize(obFmt);
    const sgCompare = sg ? opts.dateOnly ? (formatLocal(sgValue) ?? "").split(" ")[0] : normalize(formatLocal(sgValue) ?? "") : "";
    let diff = false;
    if (sg) {
      const bothEmpty = !obValue && !sgValue;
      const equal = obCompare === sgCompare;
      if (opts.groupStart && sgValue) {
        diff = !bothEmpty && !startMatches && !equal;
      } else {
        diff = !bothEmpty && !equal;
      }
    }
    push(key, label, obFmt, sgFmt, diff);
  };
  dateRow("created", "\u2795 \u0421\u043E\u0437\u0434\u0430\u043D\u0430", ob.createdDate, sg?.createdDate ?? null, { dateOnly: true });
  dateRow("reminder", "\u23F0 \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435", ob.reminderDate, sg?.start ?? null, { groupStart: true });
  dateRow("start", "\u{1F6EB} \u041D\u0430\u0447\u0430\u043B\u043E", ob.startDate, sg?.start ?? null, { groupStart: true });
  dateRow("scheduled", "\u23F3 \u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0430", ob.scheduledDate, sg?.start ?? null, { groupStart: true });
  dateRow("due", "\u{1F4C5} \u0421\u0440\u043E\u043A", ob.dueDate, sg?.deadline ?? null);
  dateRow("done", "\u2705 \u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430", ob.doneDate, sg?.journalDate ?? null, { dateOnly: true });
  dateRow("cancelled", "\u274C \u041E\u0442\u043C\u0435\u043D\u0435\u043D\u0430", ob.cancelledDate, sg?.deleteDate ?? null, { dateOnly: true });
  const obNotifies = notifyMinutesFromTask(ob);
  const obNotifyStr = obNotifies.length ? obNotifies.map((n) => `#notify/${n}`).join(", ") : DASH;
  const sgNotifyStr = sg && sg.notifies.length ? sg.notifies.map((n) => `#notify/${n}`).join(", ") : null;
  push("notifies", "\u{1F514} \u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F", obNotifyStr, sgNotifyStr, !!sg && normalize(obNotifyStr) !== normalize(sgNotifyStr ?? ""));
  const obDur = ob.durationMinutes != null ? formatDuration(ob.durationMinutes) : DASH;
  const sgDur = sg ? sg.timeLength != null ? formatDuration(sg.timeLength) : null : null;
  push(
    "duration",
    "\u23F1 \u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
    obDur,
    sgDur,
    !!sg && (ob.durationMinutes ?? null) !== (sg.timeLength ?? null)
  );
  const obRec = ob.recurrenceRule ? `\u{1F501} ${ob.recurrenceRule}` : DASH;
  const sgRec = sg ? sg.recurrenceRule ? `\u{1F501} ${sg.recurrenceRule}` : null : null;
  push(
    "recurrence",
    "\u{1F501} \u041F\u043E\u0432\u0442\u043E\u0440\u0435\u043D\u0438\u0435",
    obRec,
    sgRec,
    !!sg && normalize(ob.recurrenceRule ?? "") !== normalize(sg.recurrenceRule ?? "")
  );
  const obModified = dbState?.lastModifiedObsidian ? formatLocal(dbState.lastModifiedObsidian) ?? DASH : DASH;
  const sgModified = sg?.modified ? formatLocal(sg.modified) ?? DASH : null;
  push("modified-ob", "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0432 Obsidian", obModified, null, false);
  push("modified-sg", "\u0418\u0437\u043C\u0435\u043D\u0435\u043D\u043E \u0432 Singularity", DASH, sgModified, false);
  const finalSummary = summary.filter((s) => !["\u23F0 \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435", "\u{1F6EB} \u041D\u0430\u0447\u0430\u043B\u043E", "\u23F3 \u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0430"].includes(s));
  const startDiff = fields.some((f) => ["reminder", "start", "scheduled"].includes(f.key) && f.diff);
  if (startDiff) finalSummary.unshift("\u23F0\u{1F6EB}\u23F3 \u041D\u0430\u0447\u0430\u043B\u043E");
  return { fields, summary: finalSummary };
}

// src/domain/recurrence.ts
var VS2 = String.fromCharCode(65039) + "?";
var RECURRENCE_RE = new RegExp(
  "\u{1F501}" + VS2 + "\\s*([A-Za-z0-9, !]+?)(?=\\s*(?:#|[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C\u23F0\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]|$))",
  "u"
);
var RECURRENCE_STRIP_RE = new RegExp(
  "\\s*\u{1F501}" + VS2 + "\\s*[A-Za-z0-9, !]+?(?=\\s*(?:#|[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C\u23F0\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]|$))",
  "gu"
);
function parseRecurrenceRule(text) {
  const m = text.match(RECURRENCE_RE);
  if (!m) return null;
  const rule = m[1].replace(/\s+/g, " ").trim();
  return rule || null;
}
function removeRecurrence(text) {
  return text.replace(RECURRENCE_STRIP_RE, "").replace(/\s+/g, " ").trim();
}
var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
function validDay(d) {
  return typeof d === "number" && Number.isInteger(d) && d >= 0 && d <= 6;
}
function validMonthDay(d) {
  return typeof d === "number" && Number.isInteger(d) && d >= 1 && d <= 31;
}
function validMonth(m) {
  return typeof m === "number" && Number.isInteger(m) && m >= 0 && m <= 11;
}
function validInterval(i) {
  return typeof i === "number" && Number.isInteger(i) && i >= 1;
}
function sgRecurrenceToRule(rec) {
  if (!rec || typeof rec !== "object") return null;
  const r = rec;
  if (r.paused) return null;
  const repeat = r.repeat;
  if (!repeat || typeof repeat !== "object") return null;
  let base = null;
  if (repeat.everyday && typeof repeat.everyday === "object") {
    const interval = repeat.everyday.interval ?? 1;
    if (!validInterval(interval)) return null;
    base = interval === 1 ? "every day" : `every ${interval} days`;
  } else if (repeat.everyweek && typeof repeat.everyweek === "object") {
    const w = repeat.everyweek;
    if (!validInterval(w.interval ?? 1)) return null;
    if (!Array.isArray(w.days) || w.days.length === 0 || !w.days.every(validDay)) return null;
    const names = w.days.map((d) => WEEKDAYS[d]).join(", ");
    base = w.interval === 1 ? `every week on ${names}` : `every ${w.interval} weeks on ${names}`;
  } else if (repeat.everymonth && typeof repeat.everymonth === "object") {
    const m = repeat.everymonth;
    if ((m.interval ?? 1) !== 1) return null;
    if (!Array.isArray(m.days) || m.days.length !== 1) return null;
    const dayNumber = m.days[0]?.dayNumber;
    if (!validMonthDay(dayNumber)) return null;
    base = `every month on the ${ordinal(dayNumber)}`;
  } else if (repeat.everyyear && typeof repeat.everyyear === "object") {
    const y = repeat.everyyear;
    const interval = y.interval ?? 1;
    if (!validInterval(interval)) return null;
    if (!Array.isArray(y.days) || y.days.length !== 1) return null;
    const dayNumber = y.days[0]?.dayNumber;
    if (!validMonthDay(dayNumber)) return null;
    const monthNumber = y.days[0]?.monthNumber;
    if (monthNumber === void 0 || monthNumber === null) {
      base = interval === 1 ? "every year" : `every ${interval} years`;
    } else {
      if (!validMonth(monthNumber) || interval !== 1) return null;
      base = `every ${MONTHS[monthNumber]} on the ${ordinal(dayNumber)}`;
    }
  } else {
    return null;
  }
  if (r.onlyOnComplete) base += " when done";
  return base;
}

// src/ui/conflict-modal.ts
var DASH2 = "\u2014";
var PRIORITY_EMOJI2 = {
  highest: "\u{1F53A}",
  high: "\u23EB",
  medium: "\u{1F53C}",
  low: "\u{1F53D}",
  lowest: "\u23EC"
};
var ConflictModal = class extends import_obsidian2.Modal {
  constructor(app, obsidianTask, singularityTask, dbState, options) {
    super(app);
    this.obsidianTask = obsidianTask;
    this.singularityTask = singularityTask;
    this.dbState = dbState;
    this.options = options;
    this.resolve = () => {
    };
    this.settled = false;
    this.sgMeta = null;
  }
  settle(choice) {
    if (this.settled) return;
    this.settled = true;
    this.resolve(choice);
    this.close();
  }
  async waitForChoice() {
    const sg = this.singularityTask;
    if (sg) {
      const checked = sg.checked ?? 0;
      const status = checked === 1 ? "done" : checked === 2 ? "cancelled" : "todo";
      const prio = mapPriorityFromSingularity(sg.priority);
      const priorityKey = prio ? prio.toLowerCase() : null;
      const priorityEmoji = priorityKey ? PRIORITY_EMOJI2[priorityKey] ?? priorityKey : DASH2;
      const tagNames = await Promise.all(
        (sg.tags ?? []).map(async (t) => {
          const name = await this.options.resolveTagName(t);
          return name ? name.replace(/\s+/g, "_") : t;
        })
      );
      const projName = sg.projectId ? await this.options.resolveProjectName(sg.projectId) : null;
      const groupName = sg.group && this.options.resolveGroupName ? await this.options.resolveGroupName(sg.group) : null;
      this.sgMeta = {
        title: sg.title ?? "",
        status,
        priorityKey,
        priorityEmoji,
        tags: tagNames,
        projectName: projName,
        groupName,
        createdDate: sg.createdDate ?? null,
        start: sg.start ?? null,
        deadline: sg.deadline ?? null,
        journalDate: sg.journalDate ?? null,
        deleteDate: sg.deleteDate ?? null,
        notifies: Array.isArray(sg.notifies) ? sg.notifies : [],
        modified: sg.modificatedDate ?? null,
        timeLength: typeof sg.timeLength === "number" ? sg.timeLength : null,
        recurrenceRule: sg.recurrence ? sgRecurrenceToRule(sg.recurrence) : null
      };
    }
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("singularity-conflict-modal");
    const isTitleMatch = this.options.reason === "title_match";
    const progress = this.options.progress;
    contentEl.createEl("h2", {
      text: (isTitleMatch ? "\u26A0\uFE0F \u041D\u0435\u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E\u0435 \u0441\u043E\u043F\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447" : "\u26A0\uFE0F \u041A\u043E\u043D\u0444\u043B\u0438\u043A\u0442 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438") + (progress ? ` \u2014 \u2116${progress.current}` : "")
    });
    contentEl.createEl("p", {
      text: isTitleMatch ? "\u0417\u0430\u0434\u0430\u0447\u0430 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 Singularity \u043F\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0443, \u043D\u043E \u0442\u043E\u0447\u043D\u0430\u044F \u043F\u0440\u0438\u0432\u044F\u0437\u043A\u0430 \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u043B\u044F \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435." : "\u0417\u0430\u0434\u0430\u0447\u0430 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0430 \u0432 \u043E\u0431\u0435\u0438\u0445 \u0441\u0438\u0441\u0442\u0435\u043C\u0430\u0445. \u0421\u0440\u0430\u0432\u043D\u0438\u0442\u0435 \u0432\u0435\u0440\u0441\u0438\u0438 \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u043A\u0430\u043A\u0443\u044E \u043F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C."
    });
    const view = buildConflictView(this.obsidianTask, this.sgMeta, this.dbState);
    if (!isTitleMatch && view.summary.length > 0) {
      const summaryEl = contentEl.createDiv({ cls: "singularity-conflict-summary" });
      summaryEl.createSpan({ cls: "singularity-conflict-summary-label", text: "\u0420\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F:" });
      for (const item of view.summary) {
        summaryEl.createSpan({ cls: "singularity-conflict-chip", text: `\u26A0\uFE0F ${item}` });
      }
    }
    const grid = contentEl.createDiv({ cls: "singularity-conflict-grid" });
    this.renderPanel(grid, "\u{1F4DD} Obsidian", true, view.fields);
    this.renderPanel(grid, "\u2601\uFE0F Singularity", false, view.fields);
    const buttons = [
      {
        text: "\u{1F4DD} Obsidian",
        hint: "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C Obsidian-\u0432\u0435\u0440\u0441\u0438\u044E \u0432 Singularity",
        cta: true,
        action: () => this.settle("obsidian")
      },
      {
        text: "\u2601\uFE0F Singularity",
        hint: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0432\u0435\u0440\u0441\u0438\u044E \u0438\u0437 Singularity \u2014 Obsidian \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0441\u044F \u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0441\u0438\u043D\u043A\u0435",
        action: () => this.settle("singularity")
      }
    ];
    if (isTitleMatch) {
      buttons.push({
        text: "\u2795 \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043D\u043E\u0432\u0443\u044E \u0432 Singularity",
        hint: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u0443\u044E \u0437\u0430\u0434\u0430\u0447\u0443, \u043D\u0435 \u0442\u0440\u043E\u0433\u0430\u044F \u043D\u0430\u0439\u0434\u0435\u043D\u043D\u0443\u044E",
        action: () => this.settle("new")
      });
    } else {
      buttons.push(
        {
          text: "\u{1F4DD} Obsidian \u0434\u043B\u044F \u0432\u0441\u0435\u0445",
          hint: "\u0417\u0430\u043F\u0438\u0441\u0430\u0442\u044C Obsidian-\u0432\u0435\u0440\u0441\u0438\u0438 \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0438 \u0432\u0441\u0435\u0445 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432",
          action: () => this.settle("obsidian_all")
        },
        {
          text: "\u2601\uFE0F Singularity \u0434\u043B\u044F \u0432\u0441\u0435\u0445",
          hint: "\u041F\u0440\u0438\u043C\u0435\u043D\u0438\u0442\u044C \u0432\u0435\u0440\u0441\u0438\u0438 Singularity \u0434\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u0438 \u0432\u0441\u0435\u0445 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u043A\u043E\u043D\u0444\u043B\u0438\u043A\u0442\u043E\u0432",
          action: () => this.settle("singularity_all")
        }
      );
    }
    buttons.push({
      text: "\u23ED\uFE0F \u041F\u0440\u043E\u043F\u0443\u0441\u0442\u0438\u0442\u044C",
      hint: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043C\u0435\u043D\u044F\u0442\u044C \u2014 \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u0440\u0438 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u0438",
      action: () => this.settle("skip")
    });
    const footer = contentEl.createDiv({ cls: "singularity-conflict-buttons" });
    for (const spec of buttons) {
      const wrapper = footer.createDiv({ cls: "singularity-conflict-button" });
      const btn = wrapper.createEl("button", {
        text: spec.text,
        cls: spec.cta ? "mod-cta" : spec.warning ? "mod-warning" : void 0
      });
      btn.onclick = spec.action;
      wrapper.createEl("span", { cls: "singularity-conflict-button-hint", text: spec.hint });
    }
  }
  renderPanel(container, title, isObsidian, fields) {
    const panel = container.createDiv({ cls: "singularity-conflict-panel" });
    panel.createEl("h3", { text: title });
    const ob = this.obsidianTask;
    const sg = this.singularityTask;
    if (isObsidian) {
      const titleEl = panel.createDiv({ cls: "singularity-conflict-task-title" });
      titleEl.setText(ob.description || "\u2014");
      const loc = panel.createDiv({ cls: "singularity-conflict-task-loc" });
      loc.setText(`${ob.filePath}:${ob.lineNumber}`);
    } else if (sg) {
      const titleEl = panel.createDiv({ cls: "singularity-conflict-task-title" });
      titleEl.setText(sg.title || "\u2014");
      const loc = panel.createDiv({ cls: "singularity-conflict-task-loc" });
      const locParts = [];
      if (this.sgMeta?.projectName) locParts.push(`\u041F\u0440\u043E\u0435\u043A\u0442: ${this.sgMeta.projectName}`);
      if (this.sgMeta?.groupName) locParts.push(`\u0421\u0435\u043A\u0446\u0438\u044F: ${this.sgMeta.groupName}`);
      loc.setText(locParts.length ? locParts.join(" \xB7 ") : "\u2014");
    } else {
      panel.createEl("p", { text: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445", cls: "singularity-view-empty" });
      return;
    }
    for (const field of fields) {
      const value = isObsidian ? field.obsidian : field.singularity;
      const row = panel.createDiv({
        cls: "singularity-conflict-row" + (field.diff ? " singularity-conflict-row-diff" : "")
      });
      row.createSpan({ cls: "singularity-conflict-row-label", text: field.label });
      row.createSpan({ cls: "singularity-conflict-row-value", text: value });
      if (field.diff) {
        const other = isObsidian ? field.singularity : field.obsidian;
        row.createSpan({ cls: "singularity-conflict-diff-badge", text: "\u26A0\uFE0F" });
        row.setAttr("title", `\u0420\u0430\u0441\u0445\u043E\u0434\u0438\u0442\u0441\u044F \u0441 \u0434\u0440\u0443\u0433\u043E\u0439 \u0432\u0435\u0440\u0441\u0438\u0435\u0439: ${other}`);
      }
    }
    const syncedAt = this.dbState?.lastSyncedAt ? formatLocal(this.dbState.lastSyncedAt) : null;
    if (syncedAt) {
      const info = panel.createDiv({ cls: "singularity-conflict-task-loc" });
      info.setText(`\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F: ${syncedAt}`);
    }
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (!this.settled) {
      this.settled = true;
      this.resolve("skip");
    }
  }
};

// src/adapters/singularity/api-client.ts
var import_obsidian4 = require("obsidian");

// src/ui/notify.ts
var import_obsidian3 = require("obsidian");
var lastShown = /* @__PURE__ */ new Map();
var WINDOW_MS = 15e3;
function notifyThrottled(text, timeoutMs = 8e3, key) {
  const k = key ?? text;
  const now = Date.now();
  const last = lastShown.get(k) ?? 0;
  if (now - last < WINDOW_MS) return;
  lastShown.set(k, now);
  new import_obsidian3.Notice(text, timeoutMs);
}

// src/adapters/singularity/api-client.ts
var SingularityAPIError = class extends Error {
  constructor(statusCode, message, response) {
    super(`Singularity API Error ${statusCode}: ${message}`);
    this.statusCode = statusCode;
    this.response = response;
    this.name = "SingularityAPIError";
  }
};
function toSyncTimestamp(value) {
  if (!value) return void 0;
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return void 0;
  return d.toISOString();
}
function isReadOnly(method) {
  return !method || method === "GET";
}
function isRetryable(statusCode, method) {
  if (statusCode === 400 || statusCode === 401 || statusCode === 403 || statusCode === 404) return false;
  if (isReadOnly(method)) return statusCode === 0 || statusCode === 429 || statusCode >= 500;
  return statusCode === 0;
}
function retryDelayMs(attempt) {
  const base = 500 * Math.pow(2, attempt - 1);
  return base + Math.floor(Math.random() * 250);
}
function sleepMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var SingularityAPIClient = class {
  constructor(config) {
    this._tagsCache = {};
    this._tagsLoaded = false;
    this._tagTitles = null;
    /** Resolve a group ID to its title (lazy full load, cached). */
    this._groupTitles = null;
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.headers = {
      Authorization: `Bearer ${config.apiKey}`,
      Accept: "application/json",
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
    const maxAttempts = isReadOnly(opts.method) ? 4 : 2;
    let attempt = 0;
    for (; ; ) {
      try {
        const resp = await (0, import_obsidian4.requestUrl)(req);
        return resp.json;
      } catch (e) {
        if (e instanceof SingularityAPIError) throw e;
        const match = e.message?.match(/(\d{3})/);
        const statusCode = match ? parseInt(match[1]) : 0;
        attempt++;
        if (attempt < maxAttempts && isRetryable(statusCode, opts.method)) {
          await sleepMs(retryDelayMs(attempt));
          continue;
        }
        if (!opts.quiet) {
          const maskedHeaders = { ...req.headers, Authorization: "***" };
          console.error(`[Singularity API] ${opts.method || "GET"} ${opts.path} \u2192 ${statusCode} url=${url} body=${JSON.stringify(opts.body)} error=${e.message} req=${JSON.stringify({ url: req.url, method: req.method, headers: maskedHeaders, contentType: req.contentType, bodyLength: req.body?.length })}`);
          notifyThrottled(`\u26A0\uFE0F API ${statusCode}: ${opts.method || "GET"} ${opts.path}`, 8e3);
        }
        throw new SingularityAPIError(statusCode, e.message || String(e));
      }
    }
  }
  get(path, params, quiet = false) {
    return this._req({ path, params, quiet });
  }
  post(path, body, quiet = false) {
    return this._req({ path, method: "POST", body, quiet });
  }
  patch(path, body, quiet = false) {
    return this._req({ path, method: "PATCH", body, quiet });
  }
  async _paginate(path, params, resultField, batchSize, opts, quiet = false) {
    const results = [];
    let offset = 0;
    const since = toSyncTimestamp(opts?.modifiedSince);
    const fields = opts?.fields?.trim() || void 0;
    while (true) {
      const data = await this.get(path, {
        ...params,
        maxCount: batchSize,
        offset,
        ...since ? { modifiedSince: since } : {},
        ...fields ? { fields } : {}
      }, quiet);
      const batch = data[resultField] ?? [];
      results.push(...batch);
      if (batch.length < batchSize) break;
      offset += batchSize;
    }
    return results;
  }
  /** Single cheap request returning the server-side total for a list
   * (paginationData block), used for honest "shown N of M" counters. */
  async getListTotal(path, params = {}) {
    try {
      const data = await this.get(path, { ...params, maxCount: 1, offset: 0, paginationData: true }, true);
      const total = data?.pagination?.total;
      return typeof total === "number" ? total : null;
    } catch {
      return null;
    }
  }
  async validateToken() {
    try {
      await this.get("/project", { maxCount: 1 });
      return true;
    } catch {
      return false;
    }
  }
  async getProjects(includeRemoved = false, includeArchived = false, batchSize = 100, opts) {
    return this._paginate("/project", { includeRemoved, includeArchived }, "projects", batchSize, opts);
  }
  async getTasks(includeRemoved = false, includeArchived = false, batchSize = 1e3, projectId, opts) {
    const params = { includeRemoved, includeArchived };
    if (projectId) params.projectId = projectId;
    return this._paginate("/task", params, "tasks", batchSize, opts);
  }
  async getTaskById(taskId) {
    try {
      return await this.get(`/task/${taskId}`, void 0, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async createTask(task) {
    return this.post("/task", this.toCreateBody(task));
  }
  /** Build the POST /task body (shared by single and batch creates). */
  toCreateBody(task) {
    const body = {
      title: task.title,
      state: 1,
      checked: task.checked ?? 0
    };
    if (task.priority !== void 0) body.priority = task.priority;
    if (task.note) body.note = task.note;
    if (task.projectId) body.projectId = task.projectId;
    if (task.deadline) {
      body.deadline = task.deadline;
      body.useTime = true;
    } else if (task.useTime) {
      body.useTime = true;
    }
    if (task.start) body.start = task.start;
    if (task.externalId) body.externalId = task.externalId;
    if (task.timeLength != null) body.timeLength = task.timeLength;
    if (task.tags?.length) body.tags = task.tags;
    if (task.notifies?.length) body.notifies = task.notifies;
    if (task.journalDate) body.journalDate = task.journalDate;
    if (task.deleteDate) body.deleteDate = task.deleteDate;
    if (task.parent != null) body.parent = task.parent;
    return body;
  }
  /**
   * Bulk-create tasks in one /batch call. Returns one entry per input (null
   * when that item failed even after the individual fallback), order kept.
   */
  async createTasksBatch(tasks) {
    if (tasks.length === 0) return [];
    if (tasks.length === 1) {
      try {
        return [await this.createTask(tasks[0])];
      } catch (e) {
        console.error(`[Singularity API] create failed:`, e?.message ?? e);
        return [null];
      }
    }
    const out = tasks.map(() => null);
    try {
      const { results } = await this.executeBatch(
        tasks.map((t, i) => ({ method: "POST", path: "/v2/task", body: this.toCreateBody(t), uuid: `c${i}` }))
      );
      const byUuid = new Map(results.map((r) => [r.uuid, r]));
      for (let i = 0; i < tasks.length; i++) {
        const r = byUuid.get(`c${i}`);
        if (r && r.status >= 200 && r.status < 300 && r.body?.id) out[i] = r.body;
      }
    } catch (e) {
      console.warn(`[Singularity API] batch create failed, falling back to individual:`, e?.message ?? e);
    }
    for (let i = 0; i < tasks.length; i++) {
      if (!out[i]) {
        try {
          out[i] = await this.createTask(tasks[i]);
        } catch (e) {
          console.error(`[Singularity API] fallback create failed:`, e?.message ?? e);
        }
      }
    }
    return out;
  }
  async updateTask(taskId, task) {
    const body = {};
    if (task.title !== void 0) body.title = task.title;
    if (task.note !== void 0) body.note = task.note;
    if (task.priority !== void 0) body.priority = task.priority;
    if (task.checked !== void 0) body.checked = task.checked;
    if (task.projectId != null) body.projectId = task.projectId;
    if (task.tags !== void 0) body.tags = task.tags;
    if (task.deadline != null) {
      body.deadline = task.deadline;
      body.useTime = true;
    } else if (task.useTime) {
      body.useTime = true;
    }
    if (task.start != null) body.start = task.start;
    if (task.timeLength != null) body.timeLength = task.timeLength;
    if (task.notifies !== void 0) body.notifies = task.notifies;
    if (task.journalDate != null) body.journalDate = task.journalDate;
    if (task.deleteDate != null) body.deleteDate = task.deleteDate;
    if (task.externalId !== void 0) body.externalId = task.externalId;
    if (task.parent != null) body.parent = task.parent;
    if (Object.keys(body).length === 0) throw new SingularityAPIError(400, "No fields to update");
    return this.patch(`/task/${taskId}`, body);
  }
  localDateString() {
    const now = /* @__PURE__ */ new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}T00:00:00${localOffsetString()}`;
  }
  async archiveTask(taskId, archiveDate) {
    try {
      const date = archiveDate ?? this.localDateString();
      return await this.post(`/task/${taskId}/archive`, { journalDate: date }, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  /** Semantic status transitions (POST actions). Idempotent: 404 → null.
   * Prefer these over raw PATCH checked=… when only the status flips. */
  async completeTask(taskId) {
    try {
      return await this.post(`/task/${taskId}/complete`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async uncompleteTask(taskId) {
    try {
      return await this.post(`/task/${taskId}/uncomplete`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async completeTaskToday(taskId) {
    try {
      return await this.post(`/task/${taskId}/complete-today`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async cancelTask(taskId) {
    try {
      return await this.post(`/task/${taskId}/cancel`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async unarchiveTask(taskId) {
    try {
      return await this.post(`/task/${taskId}/unarchive`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async moveTask(taskId, projectId) {
    try {
      return await this.post(`/task/${taskId}/move`, { projectId }, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async softDeleteTask(taskId, deleteDate) {
    try {
      const date = deleteDate ?? this.localDateString();
      return await this.patch(`/task/${taskId}`, { deleteDate: date }, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async deleteTask(taskId) {
    try {
      await this._req({ path: `/task/${taskId}`, method: "DELETE", quiet: true });
      return true;
    } catch (e) {
      if (e instanceof SingularityAPIError && (e.statusCode === 404 || e.statusCode === 204)) return false;
      throw e;
    }
  }
  async deleteProject(projectId) {
    try {
      return await this.patch(`/project/${projectId}`, { deleteDate: this.localDateString() }, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async getTags(batchSize = 100, includeRemoved = false, opts) {
    return this._paginate("/tag", { includeRemoved }, "tags", batchSize, opts);
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
    } catch (e) {
      console.warn(`[Singularity API] Failed to create tag "${title}":`, e?.message || e);
      return null;
    }
  }
  /** Resolve a tag ID to its display title (lazy full load, cached). */
  async getTagTitle(tagId) {
    if (!this._tagTitles) {
      this._tagTitles = {};
      const tags = await this.getTags(500);
      for (const t of tags) {
        if (t.id && t.title) this._tagTitles[t.id] = t.title;
      }
    }
    return this._tagTitles[tagId] ?? null;
  }
  async getProjectById(projectId) {
    try {
      return await this.get(`/project/${projectId}`, void 0, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async getNote(noteId) {
    try {
      return await this.get(`/note/${noteId}`, void 0, true);
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
  async getHabits(batchSize = 100, opts) {
    return this._paginate("/habit", {}, "habits", batchSize, opts);
  }
  /** All habit-progress records (paginated), for panels that need the full map. */
  async getAllHabitProgress(batchSize = 500) {
    const envelope = await this._paginateRaw("/habit-progress", {}, void 0, batchSize);
    const list = envelope.progressRecords ?? [];
    return Array.isArray(list) ? list : [];
  }
  // ===== Checklist items =====
  async getChecklistItems(parent, includeRemoved = false, batchSize = 500, opts) {
    const params = { includeRemoved };
    if (parent) params.parent = parent;
    return this._paginate("/checklist-item", params, "checklistItems", batchSize, opts);
  }
  async getChecklistItem(itemId) {
    try {
      return await this.get(`/checklist-item/${itemId}`, void 0, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async createChecklistItem(parent, title) {
    return this.post("/checklist-item", { parent, title });
  }
  async updateChecklistItem(itemId, data) {
    return this.patch(`/checklist-item/${itemId}`, data);
  }
  async checkChecklistItem(itemId) {
    try {
      return await this.post(`/checklist-item/${itemId}/check`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async uncheckChecklistItem(itemId) {
    try {
      return await this.post(`/checklist-item/${itemId}/uncheck`, {}, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  async deleteChecklistItem(itemId) {
    try {
      await this._req({ path: `/checklist-item/${itemId}`, method: "DELETE", quiet: true });
      return true;
    } catch (e) {
      if (e instanceof SingularityAPIError && (e.statusCode === 404 || e.statusCode === 204)) return false;
      throw e;
    }
  }
  // ===== Batch =====
  /** Execute a batch of REST operations in one request. Per-operation status
   * codes are in results — a 200 envelope does NOT mean every op succeeded. */
  async executeBatch(operations) {
    if (operations.length === 0) return { results: [] };
    const data = await this.post("/batch", { operations });
    return { results: data.results ?? [], tempIdMap: data.tempIdMap };
  }
  // ===== Kanban (read-only display for now; no drag-and-drop yet) =====
  async getKanbanStatuses(projectId, batchSize = 200, opts, quiet = false) {
    const params = {};
    if (projectId) params.projectId = projectId;
    return this._paginate("/kanban-status", params, "kanbanStatuses", batchSize, opts, quiet);
  }
  async getKanbanTaskLinks(taskId, batchSize = 500, opts, quiet = false) {
    const params = {};
    if (taskId) params.taskId = taskId;
    return this._paginate("/kanban-task-status", params, "kanbanTaskStatuses", batchSize, opts, quiet);
  }
  /** Move a task to a kanban column (used by future DnD; sidebar is read-only). */
  async changeTaskColumn(taskId, statusId) {
    try {
      return await this.post(`/task/${taskId}/change-column`, { statusId }, true);
    } catch (e) {
      if (e instanceof SingularityAPIError && e.statusCode === 404) return null;
      throw e;
    }
  }
  // ===== Task groups (sections, read-only for now) =====
  /** Time stats are display-only for now: one sweep (default last 30d),
   * grouped by relatedTaskId by the caller. No timer UI yet. */
  async getTimeStats(filter = {}, batchSize = 500, quiet = false) {
    const params = {};
    if (filter.relatedTaskId) params.relatedTaskId = filter.relatedTaskId;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom;
    if (filter.dateTo) params.dateTo = filter.dateTo;
    return this._paginate("/time-stat", params, "timeStats", batchSize, filter, quiet);
  }
  async createTimeStat(start, secondsPassed, relatedTaskId) {
    const body = { start, secondsPassed };
    if (relatedTaskId) body.relatedTaskId = relatedTaskId;
    return this.post("/time-stat", body);
  }
  async deleteTimeStat(statId) {
    try {
      await this._req({ path: `/time-stat/${statId}`, method: "DELETE", quiet: true });
      return true;
    } catch (e) {
      if (e instanceof SingularityAPIError && (e.statusCode === 404 || e.statusCode === 204)) return false;
      throw e;
    }
  }
  async getTaskGroups(parent, includeRemoved = false, batchSize = 200, opts, quiet = false) {
    const params = { includeRemoved };
    if (parent) params.parent = parent;
    return this._paginate("/task-group", params, "taskGroups", batchSize, opts, quiet);
  }
  async getTaskGroupTitle(groupId) {
    if (!this._groupTitles) {
      this._groupTitles = {};
      try {
        const groups = await this.getTaskGroups();
        for (const g of groups) {
          if (g.id && g.title) this._groupTitles[g.id] = g.title;
        }
      } catch {
        return null;
      }
    }
    return this._groupTitles[groupId] ?? null;
  }
  async getHabitProgress(habitId, opts) {
    try {
      const data = await this._paginateRaw("/habit-progress", { habit: habitId }, opts);
      const list = Array.isArray(data) ? data : data.progressRecords ?? data.progress ?? [];
      return list.filter((p) => p.habit === habitId || !p.habit);
    } catch {
      return [];
    }
  }
  /** Paginated fetch returning the raw envelope (for endpoints whose list
   * field differs or needs post-filtering). */
  async _paginateRaw(path, params, opts, batchSize = 500) {
    const merged = [];
    let offset = 0;
    const since = toSyncTimestamp(opts?.modifiedSince);
    const fields = opts?.fields?.trim() || void 0;
    let envelope = null;
    while (true) {
      envelope = await this.get(path, {
        ...params,
        maxCount: batchSize,
        offset,
        ...since ? { modifiedSince: since } : {},
        ...fields ? { fields } : {}
      });
      const batch = envelope.progressRecords ?? envelope.progress ?? envelope.habits ?? [];
      if (!Array.isArray(batch) || batch.length === 0) break;
      merged.push(...batch);
      if (batch.length < batchSize) break;
      offset += batchSize;
    }
    return { ...envelope, progressRecords: merged, progress: merged };
  }
  async setHabitProgress(habitId, date, progress) {
    const dateKey = date.replace(/-/g, "");
    try {
      await this.patch(`/habit-progress/HDP-${habitId}-${dateKey}`, { progress }, true);
    } catch (e) {
      if (e.statusCode === 404) {
        try {
          await this.post("/habit-progress", { habit: habitId, date, progress }, true);
        } catch (e2) {
          if (e2.statusCode === 404) {
            throw new Error("API-\u043A\u043B\u044E\u0447 \u043D\u0435 \u0438\u043C\u0435\u0435\u0442 \u043F\u0440\u0430\u0432 \u043D\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0430\u043C\u0438. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0442\u043E\u043A\u0435\u043D \u0432 \u043B\u0438\u0447\u043D\u043E\u043C \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435 Singularity.");
          }
          throw e2;
        }
      } else {
        throw e;
      }
    }
  }
};

// src/ui/singularity-view.ts
var import_obsidian5 = require("obsidian");

// src/domain/timer-log.ts
var TIMER_LOG_CAP = 100;
var p2 = (n) => String(n).padStart(2, "0");
function formatClock(d) {
  return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
function formatClockIso(iso) {
  return formatClock(new Date(iso));
}
function todayLocalDate(d = /* @__PURE__ */ new Date()) {
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
function formatElapsedDetail(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor(s % 3600 / 60);
  const sec = s % 60;
  if (h > 0) return `${h}\u0447 ${m}\u043C`;
  if (m > 0) return `${m}\u043C ${sec}\u0441`;
  return `${sec}\u0441`;
}
function formatLogLine(e) {
  return `${e.date} \xB7 ${e.title} \xB7 ${e.start} \u2192 ${e.end} \xB7 ${formatElapsedDetail(e.minutes * 60)}`;
}
function appendLog(log, entry) {
  if (!entry || !entry.taskId || !entry.start || !entry.end) return log;
  return [entry, ...log].slice(0, TIMER_LOG_CAP);
}

// src/ui/singularity-view.ts
var SINGULARITY_VIEW_TYPE = "singularity-tasks-view";
var DAY_MS = 864e5;
function fmtLocal(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
var WEEKDAYS2 = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];
function fmtTracked(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}\u0447 ${m}\u043C`;
  return `${m}\u043C`;
}
function projectLabel(p) {
  const name = p.title || p.id || "\u2014";
  return p.isNotebook ? `\u{1F4D3} ${name}` : name;
}
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
var SingularityTaskView = class extends import_obsidian5.ItemView {
  constructor(leaf) {
    super(leaf);
    this.apiClient = null;
    this.tasks = [];
    this.tasksTotal = null;
    this.projects = [];
    this.groupNames = {};
    /** Tracked seconds per SG task id over the displayed window. */
    this.timeByTask = {};
    /** Kanban column name per SG task id. */
    this.kanbanByTask = {};
    /** Kanban status id per SG task id (for moves). */
    this.kanbanLinkByTask = {};
    /** Kanban columns per project id. */
    this.kanbanColumns = {};
    this.habits = [];
    this.habitsProgress = {};
    // habitId → date → progress (1/2)
    this.activeTab = "tasks";
    this.habitDaysCount = 14;
    this.taskExcludeTags = "";
    this.selectedProject = "";
    this.onStateChange = null;
    this.onTaskCheck = null;
    this.onTimerToggle = null;
    this.activeTimerTaskId = null;
    this.activeTimerStartIso = null;
    this.localOnlyTimer = false;
    this.onGetTimerLog = null;
    this.onClearTimerLog = null;
    this.ticker = null;
    this.activeTimerBadge = null;
    /** Session-level skip list for decoration sweeps the token may not access. */
    this.noScopeSweeps = /* @__PURE__ */ new Set();
  }
  onunload() {
    this.stopTicker();
  }
  stopTicker() {
    if (this.ticker) {
      clearInterval(this.ticker);
      this.ticker = null;
    }
    this.activeTimerBadge = null;
  }
  setStateChangeCallback(cb) {
    this.onStateChange = cb;
  }
  setTaskCheckCallback(cb) {
    this.onTaskCheck = cb;
  }
  setTimerToggleCallback(cb) {
    this.onTimerToggle = cb;
  }
  setTimerLogCallbacks(getLog, clearLog) {
    this.onGetTimerLog = getLog;
    this.onClearTimerLog = clearLog;
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
  /**
   * Best-effort decoration sweep: quiet, never throws. First 403 disables
   * the sweep for the session with one actionable Notice (token scope).
   */
  async sweep(key, label, fn, fallback) {
    if (this.noScopeSweeps.has(key)) return fallback;
    try {
      return await fn();
    } catch (e) {
      if (e?.statusCode === 403) {
        this.noScopeSweeps.add(key);
        new import_obsidian5.Notice(`\u26A0\uFE0F \u041D\u0435\u0442 \u043F\u0440\u0430\u0432 \u0442\u043E\u043A\u0435\u043D\u0430: ${label}. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 scope \u0432 \u043A\u0430\u0431\u0438\u043D\u0435\u0442\u0435 Singularity.`, 8e3);
      }
      return fallback;
    }
  }
  async refresh() {
    if (!this.apiClient) return;
    const client = this.apiClient;
    try {
      this.projects = await client.getProjects(false, false, 50);
      this.tasks = await client.getTasks(false, false, 200);
      this.tasksTotal = await client.getListTotal("/task", { includeArchived: false });
      const groups = await this.sweep("groups", "\u0441\u0435\u043A\u0446\u0438\u0438", () => client.getTaskGroups(void 0, false, 200, void 0, true), []);
      this.groupNames = {};
      for (const g of groups) {
        if (g.id && g.title) this.groupNames[g.id] = g.title;
      }
      const [statuses, links] = await this.sweep("kanban", "\u043A\u0430\u043D\u0431\u0430\u043D", () => Promise.all([
        client.getKanbanStatuses(void 0, 200, void 0, true),
        client.getKanbanTaskLinks(void 0, 500, void 0, true)
      ]), [[], []]);
      const names = {};
      this.kanbanColumns = {};
      for (const s of statuses) {
        if (s.id && s.name) {
          names[s.id] = s.name;
          if (s.projectId) {
            if (!this.kanbanColumns[s.projectId]) this.kanbanColumns[s.projectId] = [];
            this.kanbanColumns[s.projectId].push({ id: s.id, name: s.name });
          }
        }
      }
      this.kanbanByTask = {};
      this.kanbanLinkByTask = {};
      for (const l of links) {
        if (l.taskId && l.statusId && names[l.statusId]) {
          this.kanbanByTask[l.taskId] = names[l.statusId];
          this.kanbanLinkByTask[l.taskId] = l.statusId;
        }
      }
      const from = new Date(Date.now() - 30 * 864e5).toISOString().split("T")[0];
      const stats = await this.sweep("time", "\u0442\u0440\u0435\u043A\u0438\u043D\u0433 \u0432\u0440\u0435\u043C\u0435\u043D\u0438", () => client.getTimeStats({ dateFrom: from }, 500, true), []);
      this.timeByTask = {};
      for (const s of stats) {
        const tid = s.relatedTaskId;
        const secs = Number(s.secondsPassed ?? 0);
        if (tid && secs > 0) this.timeByTask[tid] = (this.timeByTask[tid] ?? 0) + secs;
      }
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
    this.stopTicker();
    contentEl.empty();
    const header = contentEl.createDiv("singularity-view-header");
    header.createEl("h3", { text: "Singularity" });
    const tabs = contentEl.createDiv("singularity-view-tabs");
    const tasksTab = tabs.createEl("span", { text: "\u{1F4CB} \u0417\u0430\u0434\u0430\u0447\u0438", cls: "singularity-view-tab" });
    const habitsTab = tabs.createEl("span", { text: "\u2705 \u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438", cls: "singularity-view-tab" });
    const timerTab = tabs.createEl("span", { text: "\u23F1 \u0416\u0443\u0440\u043D\u0430\u043B", cls: "singularity-view-tab" });
    if (this.activeTab === "tasks") tasksTab.addClass("active");
    else if (this.activeTab === "habits") habitsTab.addClass("active");
    else timerTab.addClass("active");
    tasksTab.onclick = () => {
      this.activeTab = "tasks";
      this.render();
    };
    habitsTab.onclick = () => {
      this.activeTab = "habits";
      this.render();
    };
    timerTab.onclick = () => {
      this.activeTab = "timer";
      this.render();
    };
    if (this.activeTab === "tasks") this.renderTasks(contentEl);
    else if (this.activeTab === "habits") this.renderHabits(contentEl);
    else this.renderTimerLog(contentEl);
    this.maybeStartTicker();
  }
  liveTimerText() {
    const start = new Date(this.activeTimerStartIso ?? Date.now());
    const secs = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1e3));
    const p = (n) => String(n).padStart(2, "0");
    return `\u23F9 ${p(start.getHours())}:${p(start.getMinutes())} \xB7 ${fmtTracked(secs)}`;
  }
  updateLiveBadge() {
    if (this.activeTimerBadge) this.activeTimerBadge.setText(this.liveTimerText());
  }
  maybeStartTicker() {
    if (!this.activeTimerBadge || !this.activeTimerStartIso) return;
    this.updateLiveBadge();
    this.ticker = setInterval(() => this.updateLiveBadge(), 3e4);
  }
  async copyText(text) {
    try {
      const nav = globalThis?.navigator;
      if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(text);
        return true;
      }
    } catch {
    }
    return false;
  }
  // =========== TIMER JOURNAL ===========
  renderTimerLog(container) {
    const entries = this.onGetTimerLog ? this.onGetTimerLog() : [];
    const list = container.createDiv("singularity-view-list");
    if (entries.length === 0) {
      list.createEl("p", { text: "\u23F1 \u0416\u0443\u0440\u043D\u0430\u043B \u043F\u0443\u0441\u0442 \u2014 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 \u0442\u0430\u0439\u043C\u0435\u0440, \u0438 \u0441\u0435\u0441\u0441\u0438\u044F \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C", cls: "singularity-view-empty" });
      return;
    }
    for (const e of entries) {
      const line = formatLogLine(e);
      const row = list.createDiv("singularity-view-timer-row");
      const textInput = row.createEl("input", {
        type: "text",
        cls: "singularity-view-timer-line",
        attr: { readonly: true }
      });
      textInput.value = line;
      textInput.onclick = () => {
        textInput.select();
      };
      const copy = row.createEl("button", {
        text: "\u{1F4CB}",
        cls: "singularity-view-copy-btn",
        attr: { title: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443" }
      });
      copy.onclick = async () => {
        if (await this.copyText(line)) new import_obsidian5.Notice("\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E");
        else new import_obsidian5.Notice("\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u0441\u0442\u0440\u043E\u043A\u0443 \u0438 \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u0432\u0440\u0443\u0447\u043D\u0443\u044E", 4e3);
      };
    }
    const footer = list.createDiv("singularity-view-timer-footer");
    const clear = footer.createEl("button", { text: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B" });
    let armed = false;
    let armTimer = null;
    clear.onclick = async () => {
      if (!this.onClearTimerLog) return;
      if (!armed) {
        armed = true;
        clear.setText("\u0422\u043E\u0447\u043D\u043E \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C?");
        armTimer = setTimeout(() => {
          armed = false;
          clear.setText("\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0436\u0443\u0440\u043D\u0430\u043B");
        }, 5e3);
        return;
      }
      if (armTimer) clearTimeout(armTimer);
      await this.onClearTimerLog();
      this.render();
    };
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
    const projById = {};
    for (const p of this.projects) {
      const name = p.title || p.id || "\u2014";
      projMap[p.id] = name;
      projById[p.id] = p;
      filter.createEl("option", { text: projectLabel(p), value: p.id });
    }
    filter.value = this.selectedProject;
    filter.onchange = () => {
      this.selectedProject = filter.value;
      this.render();
    };
    let filtered = this.selectedProject ? this.tasks.filter((t) => t.projectId === this.selectedProject) : this.tasks;
    filtered = filtered.filter((t) => !t.isNote);
    if (excludedList.length > 0) {
      filtered = filtered.filter((t) => {
        const tagIds = t.tags ?? [];
        const tagNames = tagIds.map((id) => id.replace(/^A-/, "").toLowerCase());
        return !excludedList.some((ex) => tagNames.includes(ex));
      });
    }
    const list = container.createDiv("singularity-view-list");
    const counter = list.createDiv({ cls: "singularity-view-counter" });
    counter.setText(
      this.tasksTotal != null ? `\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ${filtered.length} \u0438\u0437 ${this.tasksTotal} (\u043F\u0430\u043D\u0435\u043B\u044C: \u043F\u0435\u0440\u0432\u044B\u0435 200)` : `\u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E ${filtered.length}`
    );
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
      const proj = projById[projId];
      const projName = projId === "__no_project" ? "\u{1F4E5} \u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435" : projMap[projId] || projId;
      const groupEl = list.createDiv("singularity-view-group");
      const h4 = groupEl.createEl("h4");
      if (proj?.color) {
        const dot = h4.createSpan({ cls: "singularity-view-projdot" });
        dot.style.background = String(proj.color);
        dot.style.backgroundColor = String(proj.color);
      }
      h4.appendText(projName);
      for (const task of tasks) {
        const item = groupEl.createDiv("singularity-view-task");
        const done = task.checked === 1;
        const cb = item.createEl("input", { type: "checkbox" });
        cb.checked = done;
        cb.onclick = async () => {
          if (!this.apiClient) {
            cb.checked = done;
            return;
          }
          cb.disabled = true;
          try {
            if (cb.checked) await this.apiClient.completeTask(task.id);
            else await this.apiClient.uncompleteTask(task.id);
            if (this.onTaskCheck) await this.onTaskCheck(task.id, cb.checked, task.title || "");
            new import_obsidian5.Notice(cb.checked ? "\u2705 \u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E" : "\u21A9\uFE0F \u0412\u043E\u0437\u0432\u0440\u0430\u0449\u0435\u043D\u043E");
            await this.refresh();
          } catch {
            cb.checked = done;
            new import_obsidian5.Notice("\u26A0\uFE0F \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443", 4e3);
          } finally {
            cb.disabled = false;
          }
        };
        item.createSpan({ text: (task.parent ? "\u21B3 " : "") + (task.title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)"), cls: done ? "singularity-view-task-done" : "" });
        if (task.recurrence) {
          const rule = sgRecurrenceToRule(task.recurrence) ?? "";
          item.createSpan({ text: " \u{1F501}", cls: "singularity-view-task-recurrence", attr: { title: rule || "\u041F\u043E\u0432\u0442\u043E\u0440\u044F\u044E\u0449\u0430\u044F\u0441\u044F \u0437\u0430\u0434\u0430\u0447\u0430" } });
        }
        if (task.group && this.groupNames[task.group]) {
          item.createSpan({ text: ` \u{1F4C2} ${this.groupNames[task.group]}`, cls: "singularity-view-task-group" });
        }
        if (this.timeByTask[task.id] && !this.localOnlyTimer) {
          item.createSpan({ text: ` \u23F3 ${fmtTracked(this.timeByTask[task.id])}`, cls: "singularity-view-task-time" });
        }
        if (this.onTimerToggle && this.activeTimerTaskId === task.id && this.activeTimerStartIso) {
          const badge = item.createSpan({ cls: "singularity-view-timer-live" });
          badge.setText(this.liveTimerText());
          this.activeTimerBadge = badge;
        }
        if (this.kanbanByTask[task.id]) {
          item.createSpan({ text: ` \u25A6 ${this.kanbanByTask[task.id]}`, cls: "singularity-view-task-kanban" });
        }
        const columns = task.projectId ? this.kanbanColumns[task.projectId] ?? [] : [];
        if (this.apiClient && columns.length > 1) {
          const colSelect = item.createEl("select", { cls: "singularity-view-kanban-select" });
          for (const c of columns) {
            colSelect.createEl("option", { text: c.name, value: c.id });
          }
          colSelect.value = this.kanbanLinkByTask[task.id] ?? columns[0].id;
          colSelect.onchange = async () => {
            const target = colSelect.value;
            colSelect.disabled = true;
            try {
              await this.apiClient.changeTaskColumn(task.id, target);
              new import_obsidian5.Notice(`\u25A6 ${task.title || "\u0417\u0430\u0434\u0430\u0447\u0430"} \u2192 ${this.kanbanColumns[task.projectId].find((c) => c.id === target)?.name ?? target}`);
              await this.refresh();
            } catch {
              new import_obsidian5.Notice("\u26A0\uFE0F \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0443", 4e3);
              colSelect.value = this.kanbanLinkByTask[task.id] ?? colSelect.value;
            } finally {
              colSelect.disabled = false;
            }
          };
        }
        if (this.onTimerToggle) {
          const running = this.activeTimerTaskId === task.id;
          const timerBtn = item.createEl("button", {
            text: running ? "\u23F9" : "\u25B6",
            cls: "singularity-view-timer-btn" + (running ? " running" : ""),
            attr: { title: running ? "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u0440\u0435\u043A\u0438\u043D\u0433" : "\u041D\u0430\u0447\u0430\u0442\u044C \u0442\u0440\u0435\u043A\u0438\u043D\u0433" }
          });
          timerBtn.onclick = async () => {
            timerBtn.disabled = true;
            try {
              await this.onTimerToggle(task.id, task.title || "");
            } finally {
              timerBtn.disabled = false;
            }
          };
        }
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
      const data = await this.apiClient.getAllHabitProgress();
      for (const p of data) {
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
    for (let i = this.habitDaysCount - 1; i >= 0; i--) {
      const d = new Date(today.getTime() - i * DAY_MS);
      days.push({
        date: fmtLocal(d),
        dow: WEEKDAYS2[d.getDay()],
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
            new import_obsidian5.Notice(`\u274C ${e.message}`, 3e3);
          }
        };
      }
    }
  }
};

// src/ui/habits-inline.ts
var import_obsidian6 = require("obsidian");
var DAY_MS2 = 864e5;
var WEEKDAYS3 = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];
var COLORS2 = {
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
function fmtLocal2(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function parseHabitsBlock(source) {
  const lines = source.split("\n");
  let days = 14;
  const habitNames = [];
  let mode = "all";
  for (const line of lines) {
    const t = line.trim();
    const daysMatch = t.match(/^days:\s*(\d+)$/i);
    if (daysMatch) {
      const parsed = parseInt(daysMatch[1], 10);
      if (parsed > 0) days = parsed;
      continue;
    }
    const itemMatch = t.match(/^-\s*(.+)$/);
    if (itemMatch) {
      const name = itemMatch[1].trim();
      if (name.toLowerCase() === "all") {
        mode = "all";
      } else {
        mode = "filter";
        habitNames.push(name);
      }
    }
  }
  return { days, mode, habitNames };
}
function renderHabitsInline(container, apiClient, habits, habitsProgress, config, onCellChanged) {
  container.empty();
  container.removeClass("singularity-habits-loading");
  let filtered = habits;
  if (config.mode === "filter" && config.habitNames.length > 0) {
    const lower = config.habitNames.map((n) => n.toLowerCase());
    filtered = habits.filter(
      (h) => lower.includes((h.title || "").toLowerCase())
    );
  }
  if (filtered.length === 0) {
    container.createEl("p", {
      text: "\u2705 \u041D\u0435\u0442 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A",
      cls: "singularity-view-empty"
    });
    return;
  }
  const today = /* @__PURE__ */ new Date();
  const days = [];
  for (let i = config.days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY_MS2);
    days.push({
      date: fmtLocal2(d),
      dow: WEEKDAYS3[d.getDay()],
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }
  const wrapper = container.createDiv("singularity-habits-wrapper");
  const scrollEl = wrapper.createDiv("singularity-habits-scroll");
  const headerRow = scrollEl.createDiv("singularity-habits-row");
  headerRow.createSpan({ text: "Singularity habits", cls: "singularity-habits-label" });
  for (const day of days) {
    const dayNum = parseInt(day.date.split("-")[2], 10);
    headerRow.createSpan({
      text: `${dayNum}
${day.dow}`,
      cls: `singularity-habits-day-header${day.isWeekend ? " singularity-habits-weekend" : ""}`
    });
  }
  for (const habit of filtered) {
    const row = scrollEl.createDiv("singularity-habits-row");
    const labelCell = row.createDiv("singularity-habits-label");
    const color = COLORS2[habit.color] || habit.color || "#888";
    labelCell.setAttr("style", `border-left:3px solid ${color};padding-left:6px`);
    labelCell.createSpan({ text: habit.title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)" });
    row.setAttr("data-habit-color", color);
    const progress = habitsProgress[habit.id] || {};
    for (const day of days) {
      const status = progress[day.date] || 0;
      const cellCls = status === 2 ? "singularity-habits-cell singularity-habits-cell-full" : status === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
      const cell = row.createDiv({ cls: cellCls });
      if (status === 2) cell.setAttr("style", `background:${color}`);
      else if (status === 1) cell.setAttr("style", `background:${color}55`);
      const hid = habit.id;
      const date = day.date;
      cell.setAttr("data-habit-id", hid);
      cell.setAttr("data-date", date);
      cell.onclick = async () => {
        const cur = progress[date] || 0;
        const next = cur === 0 ? 2 : cur === 2 ? 1 : 0;
        progress[date] = next;
        cell.className = next === 2 ? "singularity-habits-cell singularity-habits-cell-full" : next === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
        if (next === 2) cell.setAttr("style", `background:${color}`);
        else if (next === 1) cell.setAttr("style", `background:${color}55`);
        else cell.setAttr("style", "");
        try {
          await apiClient.setHabitProgress(hid, date, next);
          onCellChanged?.();
        } catch (e) {
          progress[date] = cur;
          cell.className = cur === 2 ? "singularity-habits-cell singularity-habits-cell-full" : cur === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
          if (cur === 2) cell.setAttr("style", `background:${color}`);
          else if (cur === 1) cell.setAttr("style", `background:${color}55`);
          else cell.setAttr("style", "");
          new import_obsidian6.Notice(`\u274C ${e.message}`, 3e3);
        }
      };
    }
  }
}
function updateCellsFromProgress(container, habitsProgress) {
  const cells = container.querySelectorAll("[data-habit-id][data-date]");
  for (const cell of cells) {
    const hid = cell.getAttribute("data-habit-id");
    const date = cell.getAttribute("data-date");
    const row = cell.closest("[data-habit-color]");
    const color = row?.getAttribute("data-habit-color") || "#888";
    const status = habitsProgress[hid]?.[date] || 0;
    cell.className = status === 2 ? "singularity-habits-cell singularity-habits-cell-full" : status === 1 ? "singularity-habits-cell singularity-habits-cell-half" : "singularity-habits-cell";
    if (status === 2) cell.setAttr("style", `background:${color}`);
    else if (status === 1) cell.setAttr("style", `background:${color}55`);
    else cell.setAttr("style", "");
  }
}
function registerHabitsPostProcessor(plugin) {
  plugin.registerMarkdownCodeBlockProcessor(
    "singularity-habits",
    async (source, el) => {
      const config = parseHabitsBlock(source);
      el.addClass("singularity-habits-inline", "singularity-habits-loading");
      el.setText("\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A...");
      const apiClient = plugin.getApiClient();
      if (!apiClient) {
        el.setText("\u274C API \u043A\u043B\u044E\u0447 \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D");
        el.removeClass("singularity-habits-loading");
        el.addClass("singularity-habits-error");
        return;
      }
      const oldRefresh = el.__habitsRefresh;
      if (oldRefresh) plugin.offHabitsChanged(oldRefresh);
      try {
        const [habits, progressData] = await Promise.all([
          apiClient.getHabits(100),
          apiClient.get("/habit-progress", { maxCount: 500 })
        ]);
        const list = Array.isArray(progressData) ? progressData : progressData.progressRecords ?? progressData.progress ?? [];
        const habitsProgress = {};
        for (const p of list) {
          const hid = p.habit;
          if (!habitsProgress[hid]) habitsProgress[hid] = {};
          habitsProgress[hid][p.date] = p.progress ?? 0;
        }
        const refreshFn = async () => {
          try {
            const fresh = await apiClient.get("/habit-progress", { maxCount: 500 });
            const list2 = Array.isArray(fresh) ? fresh : fresh.progressRecords ?? fresh.progress ?? [];
            for (const p of list2) {
              if (!habitsProgress[p.habit]) habitsProgress[p.habit] = {};
              habitsProgress[p.habit][p.date] = p.progress ?? 0;
            }
            updateCellsFromProgress(el, habitsProgress);
          } catch {
          }
        };
        el.__habitsRefresh = refreshFn;
        plugin.onHabitsChanged(refreshFn);
        renderHabitsInline(el, apiClient, habits, habitsProgress, config, () => {
          plugin.refreshSingularityView();
          plugin.emitHabitsChanged();
        });
      } catch (e) {
        el.setText(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438: ${e.message}`);
        el.removeClass("singularity-habits-loading");
        el.addClass("singularity-habits-error");
      }
    }
  );
}

// src/adapters/obsidian/vault-reader.ts
var import_obsidian7 = require("obsidian");

// src/domain/utils/date-parser.ts
var VS3 = String.fromCharCode(65039) + "?";
var EMOJI_DATE_PATTERNS = {
  due: new RegExp("\u{1F4C5}" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2})?)", "u"),
  scheduled: new RegExp("\u23F3" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2})?)", "u"),
  start: new RegExp("\u{1F6EB}" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2})?)", "u"),
  created: new RegExp("\u2795" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2}(?::\\d{2})?)?)", "u"),
  done: new RegExp("\u2705" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2}(?::\\d{2})?)?)", "u"),
  cancelled: new RegExp("\u274C" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2}(?::\\d{2})?)?)", "u"),
  reminder: new RegExp("\u23F0" + VS3 + "\\s*(\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2})?)", "u")
};
function parseEmojiDates(text) {
  const result = {
    due: null,
    scheduled: null,
    start: null,
    created: null,
    done: null,
    cancelled: null,
    reminder: null
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
    result = result.replace(new RegExp(pattern.source, "gu"), "");
  }
  return result.replace(/\s+/g, " ").trim();
}
var EMOJI_DATE_RE = new RegExp(
  "[\u{1F4C5}\u23F3\u{1F6EB}\u2795\u2705\u274C\u23F0]" + VS3 + "\\s*\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2}(?::\\d{2})?)?",
  "gu"
);

// src/domain/parser.ts
var VS4 = String.fromCharCode(65039) + "?";
var TASK_LINE_RE = /^\s*-\s*\[(?<status>[ xX-])\]\s*(?<content>.+)$/;
var PRIORITY_RE = new RegExp("([\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC])" + VS4, "u");
var PRIORITY_MAP = {
  "\u{1F53A}": "high" /* High */,
  "\u23EB": "high" /* High */,
  "\u{1F53C}": "medium" /* Medium */,
  "\u{1F53D}": "low" /* Low */,
  "\u23EC": "lowest" /* Lowest */
};
var PRIORITY_STRIP_RE = new RegExp("[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]" + VS4, "gu");
var ALL_EMOJI_RE = new RegExp("[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C\u23F0]" + VS4, "gu");
var ALL_EMOJI_DATE_RE = new RegExp(
  "[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C\u23F0]" + VS4 + "\\s*\\d{4}-\\d{2}-\\d{2}(?:\\s+\\d{2}:\\d{2})?",
  "gu"
);
var ALL_TAGS_RE = /#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g;
function parseIndentDepth(line) {
  const m = line.match(/^(\s*)-/);
  if (!m || m[1].length === 0) return 0;
  const tabs = (m[1].match(/\t/g) ?? []).length;
  const spaces = m[1].length - tabs;
  return Math.max(1, tabs + Math.floor(spaces / 2));
}
function generateTaskId(filePath, _lineNumber, content, depth = 0) {
  let desc = removeRecurrence(removeDuration(content)).replace(ALL_EMOJI_DATE_RE, "").replace(ALL_EMOJI_RE, "").replace(ALL_TAGS_RE, "").replace(/-\s*\[\s*[ xX-]\s*\]\s*#todo\s*/g, "").replace(/\s+/g, " ").trim();
  const key = depth > 0 ? `${filePath}:>${depth}:${desc}` : `${filePath}:${desc}`;
  return hash53(key);
}
function computeStableHash(_filePath, content, depth = 0) {
  let desc = removeRecurrence(removeDuration(content)).replace(ALL_EMOJI_DATE_RE, "").replace(ALL_EMOJI_RE, "").replace(ALL_TAGS_RE, "").replace(/-\s*\[\s*[ xX-]\s*\]\s*#todo\s*/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return hash53(depth > 0 ? `>${depth}:${desc}` : desc);
}
function legacySimpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
function hash53(str, seed = 0) {
  let h1 = 3735928559 ^ seed;
  let h2 = 1103547991 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return (h2 >>> 0).toString(16).padStart(8, "0") + (h1 >>> 0).toString(16).padStart(8, "0");
}
function computeLegacyStableHash(_filePath, content) {
  const desc = removeRecurrence(removeDuration(content)).replace(ALL_EMOJI_DATE_RE, "").replace(ALL_EMOJI_RE, "").replace(ALL_TAGS_RE, "").replace(/-\s*\[\s*[ xX-]\s*\]\s*#todo\s*/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  return legacySimpleHash(desc);
}
function parsePriority(text) {
  const match = text.match(PRIORITY_RE);
  if (match) {
    return PRIORITY_MAP[match[1]] ?? null;
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
  const durationMinutes = parseDurationMinutes(content);
  const recurrenceRule = parseRecurrenceRule(content);
  let description = removeEmojiDates(content);
  description = description.replace(PRIORITY_STRIP_RE, "").trim();
  description = removeDuration(description);
  description = removeRecurrence(description);
  description = description.replace(/#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g, "").trim();
  const statusChar = m.groups.status;
  const status = statusChar === "-" ? "cancelled" /* Cancelled */ : statusChar.toLowerCase() === "x" ? "done" /* Done */ : "todo" /* Todo */;
  const depth = parseIndentDepth(line);
  const taskId = generateTaskId(filePath, lineNumber, content, depth);
  const stableHash = computeStableHash(filePath, content, depth);
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
    dates.reminder ?? "",
    durationMinutes?.toString() ?? "",
    recurrenceRule ?? "",
    [...allTags].sort().join(","),
    projectTag ?? ""
  ].join("|");
  const syncHash = hash53(syncContent);
  return {
    id: taskId,
    description,
    status,
    filePath,
    lineNumber,
    depth,
    parentId: null,
    tags: allTags,
    projectTag,
    dueDate: dates.due,
    scheduledDate: dates.scheduled,
    startDate: dates.start,
    createdDate: dates.created,
    doneDate: dates.done,
    cancelledDate: dates.cancelled,
    reminderDate: dates.reminder,
    priority,
    durationMinutes,
    recurrenceRule,
    lastSyncedAt: null,
    syncHash,
    stableHash
  };
}

// src/domain/checklist.ts
var ANCHOR_RE = /%%\s*chk:([A-Za-z0-9-]+)\s*%%/;
var BOX_RE = /^\s*-\s*\[([ xX])\]\s*(.+)$/;
function parseChecklistLine(line) {
  const box = line.match(BOX_RE);
  if (!box) return null;
  const anchor = box[2].match(ANCHOR_RE);
  if (!anchor) return null;
  const title = box[2].replace(ANCHOR_RE, "").replace(/\s+/g, " ").trim();
  return {
    checked: box[1].toLowerCase() === "x",
    title,
    anchorId: anchor[1],
    raw: line
  };
}
function formatChecklistLine(title, done, anchorId) {
  return `- [${done ? "x" : " "}] ${title} %% chk:${anchorId} %%`;
}
function splitNotesSection(lines) {
  const items = [];
  const noteLines = [];
  for (const line of lines) {
    const parsed = parseChecklistLine(line);
    if (parsed) items.push(parsed);
    else noteLines.push(line);
  }
  return { items, noteLines };
}
function mergeChecklist(existing, sgItems, dropMissing) {
  const sgById = new Map(sgItems.map((it) => [it.id, it]));
  const seen = /* @__PURE__ */ new Set();
  const lines = [];
  for (const ex of existing) {
    const sg = sgById.get(ex.anchorId);
    if (!sg) {
      if (!dropMissing) lines.push(ex.raw);
      continue;
    }
    seen.add(ex.anchorId);
    const title = sg.title ?? ex.title;
    if (sg.done === ex.checked && title === ex.title) lines.push(ex.raw);
    else lines.push(formatChecklistLine(title, sg.done, ex.anchorId));
  }
  const appended = [];
  for (const sg of sgItems) {
    if (!seen.has(sg.id)) appended.push(formatChecklistLine(sg.title, sg.done, sg.id));
  }
  return { lines, appended };
}

// src/adapters/obsidian/vault-reader.ts
function linkParent(ancestors, task) {
  while (ancestors.length > 0 && ancestors[ancestors.length - 1].depth >= task.depth) {
    ancestors.pop();
  }
  task.parentId = ancestors.length > 0 ? ancestors[ancestors.length - 1].id : null;
  ancestors.push(task);
}
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
    if (!file || !(file instanceof import_obsidian7.TFile)) return [];
    const content = await this.vault.read(file);
    const lines = content.split("\n");
    const tasks = [];
    const ancestors = [];
    for (let i = 0; i < lines.length; i++) {
      const task = parseTaskLine(lines[i], tasksFile, i + 1);
      if (task) {
        linkParent(ancestors, task);
        tasks.push(task);
      }
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
      if (child instanceof import_obsidian7.TFile && child.extension === "md") {
        const relativePath = `${projectsFolder}/${child.name}`;
        const projectName = child.name.replace(/\.md$/, "");
        const content = await this.vault.read(child);
        const lines = content.split("\n");
        const markerIdx = lines.findIndex((l) => l.trim() === marker);
        if (markerIdx === -1) continue;
        let inSection = false;
        const ancestors = [];
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === marker) {
            inSection = true;
            ancestors.length = 0;
            continue;
          }
          if (inSection) {
            const trimmed = lines[i].trim();
            if (trimmed.startsWith("#") && trimmed !== marker) break;
            const task = parseTaskLine(lines[i], relativePath, i + 1, projectName);
            if (task) {
              linkParent(ancestors, task);
              tasks.push(task);
            }
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
    if (file instanceof import_obsidian7.TFile) {
      return new Date(file.stat.mtime).toISOString();
    }
    return null;
  }
  /**
   * Read anchored checklist lines (`- [ ] title %% chk:ID %%`) from the notes
   * sections of all project files. Unanchored boxes are ignored — without an
   * anchor (and with the parent task unknown) forward sync cannot map them.
   */
  async readChecklistAnchors(projectsFolder, notesSectionMarker) {
    const anchored = [];
    let unanchoredCount = 0;
    const relPath = projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(relPath);
    if (!folder || !("children" in folder)) return { anchored, unanchoredCount };
    for (const child of folder.children) {
      if (!(child instanceof import_obsidian7.TFile) || child.extension !== "md") continue;
      const relativePath = `${projectsFolder}/${child.name}`;
      const content = await this.vault.read(child);
      const lines = content.split("\n");
      const markerIdx = lines.findIndex((l) => l.trim() === notesSectionMarker);
      if (markerIdx === -1) continue;
      for (let i = markerIdx + 1; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith("#") && trimmed !== notesSectionMarker) break;
        if (!/^\s*-\s*\[[ xX]\]/.test(lines[i])) continue;
        const parsed = parseChecklistLine(lines[i]);
        if (parsed) {
          anchored.push({ ...parsed, filePath: relativePath, lineNumber: i + 1 });
        } else {
          unanchoredCount++;
        }
      }
    }
    return { anchored, unanchoredCount };
  }
  async getProjectFilesMap(projectsFolder) {
    const map = /* @__PURE__ */ new Map();
    const relPath = projectsFolder.replace(/^\/+/, "");
    const folder = this.vault.getAbstractFileByPath(relPath);
    if (!folder || !("children" in folder)) return map;
    for (const child of folder.children) {
      if (child instanceof import_obsidian7.TFile && child.extension === "md") {
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
var import_obsidian8 = require("obsidian");
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
  if (task.reminderDate) {
    emojis.push(`\u23F0 ${task.reminderDate}`);
  }
  if (task.dueDate) {
    emojis.push(`\u{1F4C5} ${formatDateForObsidian(task.dueDate).split(" ")[0]}`);
  }
  if (task.startDate) {
    emojis.push(`\u{1F6EB} ${formatDateForObsidian(task.startDate).split(" ")[0]}`);
  }
  if (task.scheduledDate) {
    emojis.push(`\u23F3 ${formatDateForObsidian(task.scheduledDate).split(" ")[0]}`);
  }
  if (task.doneDate) {
    emojis.push(`\u2705 ${task.doneDate.split("T")[0]}`);
  }
  if (task.cancelledDate && /^\d{4}-\d{2}-\d{2}/.test(task.cancelledDate)) {
    emojis.push(`\u274C ${task.cancelledDate.split("T")[0]}`);
  }
  let line = `- [${statusChar}] #todo ${task.description}`;
  if (task.depth > 0) line = "	".repeat(task.depth) + line;
  if (task.durationMinutes != null) {
    line += ` ${formatDuration(task.durationMinutes)}`;
  }
  if (regularTags) line += ` ${regularTags}`;
  if (emojis.length) line += ` ${emojis.join(" ")}`;
  if (priorityEmoji) line += ` ${priorityEmoji}`;
  if (task.recurrenceRule) line += ` \u{1F501} ${task.recurrenceRule}`;
  if (notifyTags) line += ` ${notifyTags}`;
  return line;
}
function taskMatchKey(task) {
  return `${task.depth}:${task.description.trim().toLowerCase().replace(/\s+/g, " ")}`;
}
function orderTasksForWrite(tasks) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const placed = /* @__PURE__ */ new Set();
  const out = [];
  let remaining = [...tasks];
  while (remaining.length > 0) {
    const next = [];
    let progress = false;
    for (const t of remaining) {
      if (!t.parentId || !byId.has(t.parentId) || placed.has(t.parentId)) {
        out.push(t);
        placed.add(t.id);
        progress = true;
      } else {
        next.push(t);
      }
    }
    if (!progress) {
      out.push(...next);
      break;
    }
    remaining = next;
  }
  return out;
}
var ObsidianVaultWriter = class {
  constructor(vault, tasksSectionMarker) {
    this.vault = vault;
    this.tasksSectionMarker = tasksSectionMarker;
  }
  async ensureFile(path) {
    const relPath = path.replace(/^\/+/, "");
    let file = this.vault.getAbstractFileByPath(relPath);
    if (file instanceof import_obsidian8.TFile) return file;
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
    if (markerIdx === -1) {
      const taskLines = orderTasksForWrite(tasks).map((t) => formatTaskLine(t));
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
      const newContent2 = lines.join("\n");
      if (newContent2 !== content) {
        await this.vault.modify(file, newContent2);
      }
      return;
    }
    let sectionEnd = lines.length;
    for (let i = markerIdx + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("#") && trimmed !== marker) {
        sectionEnd = i;
        break;
      }
    }
    const sectionLines = lines.slice(markerIdx + 1, sectionEnd);
    const existingByDesc = /* @__PURE__ */ new Map();
    for (let i = 0; i < sectionLines.length; i++) {
      const trimmed = sectionLines[i].trim();
      if (!trimmed) continue;
      const parsed = parseTaskLine(sectionLines[i], filePath, markerIdx + 1 + i);
      if (parsed) {
        const key = taskMatchKey(parsed);
        if (!existingByDesc.has(key)) {
          existingByDesc.set(key, parsed);
        }
      }
    }
    const sgByDesc = /* @__PURE__ */ new Map();
    for (const task of tasks) {
      sgByDesc.set(taskMatchKey(task), task);
    }
    const resultLines = [];
    const matchedDescs = /* @__PURE__ */ new Set();
    const existingIdIndex = /* @__PURE__ */ new Map();
    let pendingBlank = false;
    for (let i = 0; i < sectionLines.length; i++) {
      const line = sectionLines[i];
      const trimmed = line.trim();
      if (!trimmed) {
        pendingBlank = true;
        continue;
      }
      if (pendingBlank) {
        pendingBlank = false;
        if (resultLines.length > 0) resultLines.push("");
      }
      const parsed = parseTaskLine(line, filePath, markerIdx + 1 + i);
      if (!parsed) {
        resultLines.push(line);
        continue;
      }
      const descKey = taskMatchKey(parsed);
      const sgTask = sgByDesc.get(descKey);
      if (sgTask) {
        matchedDescs.add(descKey);
        resultLines.push(formatTaskLine(this.mergeTask(parsed, sgTask)));
        existingIdIndex.set(parsed.id, resultLines.length - 1);
      } else {
        resultLines.push(line);
        existingIdIndex.set(parsed.id, resultLines.length - 1);
      }
    }
    const attach = [];
    for (const task of orderTasksForWrite(tasks)) {
      const key = taskMatchKey(task);
      if (matchedDescs.has(key)) continue;
      const rendered = formatTaskLine(task);
      const parentAt = task.parentId != null ? existingIdIndex.get(task.parentId) : void 0;
      if (parentAt !== void 0) attach.push({ at: parentAt, line: rendered });
      else resultLines.push(rendered);
    }
    attach.sort((a, b) => a.at - b.at);
    let shift = 0;
    for (const a of attach) {
      resultLines.splice(a.at + 1 + shift, 0, a.line);
      shift++;
    }
    const before = lines.slice(0, markerIdx + 1);
    const after = lines.slice(sectionEnd);
    const parts = [...before, ""];
    if (resultLines.length > 0) parts.push(...resultLines, "");
    parts.push(...after);
    const newContent = parts.join("\n");
    if (newContent !== content) {
      await this.vault.modify(file, newContent);
    }
  }
  mergeTask(existing, sgTask) {
    return {
      id: sgTask.id,
      description: sgTask.description,
      status: sgTask.status,
      filePath: existing.filePath,
      lineNumber: 0,
      tags: sgTask.tags,
      projectTag: sgTask.projectTag,
      dueDate: sgTask.dueDate ?? existing.dueDate,
      // SG is the source of truth for start/scheduled/reminder: forward sync
      // runs before reverse, so SG already contains Obsidian edits. A null SG
      // value means "no date in SG" — keep the Obsidian line untouched.
      scheduledDate: sgTask.scheduledDate ?? existing.scheduledDate,
      startDate: sgTask.startDate ?? existing.startDate,
      createdDate: existing.createdDate ?? sgTask.createdDate,
      doneDate: existing.doneDate || sgTask.doneDate,
      cancelledDate: existing.cancelledDate || sgTask.cancelledDate,
      reminderDate: sgTask.reminderDate ?? existing.reminderDate,
      durationMinutes: sgTask.durationMinutes ?? existing.durationMinutes,
      recurrenceRule: sgTask.recurrenceRule ?? existing.recurrenceRule,
      // File structure wins: depth/parent linkage comes from file position.
      depth: existing.depth,
      parentId: existing.parentId,
      priority: sgTask.priority,
      lastSyncedAt: sgTask.lastSyncedAt,
      syncHash: sgTask.syncHash,
      stableHash: existing.stableHash
    };
  }
  async hasTasksSection(filePath) {
    const relPath = filePath.replace(/^\/+/, "");
    const file = this.vault.getAbstractFileByPath(relPath);
    if (!(file instanceof import_obsidian8.TFile)) return false;
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
  async normalizeTaskLines(tasks) {
    const byFile = /* @__PURE__ */ new Map();
    for (const task of tasks) {
      if (!byFile.has(task.filePath)) byFile.set(task.filePath, []);
      byFile.get(task.filePath).push(task);
    }
    for (const [filePath, fileTasks] of byFile) {
      const relPath = filePath.replace(/^\/+/, "");
      const file = this.vault.getAbstractFileByPath(relPath);
      if (!(file instanceof import_obsidian8.TFile)) continue;
      const content = await this.vault.read(file);
      const lines = content.split("\n");
      let changed = false;
      for (const task of fileTasks) {
        const lineIdx = task.lineNumber - 1;
        if (lineIdx < 0 || lineIdx >= lines.length) continue;
        const original = lines[lineIdx];
        const normalized = formatTaskLine(task);
        if (original !== normalized) {
          lines[lineIdx] = normalized;
          changed = true;
        }
      }
      if (changed) {
        await this.vault.modify(file, lines.join("\n"));
      }
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
  /** Find a linked record by stable content hash across ALL files.
   * Used to detect cross-file moves: the Obsidian id embeds filePath, so a
   * moved task gets a new id while stableHash stays the same. */
  getByStableHash(stableHash) {
    if (!stableHash) return void 0;
    return this.data.find((r) => r.obsidianStableHash === stableHash && r.singularityTaskId);
  }
  /** Remove stale records pointing at the same SG task as the kept record,
   * but only when their Obsidian id is no longer present (moved/renamed).
   * Prevents refCount inflation and ghost links after moves. */
  async deleteStaleSiblings(keepObsidianId, singularityId, currentIds) {
    let removed = 0;
    for (const r of [...this.data]) {
      if (r.id !== keepObsidianId && r.singularityTaskId === singularityId && !currentIds.has(r.id)) {
        await this.deleteById(r.id);
        removed++;
      }
    }
    return removed;
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
  async markSynced(obsidianId, singularityId, obsidianDescription, obsidianContentHash, singularityEtag, singularityModDate, obsidianStableHash) {
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
      if (obsidianStableHash) existing.obsidianStableHash = obsidianStableHash;
    } else {
      this.data.push({
        id: obsidianId,
        obsidianFilePath: "",
        obsidianLineNumber: 0,
        obsidianContentHash: obsidianContentHash ?? "",
        obsidianDescription: obsidianDescription ?? "",
        obsidianStableHash: obsidianStableHash ?? null,
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

// src/domain/conflict-resolver.ts
var ConflictResolutionError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "ConflictResolutionError";
  }
};
function parseSgDate(value) {
  if (value == null) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    if (!isFinite(value)) return null;
    if (value >= 1e12) return new Date(value);
    if (value >= 1e9) return new Date(value * 1e3);
    return null;
  }
  if (typeof value !== "string") return null;
  const s = value.trim();
  if (!s) return null;
  if (/^\d+$/.test(s)) {
    if (s.length === 10) return new Date(Number(s) * 1e3);
    if (s.length === 13) return new Date(Number(s));
    return null;
  }
  if (!/[-/T:]/.test(s)) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function sgDateToIso(value) {
  const d = parseSgDate(value);
  return d ? d.toISOString() : null;
}
function hasConflict(obsidianTask, singularityTask, dbState) {
  const obsidianChanged = obsidianTask.syncHash != null && dbState.obsidianContentHash != null && obsidianTask.syncHash !== dbState.obsidianContentHash;
  let singularityChanged = false;
  const sgModDate = singularityTask["modificatedDate"];
  const sgDt = parseSgDate(sgModDate);
  const dbDt = parseSgDate(dbState.lastModifiedSingularity) ?? parseSgDate(dbState.lastSyncedAt);
  if (sgDt && dbDt) {
    singularityChanged = sgDt > dbDt;
  }
  return obsidianChanged && singularityChanged;
}
async function resolveConflict(obsidianTask, singularityTask, dbState, strategy, promptFn) {
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
  const obsTs = dbState.lastModifiedObsidian;
  const sgTs = singularityTask["modificatedDate"];
  const obsDate = obsTs ? parseSgDate(obsTs) : null;
  const sgDate = sgTs ? parseSgDate(sgTs) : null;
  if (obsDate && sgDate) {
    return obsDate > sgDate ? obsidianTask : null;
  }
  if (obsDate) return obsidianTask;
  if (sgDate) return null;
  return obsidianTask;
}
async function resolveManual(obsidianTask, singularityTask, dbState, promptFn) {
  const fn = promptFn ?? (async () => "skip");
  const choice = await fn(
    obsidianTask,
    singularityTask,
    dbState,
    "both_changed",
    "Choose [O]bsidian / [S]ingularity / [K]ip"
  );
  switch (choice) {
    case "obsidian":
    case "obsidian_all":
      return obsidianTask;
    case "singularity":
    case "singularity_all":
      return null;
    case "new":
    case "skip":
    default:
      throw new ConflictResolutionError(
        `Conflict skipped for task ${obsidianTask.id}`
      );
  }
}

// src/domain/sync-errors.ts
var SyncAbortError = class extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = "SyncAbortError";
  }
};

// src/orchestrators/forward-sync.ts
function extractNotifyFromTask(task) {
  const fromTags = extractNotifyMinutes(
    task.tags.filter((t) => /^notify/i.test(t)).map((t) => `#${t}`).join(" ")
  );
  if (fromTags.length === 0 && task.reminderDate) return [0];
  return fromTags;
}
function resolveStartDate(task) {
  if (task.reminderDate) {
    return { start: formatDateForApi(task.reminderDate), useTime: true };
  }
  if (task.scheduledDate) {
    const hasTime2 = task.scheduledDate.includes(" ") || task.scheduledDate.includes("T");
    return { start: formatDateForApi(task.scheduledDate), useTime: hasTime2 };
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
    this._archivedIds = /* @__PURE__ */ new Set();
    this._currentIds = /* @__PURE__ */ new Set();
    /** Sync-run correlation tag, e.g. "sync:ab12cd ". Empty outside runs. */
    this.runTag = "";
    /**
     * Batched creates: syncTask enqueues instead of calling the API, flush
     * sends one /batch. Pending entries are visible to title-match scans so
     * same-run duplicates merge instead of doubling. Flush happens at the end
     * of the loop and before any Manual prompt (the prompt needs the SG record).
     */
    this.pendingCreates = [];
  }
  /** Set by the orchestrator per run so logs correlate across modules. */
  setRunTag(tag) {
    this.runTag = tag;
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
  getArchivedObsidianIds() {
    return new Set(this._archivedIds);
  }
  async sync(tasksFile, projectsFolder, notesSectionMarker) {
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
    this._currentIds = currentIds;
    const currentStableHashes = new Set(obsidianTasks.map((t) => t.stableHash).filter(Boolean));
    await this.loadProjects();
    await this.loadSingularityTasks();
    this._failedIds = /* @__PURE__ */ new Set();
    this._archivedIds = /* @__PURE__ */ new Set();
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
        console.error(`[${this.runTag}ForwardSync] task error:`, e?.message || e, `task:`, task.description);
      }
    }
    const failedCreates = await this.flushPendingCreates();
    stats.created = Math.max(0, stats.created - failedCreates);
    stats.errors += failedCreates;
    stats.updated += await this.linkOrphanParents(obsidianTasks);
    if (notesSectionMarker) {
      await this.syncChecklists(projectsFolder, notesSectionMarker, stats);
    }
    return stats;
  }
  /**
   * Patch parent links for children whose parent flushed after them (or was
   * created earlier this run). Returns the number of patched links.
   * Skipped in dryRun.
   */
  async linkOrphanParents(obsidianTasks) {
    if (this.dryRun) return 0;
    let linked = 0;
    for (const task of obsidianTasks) {
      if (!task.parentId) continue;
      const childState = this.taskStore.getByObsidianId(task.id);
      const parentSgId = this.resolveParentSgId(task);
      const childSgId = childState?.singularityTaskId;
      if (!childSgId || !parentSgId) continue;
      const cached = this._sgTasksCache.find((s) => s.id === childSgId);
      if (cached && cached.parent === parentSgId) continue;
      try {
        await this.apiClient.updateTask(childSgId, { parent: parentSgId });
        if (cached) cached.parent = parentSgId;
        linked++;
      } catch (e) {
        console.warn(`[${this.runTag}ForwardSync] parent link failed for "${task.description}":`, e?.message ?? e);
      }
    }
    return linked;
  }
  normalizeForComparison(text) {
    if (!text) return "";
    return removeRecurrence(text).trim().toLowerCase().replace(/\s+/g, " ").replace(/<[^>]+>/g, "").replace(/[\u{1F53A}\u23EB\u{1F53C}\u{1F53D}\u23EC]/gu, "").replace(/[\u2795\u{1F6EB}\u23F3\u{1F4C5}\u2705\u274C]\s*\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2})?/gu, "").replace(/#[a-zA-Zа-яА-ЯёЁ0-9_/-]+/g, "");
  }
  /** Drop stale TaskStore records that point at the same SG task but whose
  * Obsidian id is gone (task moved between files and got a new id).
  * Skipped in dryRun — store must not be mutated there. */
  async cleanupMoveStaleRecords(task, sgId) {
    if (this.dryRun || !sgId) return;
    await this.taskStore.deleteStaleSiblings(task.id, sgId, this._currentIds);
  }
  /**
   * Forward checklist sync: anchored boxes in notes sections → SG.
   * Toggle → check/uncheck, retitle → PATCH, anchor without SG item → DELETE
   * (forward always runs on the full list, so absence means deleted).
   * Unanchored boxes are ignored (parent task unknowable) with a log line.
   * Checklist failures are per-item and never abort the task sync.
   */
  async syncChecklists(projectsFolder, notesSectionMarker, stats) {
    if (this.dryRun) return;
    const { anchored, unanchoredCount } = await this.vaultReader.readChecklistAnchors(
      projectsFolder,
      notesSectionMarker
    );
    if (unanchoredCount > 0) {
      console.log(`[ForwardSync] ${unanchoredCount} unanchored checklist box(es) ignored (no anchor \u2192 parent task unknown)`);
      notifyThrottled(
        `\u26A0\uFE0F \u0411\u043E\u043A\u0441\u044B \u0431\u0435\u0437 %% chk:ID %% \u043D\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u0443\u044E\u0442\u0441\u044F (\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430 \u0440\u043E\u0434\u0438\u0442\u0435\u043B\u044C\u0441\u043A\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430)`,
        6e3,
        "checklist-no-anchor"
      );
    }
    if (anchored.length === 0) return;
    let sgItems;
    try {
      sgItems = await this.apiClient.getChecklistItems();
    } catch (e) {
      stats.errors++;
      console.error(`[ForwardSync] checklist fetch failed:`, e?.message ?? e);
      return;
    }
    const sgById = new Map(sgItems.filter((i) => !i.removed).map((i) => [i.id, i]));
    for (const line of anchored) {
      try {
        const sg = sgById.get(line.anchorId);
        if (!sg) {
          await this.apiClient.deleteChecklistItem(line.anchorId);
          stats.updated++;
          continue;
        }
        if (!!sg.done !== line.checked) {
          if (line.checked) await this.apiClient.checkChecklistItem(line.anchorId);
          else await this.apiClient.uncheckChecklistItem(line.anchorId);
          stats.updated++;
        } else if ((sg.title ?? "") !== line.title) {
          await this.apiClient.updateChecklistItem(line.anchorId, { title: line.title });
          stats.updated++;
        }
      } catch (e) {
        stats.errors++;
        console.error(`[ForwardSync] checklist item error:`, e?.message ?? e, `anchor:`, line.anchorId);
      }
    }
  }
  async syncTask(task) {
    if (task.parentId && this.pendingCreates.length > 0) {
      await this.flushPendingCreates();
    }
    if (task.status === "cancelled" /* Cancelled */) {
      for (const sgExisting of this._sgTasksCache) {
        if (sgExisting.externalId === task.id) {
          if (sgExisting.isNote) return "skipped";
          return this.updateExisting(task, sgExisting);
        }
      }
      const taskDescNorm2 = this.normalizeForComparison(task.description);
      if (this.matchPendingCreate(taskDescNorm2)) await this.flushPendingCreates();
      for (const sgExisting of this._sgTasksCache) {
        if (sgExisting.isNote) continue;
        const sgTitleNorm = this.normalizeForComparison(sgExisting.title ?? "");
        if (taskDescNorm2 && sgTitleNorm && taskDescNorm2 === sgTitleNorm) {
          return this.updateExisting(task, sgExisting);
        }
      }
      return this.enqueueCreate(task);
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
        if (this.matchPendingCreate(taskDescNorm2)) await this.flushPendingCreates();
        for (const sgExisting of this._sgTasksCache) {
          if (sgExisting.checked === 2 || sgExisting.isNote) continue;
          const sgTitleNorm = this.normalizeForComparison(sgExisting.title ?? "");
          if (taskDescNorm2 && sgTitleNorm && taskDescNorm2 === sgTitleNorm) {
            return this.updateExisting(task, sgExisting, 2);
          }
        }
        return this.enqueueCreate(task, 2);
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
        if (this.matchPendingCreate(taskDescNorm2)) await this.flushPendingCreates();
        for (const sgExisting of this._sgTasksCache) {
          if (sgExisting.checked === 2 || sgExisting.isNote) continue;
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
        if (sgExisting.isNote) return "skipped";
        const state = this.taskStore.getByObsidianId(task.id);
        if (sgExisting.journalDate && state?.obsidianContentHash === task.syncHash) {
          return "skipped";
        }
        return this.updateExisting(task, sgExisting);
      }
    }
    if (task.stableHash) {
      const allStates = this.taskStore.getAll();
      const legacyStable = computeLegacyStableHash(task.filePath, `#todo ${task.description}`);
      const stateByHash = allStates.find(
        (s) => s.obsidianFilePath === task.filePath && s.obsidianStableHash === task.stableHash && s.singularityTaskId
      ) ?? allStates.find(
        (s) => s.obsidianFilePath === task.filePath && s.obsidianStableHash === legacyStable && s.singularityTaskId
      ) ?? this.taskStore.getByStableHash(task.stableHash) ?? this.taskStore.getByStableHash(legacyStable);
      if (stateByHash?.singularityTaskId) {
        const sgTask = await this.apiClient.getTaskById(stateByHash.singularityTaskId);
        if (sgTask && !sgTask.removed) {
          if (sgTask.externalId !== task.id) {
            if (!this.dryRun) await this.apiClient.updateTask(sgTask.id, { externalId: task.id });
            sgTask.externalId = task.id;
          }
          const result = await this.updateExisting(task, sgTask);
          await this.cleanupMoveStaleRecords(task, sgTask.id);
          return result;
        }
      }
    }
    const taskDescNorm = this.normalizeForComparison(task.description);
    if (this.matchPendingCreate(taskDescNorm)) await this.flushPendingCreates();
    let matchedCancelled = null;
    for (const sgExisting of this._sgTasksCache) {
      if (sgExisting.isNote) continue;
      const sgTitle = sgExisting.title ?? "";
      const sgTitleNorm = this.normalizeForComparison(sgTitle);
      if (!taskDescNorm || !sgTitleNorm) continue;
      if (taskDescNorm === sgTitleNorm) {
        if (sgExisting.checked === 2) {
          matchedCancelled = sgExisting;
          continue;
        }
        const decision = await this.resolveTitleMatch(task, sgExisting);
        if (decision === "new") return this.enqueueCreate(task);
        const merged = await this.updateExisting(task, sgExisting);
        await this.cleanupMoveStaleRecords(task, sgExisting.id);
        return merged;
      }
    }
    if (matchedCancelled) return this.updateExisting(task, matchedCancelled, 0);
    return this.enqueueCreate(task);
  }
  /**
   * Title-match (ПРОВЕРКА 2): при strategy=manual спрашиваем пользователя,
   * одна ли это задача. Возвращает "merged" (обновить SG-задачу из Obsidian),
   * "new" (создать отдельную задачу в SG), "skipped" (заморозить расхождение).
   */
  async resolveTitleMatch(task, sgExisting) {
    if (this.conflictStrategy !== "manual" /* Manual */ || !this.conflictPromptFn) {
      return "merged";
    }
    const state = this.taskStore.getByObsidianId(task.id) ?? null;
    try {
      const choice = await this.conflictPromptFn(
        task,
        sgExisting,
        state,
        "title_match",
        `\u0417\u0430\u0434\u0430\u0447\u0430 "${task.description}" \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 Singularity \u043F\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0443 \u2014 \u043E\u0434\u043D\u0430 \u043B\u0438 \u044D\u0442\u043E \u0437\u0430\u0434\u0430\u0447\u0430?`
      );
      switch (choice) {
        case "obsidian":
          return "merged";
        case "new":
          return "new";
        case "singularity":
          await this.taskStore.markSynced(
            task.id,
            sgExisting.id,
            task.description,
            task.syncHash ?? "",
            null,
            sgDateToIso(sgExisting.modificatedDate)
          );
          return "skipped";
        case "skip":
        default:
          return "skipped";
      }
    } catch (e) {
      if (e instanceof ConflictResolutionError) return "skipped";
      throw e;
    }
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
  /** Resolve the SG parent id for a nested Obsidian task (null = top-level
   * or parent not synced yet — healed on a later pass/run). */
  resolveParentSgId(task) {
    if (!task.parentId) return null;
    return this.taskStore.getByObsidianId(task.parentId)?.singularityTaskId ?? null;
  }
  async updateExisting(task, sgExisting, overrideChecked) {
    const sgTaskId = sgExisting.id;
    if (!sgTaskId) return "skipped";
    const state = this.taskStore.getByObsidianId(task.id);
    const resolvedParent = this.resolveParentSgId(task);
    const parentChanged = task.parentId != null && resolvedParent != null && sgExisting.parent !== resolvedParent;
    if (state?.lastModifiedObsidian) {
      const currentMtime = await this.getFileMtime(task.filePath);
      if (currentMtime && state.lastModifiedObsidian === currentMtime && !parentChanged) return "skipped";
    } else if (state?.obsidianContentHash === task.syncHash && !parentChanged) {
      return "skipped";
    }
    if (state && sgExisting.modificatedDate) {
      const sgDt = parseSgDate(sgExisting.modificatedDate);
      const dbDt = parseSgDate(state.lastModifiedSingularity);
      const expectedChecked = task.status === "cancelled" /* Cancelled */ ? 2 : task.status === "done" /* Done */ ? 1 : 0;
      if (sgDt && dbDt && sgDt > dbDt && state.obsidianContentHash === task.syncHash && sgExisting.checked === expectedChecked && !parentChanged) {
        if (sgExisting.externalId !== task.id) {
          await this.apiClient.updateTask(sgTaskId, { externalId: task.id });
          sgExisting.externalId = task.id;
        }
        this.taskStore.markSynced(task.id, sgTaskId, task.description, task.syncHash ?? "", null, sgDateToIso(sgExisting.modificatedDate));
        return "skipped";
      }
    }
    if (state && hasConflict(task, sgExisting, state)) {
      try {
        const resolved = await resolveConflict(task, sgExisting, state, this.conflictStrategy, this.conflictPromptFn);
        if (resolved === null) {
          this.taskStore.markSynced(task.id, sgTaskId, task.description, task.syncHash ?? "", null, sgDateToIso(sgExisting.modificatedDate));
          return "skipped";
        }
      } catch (e) {
        if (e instanceof ConflictResolutionError) {
          notifyThrottled(`\u26A0\uFE0F ${e.message}`);
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
    const updatedTask = await this.apiClient.updateTask(sgTaskId, {
      title: task.description,
      start,
      deadline: formatDateForApi(task.dueDate, useTime),
      priority: task.priority != null ? mapPriorityToSingularity(task.priority) : sgExisting.priority ?? 1,
      checked,
      useTime,
      notifies: notifies.length ? notifies : void 0,
      tags: tags.length ? tags : void 0,
      projectId,
      externalId: task.id,
      timeLength: task.durationMinutes ?? void 0,
      parent: resolvedParent ?? void 0
    });
    sgExisting.title = task.description;
    sgExisting.checked = checked;
    sgExisting.externalId = task.id;
    sgExisting.tags = tags;
    if (resolvedParent != null) sgExisting.parent = resolvedParent;
    if (task.durationMinutes != null) sgExisting.timeLength = task.durationMinutes;
    if (updatedTask?.modificatedDate) sgExisting.modificatedDate = updatedTask.modificatedDate;
    const sgModDate = updatedTask?.modificatedDate ?? sgExisting.modificatedDate;
    const mtime = await this.getFileMtime(task.filePath);
    await this.taskStore.upsert({
      id: task.id,
      obsidianFilePath: task.filePath,
      obsidianLineNumber: task.lineNumber,
      obsidianContentHash: task.syncHash ?? task.id,
      obsidianDescription: task.description,
      obsidianStableHash: task.stableHash,
      singularityTaskId: sgTaskId,
      singularityEtag: null,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastModifiedObsidian: mtime,
      lastModifiedSingularity: sgDateToIso(sgModDate) ?? null,
      syncStatus: "synced",
      errorMessage: null,
      createdAt: null,
      updatedAt: null
    });
    return "updated";
  }
  async createNewTask(task, overrideChecked) {
    if (this.dryRun) return "created";
    const body = await this.buildCreateBody(task, overrideChecked);
    const data = await this.apiClient.createTask(body);
    await this.registerCreated(task, data);
    return "created";
  }
  /** Resolve everything a create needs (projects/tags may create SG entities). */
  async buildCreateBody(task, overrideChecked) {
    const projectId = await this.resolveProjectId(task);
    const notifies = extractNotifyFromTask(task);
    const { start, useTime } = resolveStartDate(task);
    const tags = await this.resolveTags(task);
    const checked = overrideChecked ?? (task.status === "cancelled" /* Cancelled */ ? 2 : task.status === "done" /* Done */ ? 1 : 0);
    return {
      id: null,
      title: task.description,
      note: null,
      priority: mapPriorityToSingularity(task.priority),
      projectId,
      start,
      deadline: formatDateForApi(task.dueDate, useTime),
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
      notify: 1,
      timeLength: task.durationMinutes,
      parent: this.resolveParentSgId(task)
    };
  }
  async registerCreated(task, data) {
    const sgId = data.id;
    if (!sgId) return;
    this._createdIds.add(task.id);
    this._sgTasksCache.push(data);
    const mtime = await this.getFileMtime(task.filePath);
    await this.taskStore.upsert({
      id: task.id,
      obsidianFilePath: task.filePath,
      obsidianLineNumber: task.lineNumber,
      obsidianContentHash: task.syncHash ?? task.id,
      obsidianDescription: task.description,
      obsidianStableHash: task.stableHash,
      singularityTaskId: sgId,
      singularityEtag: null,
      lastSyncedAt: (/* @__PURE__ */ new Date()).toISOString(),
      lastModifiedObsidian: mtime,
      lastModifiedSingularity: sgDateToIso(data.modificatedDate) ?? (/* @__PURE__ */ new Date()).toISOString(),
      syncStatus: "synced",
      errorMessage: null,
      createdAt: null,
      updatedAt: null
    });
  }
  async enqueueCreate(task, overrideChecked) {
    if (this.dryRun) return "created";
    const body = await this.buildCreateBody(task, overrideChecked);
    this.pendingCreates.push({ task, overrideChecked, body, normDesc: this.normalizeForComparison(task.description) });
    return "created";
  }
  matchPendingCreate(normDesc) {
    if (!normDesc) return null;
    return this.pendingCreates.find((p) => p.normDesc === normDesc) ?? null;
  }
  /** Flush the create queue; returns the number of failed creates (for stats fix-up). */
  async flushPendingCreates() {
    if (this.pendingCreates.length === 0 || this.dryRun) {
      this.pendingCreates = [];
      return 0;
    }
    const batch = this.pendingCreates.splice(0);
    if (batch.length === 1) {
      try {
        const data = await this.apiClient.createTask(batch[0].body);
        await this.registerCreated(batch[0].task, data);
        return 0;
      } catch (e) {
        this._failedIds.add(batch[0].task.id);
        console.error(`[ForwardSync] create error:`, e?.message ?? e, `task:`, batch[0].task.description);
        return 1;
      }
    }
    const results = await this.apiClient.createTasksBatch(batch.map((p) => p.body));
    let failed = 0;
    for (let i = 0; i < batch.length; i++) {
      const data = results[i];
      if (data?.id) await this.registerCreated(batch[i].task, data);
      else {
        failed++;
        this._failedIds.add(batch[i].task.id);
        console.error(`[ForwardSync] batched create failed for task:`, batch[i].task.description);
      }
    }
    return failed;
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
        deadline: formatDateForApi(task.dueDate, useTime),
        priority: task.priority != null ? mapPriorityToSingularity(task.priority) : void 0,
        useTime,
        notifies: notifies.length ? notifies : void 0,
        tags: tags.length ? tags : void 0,
        projectId,
        timeLength: task.durationMinutes ?? void 0
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
        obsidianStableHash: task.stableHash,
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
      this._archivedIds.add(task.id);
      return "archived";
    }
    const data = await this.apiClient.createTask({
      id: null,
      title: task.description,
      note: null,
      priority: mapPriorityToSingularity(task.priority),
      projectId,
      start,
      deadline: formatDateForApi(task.dueDate, useTime),
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
      notify: 1,
      timeLength: task.durationMinutes
    });
    const sgId = data.id;
    if (sgId) {
      this._createdIds.add(task.id);
      if (data) this._sgTasksCache.push(data);
      await this.apiClient.archiveTask(sgId);
      const mtime = await this.getFileMtime(task.filePath);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await this.taskStore.upsert({
        id: task.id,
        obsidianFilePath: task.filePath,
        obsidianLineNumber: task.lineNumber,
        obsidianContentHash: task.syncHash ?? task.id,
        obsidianDescription: task.description,
        obsidianStableHash: task.stableHash,
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
    this._archivedIds.add(task.id);
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
    } catch (e) {
      throw new SyncAbortError(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442\u044B Singularity: ${e?.message ?? e}`, e);
    }
  }
  async loadSingularityTasks() {
    try {
      this._sgTasksCache = await this.apiClient.getTasks(false, true);
    } catch (e) {
      throw new SyncAbortError(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0437\u0430\u0434\u0430\u0447\u0438 Singularity: ${e?.message ?? e}`, e);
    }
  }
  /** Returns Obsidian IDs of tasks that were deleted, for reverse sync to ignore */
  async syncDeletedObsidianTasks(currentIds, currentStableHashes) {
    const deletedIds = /* @__PURE__ */ new Set();
    const synced = this.taskStore.getSyncedWithSingularity();
    const allWithSgId = this.taskStore.getAll().filter((r) => r.singularityTaskId);
    const sgRefCount = /* @__PURE__ */ new Map();
    for (const s of allWithSgId) {
      sgRefCount.set(s.singularityTaskId, (sgRefCount.get(s.singularityTaskId) ?? 0) + 1);
    }
    const pendingDeletes = [];
    for (const state of synced) {
      if (!currentIds.has(state.id) && !(currentStableHashes?.has(state.obsidianStableHash ?? "") ?? false)) {
        deletedIds.add(state.id);
        const sgId = state.singularityTaskId;
        if (sgId && !this.dryRun) {
          const refCount = sgRefCount.get(sgId) ?? 1;
          if (refCount <= 1) pendingDeletes.push({ sgId, description: state.obsidianDescription });
        }
        await this.taskStore.deleteById(state.id);
      }
    }
    await this.batchSoftDelete(pendingDeletes);
    return deletedIds;
  }
  async batchSoftDelete(pending) {
    if (pending.length === 0) return;
    if (pending.length === 1) {
      await this.softDeleteOne(pending[0].sgId, pending[0].description);
      return;
    }
    try {
      const { results } = await this.apiClient.executeBatch(
        pending.map((p) => ({
          method: "PATCH",
          path: `/v2/task/${p.sgId}`,
          body: { deleteDate: this.batchDeleteDate() },
          uuid: p.sgId
        }))
      );
      const failed = /* @__PURE__ */ new Map();
      for (let i = 0; i < results.length; i++) {
        const status = results[i]?.status ?? 0;
        if (status < 200 || status >= 300) failed.set(pending[i].sgId, status);
      }
      for (const p of pending) {
        if (failed.has(p.sgId)) await this.softDeleteOne(p.sgId, p.description);
      }
      if (failed.size > 0) {
        console.warn(`[ForwardSync] batch soft-delete: ${failed.size}/${pending.length} fell back to individual calls`);
      }
    } catch (e) {
      console.warn(`[ForwardSync] batch soft-delete failed, falling back to individual calls:`, e?.message ?? e);
      for (const p of pending) await this.softDeleteOne(p.sgId, p.description);
    }
  }
  batchDeleteDate() {
    const now = /* @__PURE__ */ new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}T00:00:00${localOffsetString()}`;
  }
  async softDeleteOne(sgId, description) {
    try {
      await this.apiClient.softDeleteTask(sgId);
    } catch (e1) {
      console.warn(`[ForwardSync] softDeleteTask failed for ${sgId} (task: "${description}"): ${e1?.message ?? e1}`);
      try {
        await this.apiClient.deleteTask(sgId);
        console.log(`[ForwardSync] fallback: permanently deleted ${sgId}`);
      } catch (e2) {
        console.error(`[ForwardSync] deleteTask also failed for ${sgId}: ${e2?.message ?? e2}`);
      }
    }
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
var import_obsidian9 = require("obsidian");

// src/domain/utils/delta-parser.ts
function wrapInline(text, attrs) {
  if (attrs.link) return `[${text}](${attrs.link})`;
  if (attrs.bold && attrs.italic) return `***${text}***`;
  if (attrs.bold) return `**${text}**`;
  if (attrs.italic) return `*${text}*`;
  if (attrs.strike) return `~~${text}~~`;
  if (attrs.code) return `\`${text}\``;
  return text;
}
function applyBlockFormat(text, attrs) {
  if (attrs.header === 1) return `# ${text}`;
  if (attrs.header === 2) return `## ${text}`;
  if (attrs.header === 3) return `### ${text}`;
  if (attrs.list === "bullet") return `- ${text}`;
  if (attrs.list === "checked") return `- [x] ${text}`;
  if (attrs.list === "unchecked") return `- [ ] ${text}`;
  if (attrs.blockquote) return `> ${text}`;
  return text;
}
function attrsEqual(a, b) {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}
function flattenOps(ops) {
  const chars = [];
  for (const op of ops) {
    if (typeof op.insert === "string") {
      const attrs = op.attributes || {};
      for (const ch of op.insert) {
        chars.push({ char: ch, attrs: { ...attrs } });
      }
    } else if (op.insert && typeof op.insert === "object") {
      chars.push({ char: "\0", attrs: { ...op.insert } });
    }
  }
  return chars;
}
function buildLines(chars) {
  const lines = [];
  let current = [];
  let currentBlockAttrs = {};
  for (const c of chars) {
    if (c.char === "\n") {
      lines.push({ content: current, blockAttrs: { ...c.attrs } });
      current = [];
      currentBlockAttrs = {};
    } else if (c.char === "\0") {
      if (current.length > 0) lines.push({ content: current, blockAttrs: {} });
      current = [];
      lines.push({ content: [], blockAttrs: { ...c.attrs } });
    } else {
      current.push(c);
    }
  }
  if (current.length > 0) lines.push({ content: current, blockAttrs: {} });
  return lines.reduce((acc, line) => {
    if (line.blockAttrs.divider) {
      acc.push({ content: "---", blockAttrs: {} });
      return acc;
    }
    if (line.blockAttrs.image) {
      acc.push({ content: `![${line.blockAttrs.image}](${line.blockAttrs.image})`, blockAttrs: {} });
      return acc;
    }
    let markdown = "";
    let i = 0;
    while (i < line.content.length) {
      const start = i;
      const attrs = line.content[i].attrs;
      while (i < line.content.length && attrsEqual(line.content[i].attrs, attrs)) {
        i++;
      }
      const text = line.content.slice(start, i).map((c) => c.char).join("");
      markdown += wrapInline(text, attrs);
    }
    acc.push({ content: markdown, blockAttrs: line.blockAttrs });
    return acc;
  }, []);
}
function renderLines(lines) {
  const result = [];
  let inCodeBlock = false;
  let orderedIdx = 0;
  let lastWasOrdered = false;
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.blockAttrs["code-block"]) {
      if (!inCodeBlock) {
        result.push("```");
        inCodeBlock = true;
      }
      result.push(line.content);
      i++;
      continue;
    }
    if (inCodeBlock) {
      result.push("```");
      inCodeBlock = false;
    }
    if (line.blockAttrs.table) {
      const tableRows = [];
      while (i < lines.length && lines[i].blockAttrs.table) {
        tableRows.push(lines[i].content.split("	"));
        i++;
      }
      if (tableRows.length > 0) {
        const maxCols = Math.max(...tableRows.map((r) => r.length));
        const colWidths = Array.from(
          { length: maxCols },
          (_, c) => Math.max(...tableRows.map((r) => (r[c] || "").length), 3)
        );
        for (let r = 0; r < tableRows.length; r++) {
          const row = tableRows[r];
          const cells = Array.from({ length: maxCols }, (_, c) => {
            const cell = row[c] || "";
            return cell.padEnd(colWidths[c]);
          });
          result.push(`| ${cells.join(" | ")} |`);
          if (r === 0) {
            const sep = colWidths.map((w) => "-".repeat(w)).join(" | ");
            result.push(`| ${sep} |`);
          }
        }
      }
      orderedIdx = 0;
      lastWasOrdered = false;
      continue;
    }
    if (line.blockAttrs.list === "ordered") {
      orderedIdx++;
      result.push(`${orderedIdx}. ${line.content}`);
      lastWasOrdered = true;
    } else {
      if (lastWasOrdered && line.blockAttrs.list !== "ordered" && line.content !== "") {
        result.push("");
      }
      orderedIdx = 0;
      lastWasOrdered = false;
      result.push(applyBlockFormat(line.content, line.blockAttrs));
    }
    i++;
  }
  if (inCodeBlock) result.push("```");
  return result;
}
function deltaToMarkdown(ops) {
  if (!Array.isArray(ops) || ops.length === 0) return "";
  const chars = flattenOps(ops);
  const rawLines = buildLines(chars);
  return renderLines(rawLines).join("\n");
}

// src/domain/task-notes.ts
var TASK_ANCHOR_RE = /^%%\s*task:([A-Za-z0-9-]+)\s*%%$/;
var CHECKLIST_ANCHOR_RE = /%%\s*chk:[A-Za-z0-9-]+\s*%%/;
function formatTaskNoteAnchor(taskSgId) {
  return `%% task:${taskSgId} %%`;
}
function parseTaskNoteAnchor(line) {
  const m = line.trim().match(TASK_ANCHOR_RE);
  return m ? m[1] : null;
}
function splitTaskNoteBlocks(lines) {
  const blocks = [];
  const byId = /* @__PURE__ */ new Map();
  const rest = [];
  let current = null;
  for (const line of lines) {
    const anchor = parseTaskNoteAnchor(line);
    if (anchor) {
      current = byId.get(anchor) ?? null;
      if (!current) {
        current = { taskSgId: anchor, lines: [] };
        byId.set(anchor, current);
        blocks.push(current);
      }
      continue;
    }
    if (current && !CHECKLIST_ANCHOR_RE.test(line)) {
      current.lines.push(line);
    } else {
      if (current && CHECKLIST_ANCHOR_RE.test(line)) {
      } else {
        current = null;
      }
      rest.push(line);
    }
  }
  return { blocks, rest };
}
function normNoteLines(lines) {
  const out = [...lines];
  while (out.length > 0 && out[out.length - 1].trim() === "") out.pop();
  return out;
}

// src/domain/utils/project-name.ts
var ILLEGAL_RE = /[/\\:*?"<>|]/g;
function sanitizeProjectName(title) {
  const clean = (title ?? "").replace(ILLEGAL_RE, "_").replace(/\s+/g, " ").trim().replace(/\.+$/g, "").slice(0, 100).trim();
  return clean || "Untitled";
}

// src/orchestrators/reverse-sync.ts
function isNoteId(value) {
  return /^N(?:-[A-Za-z0-9]+)+$/.test(value.trim());
}
function simpleHash(s) {
  if (!s) return "";
  let hash = 5381;
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) + hash + s.charCodeAt(i);
    hash = hash | 0;
  }
  return hash.toString(36);
}
function extractNoteText(note) {
  if (!note) return "";
  if (typeof note === "string") {
    try {
      const delta = JSON.parse(note);
      if (Array.isArray(delta)) return deltaToMarkdown(delta);
    } catch {
    }
    return note;
  }
  if (Array.isArray(note)) return deltaToMarkdown(note);
  return String(note);
}
var ReverseSyncOrchestrator = class {
  constructor(apiClient, taskStore, obsidianTasksFile, vault, vaultWriter, excludeTags = [], dryRun = false, projectsFolder = "/project", projectTemplate = "", lastKnownProjectFiles = {}, notesSectionMarker = "#### \u{1F4DD} Notes", lastKnownNoteHashes = {}, deleteProjectOnFileDelete = false) {
    this.apiClient = apiClient;
    this.taskStore = taskStore;
    this.obsidianTasksFile = obsidianTasksFile;
    this.vault = vault;
    this.vaultWriter = vaultWriter;
    this.excludeTags = excludeTags;
    this.dryRun = dryRun;
    this.projectsFolder = projectsFolder;
    this.projectTemplate = projectTemplate;
    this.deleteProjectOnFileDelete = deleteProjectOnFileDelete;
    this._projectsCache = {};
    this._projectsFull = {};
    this._tagsCache = {};
    this._tagsLoaded = false;
    this._obsidianProjects = null;
    this.deletedFromObsidian = /* @__PURE__ */ new Set();
    this.syncedObsidianIds = /* @__PURE__ */ new Set();
    this.archivedObsidianIds = /* @__PURE__ */ new Set();
    this.isLoadedProject = false;
    this._currentProjectFiles = {};
    this._currentNoteHashes = {};
    /** Sync-run correlation tag, e.g. "sync:ab12cd ". Empty outside runs. */
    this.runTag = "";
    this._lastKnownProjectFiles = lastKnownProjectFiles;
    this._notesSectionMarker = notesSectionMarker;
    this._lastKnownNoteHashes = lastKnownNoteHashes;
  }
  /** Set by the orchestrator per run so logs correlate across modules. */
  setRunTag(tag) {
    this.runTag = tag;
  }
  getProjectFiles() {
    return { ...this._currentProjectFiles };
  }
  getNoteHashes() {
    return { ...this._currentNoteHashes };
  }
  setDeletedFromObsidian(ids) {
    this.deletedFromObsidian = ids;
  }
  setSyncedObsidianIds(ids) {
    this.syncedObsidianIds = ids;
  }
  setArchivedObsidianIds(ids) {
    this.archivedObsidianIds = ids;
  }
  async sync(deltaSince) {
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
    let sgTasks;
    if (deltaSince) {
      try {
        sgTasks = await this.apiClient.getTasks(false, true, 1e3, void 0, { modifiedSince: deltaSince });
      } catch (e) {
        console.warn(`[ReverseSync] delta fetch failed, retrying as full:`, e?.message ?? e);
        sgTasks = await this.apiClient.getTasks(false, true);
        deltaSince = null;
      }
    } else {
      sgTasks = await this.apiClient.getTasks(false, true);
    }
    stats.singularityTasks = sgTasks.length;
    await this.ensureProjectFiles();
    await this.syncProjectNotes();
    await this.syncChecklists(sgTasks, deltaSince);
    await this.syncTaskNotes(sgTasks, deltaSince);
    await this.loadTags();
    this.loadObsidianProjects();
    const tasksToWrite = [];
    for (const sgTask of sgTasks) {
      try {
        const [shouldSync, task] = await this.processTask(sgTask);
        if (shouldSync && task) {
          tasksToWrite.push(task);
        }
      } catch (e) {
        stats.errors++;
        console.error(`[${this.runTag}ReverseSync] task error:`, e?.message || e, `sgTask:`, sgTask.id);
      }
    }
    await this.resolveHierarchy(tasksToWrite, sgTasks);
    if (!this.dryRun && tasksToWrite.length > 0) {
      await this.writeTasks(tasksToWrite);
    }
    stats.created = tasksToWrite.length;
    return stats;
  }
  /**
   * Resolve SG parent ids to Obsidian linkage: depth 1 + parentId set to the
   * parent's Obsidian id (its SG externalId when known, else the in-batch
   * parent's id). Parents outside the batch resolve via externalId so the
   * child still nests under the existing line on write.
   */
  async resolveHierarchy(tasksToWrite, sgTasks) {
    if (tasksToWrite.length === 0) return;
    const sgById = new Map(sgTasks.map((t) => [t.id, t]));
    const builtBySgId = /* @__PURE__ */ new Map();
    for (const t of tasksToWrite) {
      for (const s of sgTasks) {
        if (s.externalId === t.id || `sg_${s.id}` === t.id) {
          builtBySgId.set(s.id, t);
          break;
        }
      }
    }
    const extCache = /* @__PURE__ */ new Map();
    const externalOf = async (sgId) => {
      const inBatch = sgById.get(sgId);
      if (inBatch?.externalId) return inBatch.externalId;
      const built = builtBySgId.get(sgId);
      if (built) return built.id;
      if (extCache.has(sgId)) return extCache.get(sgId) ?? null;
      let ext = null;
      try {
        const full = await this.apiClient.getTaskById(sgId);
        if (full?.externalId) ext = full.externalId;
      } catch {
      }
      extCache.set(sgId, ext);
      return ext;
    };
    for (const [sgId, built] of builtBySgId) {
      const parentSgId = sgById.get(sgId)?.parent;
      if (!parentSgId) continue;
      const parentObId = await externalOf(parentSgId);
      if (parentObId) {
        built.depth = 1;
        built.parentId = parentObId;
      } else {
        built.depth = 1;
      }
    }
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
    } catch (e) {
      throw new SyncAbortError(`\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442\u044B Singularity: ${e?.message ?? e}`, e);
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
        if (child instanceof import_obsidian9.TFile && child.extension === "md") {
          const content = await this.vault.read(child);
          const sgId = parseFrontmatterId(content);
          const name = child.name.replace(/\.md$/, "");
          existingByName.set(name.toLowerCase(), child);
          if (sgId) existingById.set(sgId, child);
        }
      }
    }
    const knownMissingProjectIds = /* @__PURE__ */ new Set();
    for (const [projId] of Object.entries(this._lastKnownProjectFiles)) {
      if (!this._projectsFull[projId]) continue;
      const title = (this._projectsFull[projId].title ?? "").trim();
      const hasFileInVault = existingById.has(projId) || (title ? existingByName.has(title.toLowerCase()) : false);
      if (!hasFileInVault) {
        if (!this.deleteProjectOnFileDelete) {
          console.warn(`[ReverseSync] file for project "${title}" is missing \u2014 SG project kept (deleteProjectOnFileDelete=false)`);
          this._currentProjectFiles[projId] = `${relPath}/${sanitizeProjectName(title)}.md`;
          knownMissingProjectIds.add(projId);
          continue;
        }
        await this.apiClient.deleteProject(projId);
        delete this._projectsFull[projId];
        delete this._projectsCache[projId];
      }
    }
    for (const [projId, proj] of Object.entries(this._projectsFull)) {
      const title = (proj.title ?? "").trim();
      if (!title || title.toLowerCase() === "\u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435" || title.toLowerCase() === "inbox") continue;
      if (knownMissingProjectIds.has(projId)) continue;
      const titleLower = title.toLowerCase();
      const safeName = sanitizeProjectName(title);
      const filePath = `${relPath}/${safeName}.md`;
      const byId = existingById.get(projId);
      if (byId) {
        this._currentProjectFiles[projId] = filePath;
        const currentName = byId.name.replace(/\.md$/, "");
        if (currentName !== safeName) {
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
      if (exists instanceof import_obsidian9.TFile) {
        this._currentProjectFiles[projId] = filePath;
        await this.vaultWriter.addFrontmatterIfMissing(exists, projId);
        existingByName.set(titleLower, exists);
        continue;
      }
      const emoji = proj.emoji ? String.fromCodePoint(parseInt(proj.emoji, 16)) : "";
      let noteRaw = proj.note ?? "";
      if (noteRaw && isNoteId(noteRaw)) {
        const detail = await this.apiClient.getProjectById(projId);
        if (detail?.note && !isNoteId(detail.note)) noteRaw = detail.note;
      }
      if (noteRaw && isNoteId(noteRaw)) {
        const noteData = await this.apiClient.getNote(noteRaw);
        if (noteData?.content) noteRaw = noteData.content;
      }
      const noteText = noteRaw && isNoteId(noteRaw) ? "" : extractNoteText(noteRaw);
      if (noteText) this._currentNoteHashes[projId] = simpleHash(noteText);
      let content;
      if (this.projectTemplate) {
        const now = /* @__PURE__ */ new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        content = this.projectTemplate.replace(/\{\{title\}\}/g, title).replace(/\{\{singularity-id\}\}/g, projId).replace(/\{\{date\}\}/g, dateStr).replace(/\{\{emoji\}\}/g, emoji).replace(/\{\{note\}\}/g, noteText);
      } else {
        const lines = [
          "---",
          `singularity-id: "${projId}"`,
          "---",
          "",
          `# ${emoji} ${title}`.trim()
        ];
        if (noteText) lines.push("", noteText);
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
  }
  /** Locate the notes section in file lines. Returns marker/section bounds. */
  findNotesSection(lines) {
    const markerIdx = lines.findIndex((l) => l.trim() === this._notesSectionMarker);
    if (markerIdx === -1) return { markerIdx, sectionEnd: lines.length };
    let sectionEnd = lines.length;
    for (let i = markerIdx + 1; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("#") && trimmed !== this._notesSectionMarker) {
        sectionEnd = i;
        break;
      }
    }
    return { markerIdx, sectionEnd };
  }
  async syncProjectNotes() {
    if (this.dryRun) return;
    const relPath = this.projectsFolder.replace(/^\/+/, "");
    for (const [projId, proj] of Object.entries(this._projectsFull)) {
      let noteRaw = proj.note ?? "";
      if (!noteRaw || isNoteId(noteRaw)) {
        if (noteRaw && isNoteId(noteRaw)) {
          const detail = await this.apiClient.getProjectById(projId);
          if (detail?.note && !isNoteId(detail.note)) noteRaw = detail.note;
        }
        if (noteRaw && isNoteId(noteRaw)) {
          const noteData = await this.apiClient.getNote(noteRaw);
          if (noteData?.content) noteRaw = noteData.content;
        }
        if (!noteRaw || isNoteId(noteRaw)) continue;
      }
      const noteText = extractNoteText(noteRaw);
      const newHash = simpleHash(noteText);
      if (this._currentNoteHashes[projId] === newHash) continue;
      this._currentNoteHashes[projId] = newHash;
      const oldHash = this._lastKnownNoteHashes[projId];
      if (oldHash === newHash) continue;
      const title = (proj.title ?? "").trim();
      if (!title) continue;
      const filePath = `${relPath}/${sanitizeProjectName(title)}.md`;
      const file = this.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof import_obsidian9.TFile)) continue;
      const content = await this.vault.read(file);
      const lines = content.split("\n");
      const { markerIdx, sectionEnd } = this.findNotesSection(lines);
      if (markerIdx === -1) {
        const lastLine = lines[lines.length - 1];
        const needsBlank = lastLine !== "";
        lines.push(
          needsBlank ? `
${this._notesSectionMarker}
${noteText}
` : `${this._notesSectionMarker}
${noteText}
`
        );
        await this.vault.modify(file, lines.join("\n"));
      } else {
        const sectionLines = lines.slice(markerIdx + 1, sectionEnd);
        const { items } = splitNotesSection(sectionLines);
        const { blocks } = splitTaskNoteBlocks(sectionLines);
        const before = lines.slice(0, markerIdx + 1);
        const after = lines.slice(sectionEnd);
        const newContent = [
          ...before,
          "",
          ...items.map((i) => i.raw),
          ...items.length ? [""] : [],
          ...noteText.split("\n"),
          "",
          ...renderTaskNoteBlocks(blocks),
          ...blocks.length ? [""] : [],
          ...after
        ].join("\n");
        if (newContent !== content) await this.vault.modify(file, newContent);
      }
    }
  }
  /**
   * Reverse checklist sync: SG checklist items → anchored boxes in the notes
   * section of the parent task's project file. Inbox tasks' items are skipped
   * (inbox file has no notes section). Non-fatal: failures warn and the task
   * sync continues — checklist writes only add/update anchored lines.
   */
  async syncChecklists(sgTasks, deltaSince) {
    if (this.dryRun) return;
    let items;
    try {
      items = await this.apiClient.getChecklistItems(
        void 0,
        false,
        500,
        deltaSince ? { modifiedSince: deltaSince } : void 0
      );
    } catch (e) {
      console.warn(`[ReverseSync] checklist fetch failed, skipping:`, e?.message ?? e);
      return;
    }
    if (items.length === 0) return;
    const projectByTask = /* @__PURE__ */ new Map();
    for (const t of sgTasks) {
      if (t.id && t.projectId) projectByTask.set(t.id, t.projectId);
    }
    const parentMissCache = /* @__PURE__ */ new Map();
    const resolveParentProject = async (parentId) => {
      const known = projectByTask.get(parentId);
      if (known) return known;
      if (parentMissCache.has(parentId)) return parentMissCache.get(parentId) ?? null;
      let pid = null;
      try {
        const parentTask = await this.apiClient.getTaskById(parentId);
        if (parentTask?.projectId) {
          pid = parentTask.projectId;
          projectByTask.set(parentId, pid);
        }
      } catch {
      }
      parentMissCache.set(parentId, pid);
      return pid;
    };
    const byFile = /* @__PURE__ */ new Map();
    let skippedInbox = 0;
    for (const it of items) {
      if (!it.id || it.removed) continue;
      const parentId = it.parent ?? "";
      let projId = projectByTask.get(parentId);
      if (!projId && parentId) projId = await resolveParentProject(parentId) ?? void 0;
      const proj = projId ? this._projectsFull[projId] : null;
      const title = (proj?.title ?? "").trim();
      if (!title) {
        skippedInbox++;
        continue;
      }
      const relPath = this.projectsFolder.replace(/^\/+/, "");
      const filePath = `${relPath}/${sanitizeProjectName(title)}.md`;
      if (!byFile.has(filePath)) byFile.set(filePath, []);
      byFile.get(filePath).push({ id: it.id, title: it.title ?? "", done: !!it.done });
    }
    if (skippedInbox > 0) {
      console.warn(`[ReverseSync] skipped ${skippedInbox} checklist item(s) of inbox tasks (no notes section)`);
    }
    const dropMissing = !deltaSince;
    let written = 0;
    let mergeFailed = 0;
    for (const [filePath, sgItems] of byFile) {
      const file = this.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof import_obsidian9.TFile)) {
        mergeFailed += sgItems.length;
        console.warn(`[${this.runTag}ReverseSync] checklist: project file missing, ${sgItems.length} item(s) skipped: ${filePath}`);
        continue;
      }
      try {
        const content = await this.vault.read(file);
        const lines = content.split("\n");
        const { markerIdx, sectionEnd } = this.findNotesSection(lines);
        if (markerIdx === -1) {
          const lastLine = lines[lines.length - 1];
          lines.push(
            lastLine !== "" ? `
${this._notesSectionMarker}
${sgItems.map((s) => formatChecklistLine(s.title, s.done, s.id)).join("\n")}
` : `${this._notesSectionMarker}
${sgItems.map((s) => formatChecklistLine(s.title, s.done, s.id)).join("\n")}
`
          );
          await this.vault.modify(file, lines.join("\n"));
          written += sgItems.length;
          continue;
        }
        const sectionLines = lines.slice(markerIdx + 1, sectionEnd);
        const { items: existing, noteLines } = splitNotesSection(sectionLines);
        const merged = mergeChecklist(existing, sgItems, dropMissing);
        if (merged.appended.length === 0 && merged.lines.length === existing.length && merged.lines.every((l, i) => l === existing[i].raw)) {
          continue;
        }
        const newContent = [
          ...lines.slice(0, markerIdx + 1),
          "",
          ...merged.lines,
          ...merged.appended,
          ...merged.lines.length + merged.appended.length ? [""] : [],
          ...noteLines,
          "",
          ...lines.slice(sectionEnd)
        ].join("\n");
        if (newContent !== content) {
          await this.vault.modify(file, newContent);
          written += merged.appended.length + merged.lines.filter((l, i) => l !== existing[i]?.raw).length;
        }
      } catch (e) {
        mergeFailed += sgItems.length;
        console.warn(`[${this.runTag}ReverseSync] checklist merge failed for ${filePath}:`, e?.message ?? e);
      }
    }
    console.log(
      `[${this.runTag}ReverseSync] checklist: fetched ${items.length}, wrote ~${written}, skipped inbox ${skippedInbox}, failed ${mergeFailed}`
    );
  }
  /**
   * Reverse task-note sync (SG → Obsidian only): each SG task's `note` goes
   * into an anchored `%% task:T-ID %%` block in its project file's notes
   * section (blocks last, after checklist lines and free text). Inbox tasks
   * are skipped (no notes section). Cleared notes drop their block on full
   * sync only; delta keeps orphans. Non-fatal like checklists.
   */
  async syncTaskNotes(sgTasks, deltaSince) {
    if (this.dryRun) return;
    const relPath = this.projectsFolder.replace(/^\/+/, "");
    let examined = 0;
    let written = 0;
    let skippedInbox = 0;
    let failed = 0;
    const dropMissing = !deltaSince;
    for (const sgTask of sgTasks) {
      if (!sgTask.id || sgTask.isNote) continue;
      const noteText = await this.resolveTaskNoteText(sgTask);
      const proj = sgTask.projectId ? this._projectsFull[sgTask.projectId] : null;
      const title = (proj?.title ?? "").trim();
      if (!title) {
        if (noteText) skippedInbox++;
        continue;
      }
      examined++;
      const filePath = `${relPath}/${sanitizeProjectName(title)}.md`;
      const file = this.vault.getAbstractFileByPath(filePath);
      if (!(file instanceof import_obsidian9.TFile)) {
        failed++;
        console.warn(`[${this.runTag}ReverseSync] task-note: project file missing, skipped: ${filePath}`);
        continue;
      }
      try {
        const content = await this.vault.read(file);
        const lines = content.split("\n");
        const { markerIdx, sectionEnd } = this.findNotesSection(lines);
        if (markerIdx === -1) {
          if (!noteText) continue;
          const lastLine = lines[lines.length - 1];
          lines.push(
            lastLine !== "" ? `
${this._notesSectionMarker}
${formatTaskNoteAnchor(sgTask.id)}
${noteText}
` : `${this._notesSectionMarker}
${formatTaskNoteAnchor(sgTask.id)}
${noteText}
`
          );
          await this.vault.modify(file, lines.join("\n"));
          written++;
          continue;
        }
        const sectionLines = lines.slice(markerIdx + 1, sectionEnd);
        const { blocks } = splitTaskNoteBlocks(sectionLines);
        const existing = blocks.find((b) => b.taskSgId === sgTask.id);
        const wantLines = noteText ? normNoteLines(noteText.split("\n")) : [];
        const haveLines = existing ? normNoteLines(existing.lines) : null;
        if (haveLines !== null && haveLines.join("\n") === wantLines.join("\n")) continue;
        if (haveLines === null && wantLines.length === 0) continue;
        let rebuilt;
        if (wantLines.length === 0) {
          if (!dropMissing) continue;
          rebuilt = this.renderNotesWithoutTask(sectionLines, sgTask.id);
        } else if (existing) {
          rebuilt = this.renderNotesWithTask(sectionLines, sgTask.id, wantLines);
        } else {
          rebuilt = [...sectionLines, ...sectionLines.length && sectionLines[sectionLines.length - 1].trim() !== "" ? [""] : [], formatTaskNoteAnchor(sgTask.id), ...wantLines];
        }
        const newContent = [...lines.slice(0, markerIdx + 1), "", ...rebuilt, "", ...lines.slice(sectionEnd)].join("\n");
        if (newContent !== content) {
          await this.vault.modify(file, newContent);
          written++;
        }
      } catch (e) {
        failed++;
        console.warn(`[${this.runTag}ReverseSync] task-note merge failed for ${filePath}:`, e?.message ?? e);
      }
    }
    if (examined > 0 || failed > 0 || skippedInbox > 0) {
      if (skippedInbox > 0) {
        console.warn(`[${this.runTag}ReverseSync] skipped ${skippedInbox} task note(s) of inbox tasks (no notes section)`);
      }
      console.log(
        `[${this.runTag}ReverseSync] task-notes: examined ${examined}, wrote ${written}, skipped inbox ${skippedInbox}, failed ${failed}`
      );
    }
  }
  /** Resolve an SG task's note to markdown text (same 3-tier fallback as projects). */
  async resolveTaskNoteText(sgTask) {
    let noteRaw = sgTask.note ?? "";
    if (noteRaw && isNoteId(noteRaw)) {
      try {
        const noteData = await this.apiClient.getNote(noteRaw);
        if (noteData?.content) noteRaw = noteData.content;
      } catch {
      }
    }
    if (!noteRaw || isNoteId(noteRaw)) return "";
    return extractNoteText(noteRaw);
  }
  /** Section lines with one task's block replaced by new content. */
  renderNotesWithTask(sectionLines, sgId, wantLines) {
    const out = [];
    let i = 0;
    let replaced = false;
    while (i < sectionLines.length) {
      if (parseTaskNoteAnchor(sectionLines[i]) === sgId) {
        out.push(sectionLines[i]);
        out.push(...wantLines);
        replaced = true;
        i++;
        while (i < sectionLines.length && parseTaskNoteAnchor(sectionLines[i]) === null) {
          if (/%%\s*chk:[A-Za-z0-9-]+\s*%%/.test(sectionLines[i])) out.push(sectionLines[i]);
          i++;
        }
        continue;
      }
      out.push(sectionLines[i]);
      i++;
    }
    if (!replaced) {
      if (out.length > 0 && out[out.length - 1].trim() !== "") out.push("");
      out.push(formatTaskNoteAnchor(sgId), ...wantLines);
    }
    return out;
  }
  /** Section lines with one task's block (anchor + body) removed. */
  renderNotesWithoutTask(sectionLines, sgId) {
    const out = [];
    let i = 0;
    while (i < sectionLines.length) {
      if (parseTaskNoteAnchor(sectionLines[i]) === sgId) {
        i++;
        while (i < sectionLines.length && parseTaskNoteAnchor(sectionLines[i]) === null) {
          if (/%%\s*chk:[A-Za-z0-9-]+\s*%%/.test(sectionLines[i])) out.push(sectionLines[i]);
          i++;
        }
        continue;
      }
      out.push(sectionLines[i]);
      i++;
    }
    return out;
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
    } catch (e) {
      console.warn(`[ReverseSync] loadTags failed, continuing without tag names:`, e?.message ?? e);
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
      if (child instanceof import_obsidian9.TFile && child.extension === "md") {
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
    if (sgTask.isNote) return { ok: false, reason: "isNote entity" };
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
    if (extId && this.syncedObsidianIds.has(extId) && !this.archivedObsidianIds.has(extId)) return [false, null];
    const sgId = sgTask.id;
    const state = this.taskStore.getBySingularityId(sgId);
    if (state?.lastModifiedSingularity) {
      const sgMod = parseSgDate(sgTask.modificatedDate);
      const lastKnown = parseSgDate(state.lastModifiedSingularity);
      if (sgMod && lastKnown && sgMod <= lastKnown) {
        if (!extId) return [false, null];
      }
    }
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
    let reminderDate = null;
    if (checked !== 2 && start) {
      const hasTime2 = start.includes("T") && start.includes(":");
      if (hasTime2) {
        const dt = new Date(start);
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const d = String(dt.getDate()).padStart(2, "0");
        startDate = `${y}-${m}-${d}`;
        scheduledDate = `${y}-${m}-${d}`;
        const h = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");
        reminderDate = `${y}-${m}-${d} ${h}:${min}`;
      } else {
        startDate = start.split("T")[0].split(" ")[0];
        scheduledDate = null;
      }
    }
    let recurrenceRule = null;
    if (sgTask.recurrence) {
      recurrenceRule = sgRecurrenceToRule(sgTask.recurrence);
      if (!recurrenceRule) {
        console.warn(`[${this.runTag}ReverseSync] unmappable recurrence, syncing plainly:`, sgId);
      }
    }
    const obsidianTask = {
      id: externalId ?? `sg_${sgId}`,
      description: title,
      status: checked === 2 ? "cancelled" /* Cancelled */ : checked === 1 ? "done" /* Done */ : "todo" /* Todo */,
      filePath: this.obsidianTasksFile,
      lineNumber: 0,
      // Hierarchy is resolved afterwards (resolveHierarchy): raw SG parent
      // ids become depth/parentId here.
      depth: 0,
      parentId: null,
      tags: obsidianTags,
      projectTag: projectName ?? null,
      dueDate: utcIsoToLocalDate(deadline),
      scheduledDate,
      startDate,
      createdDate: utcIsoToLocalDate(sgTask.createdDate),
      doneDate: checked === 1 ? utcIsoToLocalDate(sgTask.journalDate ?? start) : null,
      cancelledDate: checked === 2 ? utcIsoToLocalDate(sgTask.deleteDate) ?? utcIsoToLocalDate(sgTask.journalDate) ?? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : null,
      reminderDate,
      priority: priority != null ? mapPriorityFromSingularity(Number(priority)) : "high" /* High */,
      durationMinutes: typeof sgTask.timeLength === "number" ? sgTask.timeLength : null,
      recurrenceRule,
      lastSyncedAt: null,
      syncHash: null,
      stableHash: computeStableHash(this.obsidianTasksFile, `- [ ] #todo ${title}`)
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
  async writeTasks(tasks) {
    const byFile = /* @__PURE__ */ new Map();
    for (const task of tasks) {
      const targetPath = task.projectTag ? `${this.projectsFolder}/${sanitizeProjectName(task.projectTag)}.md` : this.obsidianTasksFile;
      if (!byFile.has(targetPath)) byFile.set(targetPath, []);
      byFile.get(targetPath).push(task);
    }
    for (const [filePath, fileTasks] of byFile) {
      await this.vaultWriter.writeTasksToFile(filePath, fileTasks);
    }
  }
};

// src/orchestrators/bidirectional-sync.ts
var BidirectionalSyncOrchestrator = class {
  constructor(vaultReader, apiClient, taskStore, obsidianTasksFile, vault, vaultWriter, excludeTags = [], dryRun = false, projectsFolder = "/project", conflictStrategy = "latest_wins" /* LatestWins */, conflictPromptFn, projectTemplate = "", lastKnownProjectFiles = {}, notesSectionMarker = "#### \u{1F4DD} Notes", lastKnownNoteHashes = {}, deleteProjectOnFileDelete = false, deltaSince = null) {
    this.conflictStrategy = conflictStrategy;
    this.conflictPromptFn = conflictPromptFn;
    this.projectTemplate = projectTemplate;
    this.lastKnownProjectFiles = lastKnownProjectFiles;
    this.notesSectionMarker = notesSectionMarker;
    this.lastKnownNoteHashes = lastKnownNoteHashes;
    this.deleteProjectOnFileDelete = deleteProjectOnFileDelete;
    this.deltaSince = deltaSince;
    this.vaultWriter = vaultWriter;
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
      lastKnownProjectFiles,
      notesSectionMarker,
      lastKnownNoteHashes,
      deleteProjectOnFileDelete
    );
  }
  getProjectFiles() {
    return this.reverse.getProjectFiles();
  }
  getNoteHashes() {
    return this.reverse.getNoteHashes();
  }
  async sync(tasksFile, projectsFolder, runId) {
    const tag = runId ? `sync:${runId} ` : "";
    this.forward.setRunTag(tag);
    this.reverse.setRunTag(tag);
    const stats = await this.forward.sync(tasksFile, projectsFolder, this.notesSectionMarker);
    const obsidianTasks = await this.forward.getVaultReader().readAllTasks(tasksFile, projectsFolder);
    await this.vaultWriter.normalizeTaskLines(obsidianTasks);
    const currentIds = new Set(obsidianTasks.map((t) => t.id));
    const currentStableHashes = new Set(obsidianTasks.map((t) => t.stableHash).filter(Boolean));
    const deletedIds = await this.forward.syncDeletedObsidianTasks(currentIds, currentStableHashes);
    stats.deleted += deletedIds.size;
    this.reverse.setDeletedFromObsidian(deletedIds);
    this.reverse.setArchivedObsidianIds(this.forward.getArchivedObsidianIds());
    const reverseStats = await this.reverse.sync(this.deltaSince);
    stats.singularityTasks = reverseStats.singularityTasks;
    stats.created += reverseStats.created;
    stats.updated += reverseStats.updated;
    stats.archived += reverseStats.archived;
    stats.errors += reverseStats.errors;
    stats.skipped += reverseStats.skipped;
    try {
      const sgTasks = await this.forward.getApiClient().getTasks(true, true);
      const sgIds = new Set(sgTasks.map((t) => t.id).filter(Boolean));
      stats.dbCleaned = await this.forward.getTaskStore().deleteOrphanedRecords(currentIds, sgIds);
    } catch (e) {
      console.warn(`[BidirectionalSync] cleanup skipped: failed to reload SG tasks:`, e?.message ?? e);
    }
    return stats;
  }
};

// src/ui/create-task-modal.ts
var import_obsidian10 = require("obsidian");

// src/domain/create-task.ts
var DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
var DATETIME_RE = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
function checkDate(value, label, errors, allowTime) {
  if (!value.trim()) return;
  const ok = allowTime ? DATE_RE.test(value.trim()) || DATETIME_RE.test(value.trim()) : DATE_RE.test(value.trim());
  if (!ok) {
    errors.push(
      allowTime ? `${label}: \u0444\u043E\u0440\u043C\u0430\u0442 YYYY-MM-DD \u0438\u043B\u0438 YYYY-MM-DD HH:mm` : `${label}: \u0444\u043E\u0440\u043C\u0430\u0442 YYYY-MM-DD`
    );
  }
}
function validateCreateForm(form) {
  const errors = [];
  if (!form.title.trim()) errors.push("\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u0434\u0430\u0447\u0438 \u043F\u0443\u0441\u0442\u043E\u0435");
  checkDate(form.created, "\u0421\u043E\u0437\u0434\u0430\u043D\u0430", errors, false);
  checkDate(form.reminder, "\u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435", errors, true);
  checkDate(form.start, "\u0421\u0442\u0430\u0440\u0442", errors, false);
  checkDate(form.scheduled, "\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0430", errors, false);
  checkDate(form.due, "\u0421\u0440\u043E\u043A", errors, false);
  if (form.duration.trim() && parseDurationMinutes(`\u23F1 ${form.duration.trim()}`) == null) {
    errors.push("\u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C: \u0444\u043E\u0440\u043C\u0430\u0442 30m / 2h / 1d / 1h30m");
  }
  if (form.notify.trim()) {
    if (!/^\d+([dhmDHM])?$/.test(form.notify.trim())) {
      errors.push("\u0423\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u0435: \u0447\u0438\u0441\u043B\u043E \u043C\u0438\u043D\u0443\u0442 \u0438\u043B\u0438 \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C (30, 1h)");
    }
  }
  return errors;
}
function parseTagsText(text) {
  return text.split(/[\s,]+/).map((t) => t.trim().replace(/^#+/, "")).filter((t) => t && t.toLowerCase() !== "todo");
}
function buildTaskFromForm(form, filePath, formatLine) {
  const tags = ["todo", ...parseTagsText(form.tags)];
  if (form.notify.trim()) {
    const mins = extractNotifyMinutes(`#notify/${form.notify.trim()}`);
    for (const n of mins) tags.push(n === 0 ? "notify" : `notify/${n}`);
  }
  const durationMinutes = form.duration.trim() ? parseDurationMinutes(`\u23F1 ${form.duration.trim()}`) : null;
  const provisional = {
    id: "",
    description: form.title.trim(),
    status: form.status,
    filePath,
    lineNumber: 0,
    depth: 0,
    parentId: null,
    tags,
    projectTag: form.projectName,
    dueDate: form.due.trim() || null,
    scheduledDate: form.scheduled.trim() || null,
    startDate: form.start.trim() || null,
    createdDate: form.created.trim() || null,
    doneDate: null,
    cancelledDate: null,
    reminderDate: form.reminder.trim() || null,
    priority: form.priority,
    durationMinutes,
    // R1 is read-only: no modal field; a 🔁 typed into the title is picked
    // up by the re-parse below.
    recurrenceRule: null,
    lastSyncedAt: null,
    syncHash: null,
    stableHash: null
  };
  const line = formatLine(provisional);
  const parsed = parseTaskLine(line, filePath, 0, form.projectName);
  if (!parsed) throw new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0431\u0440\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443 \u0437\u0430\u0434\u0430\u0447\u0438 \u0438\u0437 \u0444\u043E\u0440\u043C\u044B");
  return parsed;
}
function todayLocal() {
  const d = /* @__PURE__ */ new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// src/ui/create-task-modal.ts
var PRIORITY_OPTIONS = [
  { value: "none", label: "\u2014 \u0431\u0435\u0437 \u043F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442\u0430", priority: null },
  { value: "highest", label: "\u{1F53A} \u041D\u0430\u0438\u0432\u044B\u0441\u0448\u0438\u0439", priority: "highest" /* Highest */ },
  { value: "high", label: "\u23EB \u0412\u044B\u0441\u043E\u043A\u0438\u0439", priority: "high" /* High */ },
  { value: "medium", label: "\u{1F53C} \u0421\u0440\u0435\u0434\u043D\u0438\u0439", priority: "medium" /* Medium */ },
  { value: "low", label: "\u{1F53D} \u041D\u0438\u0437\u043A\u0438\u0439", priority: "low" /* Low */ },
  { value: "lowest", label: "\u23EC \u0421\u0430\u043C\u044B\u0439 \u043D\u0438\u0437\u043A\u0438\u0439", priority: "lowest" /* Lowest */ }
];
var CreateTaskModal = class extends import_obsidian10.Modal {
  constructor(app, projects, defaultProject, filePath) {
    super(app);
    this.projects = projects;
    this.filePath = filePath;
    this.resolve = () => {
    };
    this.settled = false;
    this.form = {
      title: "",
      status: "todo" /* Todo */,
      priority: null,
      projectName: defaultProject,
      created: todayLocal(),
      reminder: "",
      start: "",
      scheduled: "",
      due: "",
      duration: "",
      tags: "",
      notify: ""
    };
  }
  waitForResult() {
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.open();
    });
  }
  settle(value) {
    if (this.settled) return;
    this.settled = true;
    this.resolve(value);
    this.close();
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("singularity-create-modal");
    contentEl.createEl("h2", { text: "\u2795 \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u0434\u0430\u0447\u0430 Singularity" });
    new import_obsidian10.Setting(contentEl).setName("\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435").addText(
      (t) => t.setPlaceholder("\u0427\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C\u2026").onChange((v) => {
        this.form.title = v;
      })
    );
    new import_obsidian10.Setting(contentEl).setName("\u0421\u0442\u0430\u0442\u0443\u0441").addDropdown(
      (dd) => dd.addOption("todo", "\u25CB \u041E\u0442\u043A\u0440\u044B\u0442\u0430").addOption("done", "\u2705 \u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430").addOption("cancelled", "\u274C \u041E\u0442\u043C\u0435\u043D\u0435\u043D\u0430").setValue("todo").onChange((v) => {
        this.form.status = v;
      })
    );
    new import_obsidian10.Setting(contentEl).setName("\u041F\u0440\u0438\u043E\u0440\u0438\u0442\u0435\u0442").addDropdown((dd) => {
      for (const o of PRIORITY_OPTIONS) dd.addOption(o.value, o.label);
      dd.setValue("none").onChange((v) => {
        this.form.priority = PRIORITY_OPTIONS.find((o) => o.value === v)?.priority ?? null;
      });
    });
    new import_obsidian10.Setting(contentEl).setName("\u041F\u0440\u043E\u0435\u043A\u0442").setDesc("\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435 \u2014 \u0437\u0430\u0434\u0430\u0447\u0430 \u0431\u0435\u0437 \u043F\u0440\u043E\u0435\u043A\u0442\u0430").addDropdown((dd) => {
      dd.addOption("", "\u{1F4E5} \u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435");
      for (const p of this.projects) dd.addOption(p.title, p.title);
      dd.setValue(this.form.projectName ?? "").onChange((v) => {
        this.form.projectName = v || null;
      });
    });
    const dateRow = (name, desc, placeholder, key) => {
      new import_obsidian10.Setting(contentEl).setName(name).setDesc(desc).addText(
        (t) => t.setPlaceholder(placeholder).setValue(this.form[key]).onChange((v) => {
          this.form[key] = v;
        })
      );
    };
    dateRow("\u2795 \u0421\u043E\u0437\u0434\u0430\u043D\u0430", "\u0414\u0430\u0442\u0430 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F", "YYYY-MM-DD", "created");
    dateRow("\u23F0 \u041D\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u043D\u0438\u0435", "\u0414\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F", "YYYY-MM-DD HH:mm", "reminder");
    dateRow("\u{1F6EB} \u0421\u0442\u0430\u0440\u0442", "\u0414\u0430\u0442\u0430 \u043D\u0430\u0447\u0430\u043B\u0430", "YYYY-MM-DD", "start");
    dateRow("\u23F3 \u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u043D\u0430", "\u0414\u0430\u0442\u0430", "YYYY-MM-DD", "scheduled");
    dateRow("\u{1F4C5} \u0421\u0440\u043E\u043A", "\u0414\u0435\u0434\u043B\u0430\u0439\u043D", "YYYY-MM-DD", "due");
    new import_obsidian10.Setting(contentEl).setName("\u23F1 \u0414\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C").setDesc("\u041E\u0446\u0435\u043D\u043A\u0430 \u0432\u0440\u0435\u043C\u0435\u043D\u0438").addText(
      (t) => t.setPlaceholder("30m / 2h / 1d / 1h30m").onChange((v) => {
        this.form.duration = v;
      })
    );
    new import_obsidian10.Setting(contentEl).setName("\u0422\u0435\u0433\u0438").setDesc("\u0427\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E \u0438\u043B\u0438 \u043F\u0440\u043E\u0431\u0435\u043B, # \u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u0435\u043D").addText(
      (t) => t.setPlaceholder("\u0434\u043E\u043C, \u0441\u0440\u043E\u0447\u043D\u043E\u0435").onChange((v) => {
        this.form.tags = v;
      })
    );
    new import_obsidian10.Setting(contentEl).setName("\u{1F514} \u0423\u0432\u0435\u0434\u043E\u043C\u0438\u0442\u044C").setDesc("\u0417\u0430 \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043E \u23F0 (\u043F\u0443\u0441\u0442\u043E \u2014 \u0431\u0435\u0437 \u0443\u0432\u0435\u0434\u043E\u043C\u043B\u0435\u043D\u0438\u044F)").addText(
      (t) => t.setPlaceholder("30 / 1h").onChange((v) => {
        this.form.notify = v;
      })
    );
    const footer = contentEl.createDiv({ cls: "singularity-create-buttons" });
    const okBtn = footer.createEl("button", { text: "Ok", cls: "mod-cta" });
    okBtn.onclick = () => this.submit();
    const cancelBtn = footer.createEl("button", { text: "\u041E\u0442\u043C\u0435\u043D\u0430" });
    cancelBtn.onclick = () => this.settle(null);
  }
  submit() {
    const errors = validateCreateForm(this.form);
    if (errors.length > 0) {
      new import_obsidian10.Notice(`\u26A0\uFE0F ${errors[0]}`, 4e3);
      return;
    }
    try {
      const task = buildTaskFromForm(this.form, this.filePath, formatTaskLine);
      this.settle({ line: formatTaskLine(task), projectName: this.form.projectName });
    } catch (e) {
      new import_obsidian10.Notice(`\u26A0\uFE0F ${e?.message ?? e}`, 4e3);
    }
  }
  onClose() {
    const { contentEl } = this;
    contentEl.empty();
    if (!this.settled) {
      this.settled = true;
      this.resolve(null);
    }
  }
};

// src/main.ts
function formatElapsed(totalSeconds) {
  return formatElapsedDetail(totalSeconds);
}
var SingularitySyncPlugin = class extends import_obsidian11.Plugin {
  constructor() {
    super(...arguments);
    this.activeTimer = null;
    this.timerLog = [];
    this._syncing = false;
    this._ssWorking = true;
    this._habitsChangedCbs = /* @__PURE__ */ new Set();
  }
  async onload() {
    await this.loadSettings();
    this.taskStore = new TaskStore(async () => {
      const existing = await this.loadData() ?? {};
      const clean = { ...this.settings };
      delete clean.singularityApiKey;
      clean.syncState = this.taskStore.getAll();
      if (existing.habitState) clean.habitState = existing.habitState;
      if (existing.projectFiles) clean.projectFiles = existing.projectFiles;
      if (existing.noteHashes) clean.noteHashes = existing.noteHashes;
      if (existing.activeTimer) clean.activeTimer = existing.activeTimer;
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
    this.addCommand({
      id: "timer-stop",
      name: "\u041E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0442\u0440\u0435\u043A\u0438\u043D\u0433 \u0432\u0440\u0435\u043C\u0435\u043D\u0438",
      callback: () => this.stopTimer()
    });
    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor) => {
        menu.addItem(
          (item) => item.setTitle("\u2795 \u0417\u0430\u0434\u0430\u0447\u0430 Singularity").setIcon("list-plus").onClick(async () => {
            await this.insertTaskViaModal(editor);
          })
        );
      })
    );
    this.app.workspace.onLayoutReady(() => {
      setTimeout(() => this.restoreTimer().catch(() => {
      }), 800);
    });
    registerHabitsPostProcessor(this);
  }
  /** Init a view leaf: restore habit state, set up change callback, attach API client */
  async initView(view) {
    if (typeof view?.loadState !== "function") return;
    const data = await this.loadData() ?? {};
    if (data.habitState) view.loadState(data.habitState);
    view.setStateChangeCallback(async () => {
      const d = await this.loadData() ?? {};
      d.habitState = view.getState();
      delete d.singularityApiKey;
      delete d.singularityMcpToken;
      delete d.singularityMcpBaseUrl;
      await this.saveData(d);
      this.emitHabitsChanged();
    });
    view.habitDaysCount = this.settings.habitDaysCount;
    view.activeTimerTaskId = this.activeTimer?.taskId ?? null;
    view.activeTimerStartIso = this.activeTimer?.startIso ?? null;
    view.localOnlyTimer = this.settings.localOnlyTimer ?? false;
    view.setTimerToggleCallback(async (sgTaskId, title) => {
      await this.toggleTimer(sgTaskId, title);
    });
    view.setTimerLogCallbacks(
      () => this.getTimerLog(),
      async () => {
        await this.clearTimerLog();
      }
    );
    view.setTaskCheckCallback(async (sgTaskId, checked, title) => {
      if (!title) return;
      const state = this.taskStore.getBySingularityId(sgTaskId);
      const filePath = state?.obsidianFilePath || this.settings.obsidianTasksFile;
      const relPath = filePath.replace(/^\/+/, "");
      const file = this.app.vault.getAbstractFileByPath(relPath);
      if (!(file instanceof import_obsidian11.TFile)) return;
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
  /** Project display name for a vault-relative file path, or null for inbox. */
  projectNameForFile(vaultPath) {
    if (!vaultPath) return null;
    const folder = this.settings.obsidianProjectsFolder.replace(/^\/+|\/+$/g, "");
    if (vaultPath.startsWith(folder + "/") && vaultPath.endsWith(".md")) {
      const base = vaultPath.slice(folder.length + 1, -3);
      if (base && !base.includes("/")) return base;
    }
    return null;
  }
  /** Right-click → modal with all fields → insert → auto-sync.
   * Variant C: when the chosen project differs from the cursor file's
   * project, the task goes to the target project's tasks section end
   * instead of the cursor (file = project in this architecture). */
  async insertTaskViaModal(editor) {
    const view = this.app.workspace.getActiveViewOfType(import_obsidian11.MarkdownView);
    const file = view?.file ?? this.app.workspace.getActiveFile();
    const vaultPath = file?.path ?? null;
    const filePath = vaultPath ? `/${vaultPath}` : this.settings.obsidianTasksFile;
    const fileProject = this.projectNameForFile(vaultPath);
    const client = this.getApiClient();
    let projects = [];
    if (client) {
      try {
        projects = (await client.getProjects(false, false, 200)).filter((p) => p.id && p.title && !p.isNotebook).map((p) => ({ id: p.id, title: p.title }));
      } catch {
        new import_obsidian11.Notice("\u26A0\uFE0F \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0440\u043E\u0435\u043A\u0442\u044B \u2014 \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435", 4e3);
      }
    }
    const result = await new CreateTaskModal(this.app, projects, fileProject, filePath).waitForResult();
    if (!result) return;
    const chosen = result.projectName;
    const sameProject = chosen === null && fileProject === null || !!chosen && !!fileProject && chosen.toLowerCase() === fileProject.toLowerCase();
    if (sameProject) {
      editor.replaceSelection(result.line);
    } else {
      const targetPath = chosen ? `${this.settings.obsidianProjectsFolder.replace(/\/+$/, "")}/${sanitizeProjectName(chosen)}.md` : this.settings.obsidianTasksFile;
      const parsed = parseTaskLine(result.line, targetPath, 0, chosen);
      if (!parsed) {
        new import_obsidian11.Notice("\u26A0\uFE0F \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0431\u0440\u0430\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443 \u0437\u0430\u0434\u0430\u0447\u0438", 4e3);
        return;
      }
      const writer = new ObsidianVaultWriter(this.app.vault, this.settings.tasksSectionMarker);
      await writer.writeTasksToFile(targetPath, [parsed]);
      new import_obsidian11.Notice(`\u2705 \u0417\u0430\u0434\u0430\u0447\u0430 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432 ${chosen ?? "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435"}`);
    }
    await this.runSync();
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
  onHabitsChanged(cb) {
    this._habitsChangedCbs.add(cb);
  }
  offHabitsChanged(cb) {
    this._habitsChangedCbs.delete(cb);
  }
  emitHabitsChanged() {
    this._habitsChangedCbs.forEach((cb) => cb());
  }
  getApiClient() {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;
    return new SingularityAPIClient({
      apiKey,
      baseUrl: this.settings.singularityApiBaseUrl
    });
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
        new import_obsidian11.Notice("\u{1F511} \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 Obsidian", 3e3);
        return;
      }
    } catch (e) {
      new import_obsidian11.Notice(`\u274C ${e?.message || e}`, 3e3);
    }
    this.settings.singularityApiKey = key;
    this.saveSettings();
    new import_obsidian11.Notice("\u{1F511} \u041A\u043B\u044E\u0447 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445", 3e3);
  }
  removeApiKey() {
    try {
      const ss = this.app?.secretStorage;
      if (ss && typeof ss.setSecret === "function") ss.setSecret("singularity", "");
    } catch {
    }
    this.settings.singularityApiKey = "";
    this.saveSettings();
    new import_obsidian11.Notice("\u{1F5D1}\uFE0F \u041A\u043B\u044E\u0447 \u0443\u0434\u0430\u043B\u0451\u043D", 3e3);
  }
  async runSync() {
    if (this._syncing) {
      new import_obsidian11.Notice("\u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0443\u0436\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u0435\u0442\u0441\u044F\u2026", 2500);
      return;
    }
    this._syncing = true;
    new import_obsidian11.Notice("\u{1F504} \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F...");
    let stats = null;
    try {
      const problems = validateSyncSettings(this.settings, this.hasApiKey());
      if (problems.length > 0) {
        const shown = problems.slice(0, 3).join("; ");
        const more = problems.length > 3 ? ` (+${problems.length - 3})` : "";
        new import_obsidian11.Notice(`\u274C \u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438: ${shown}${more}`, 8e3);
        return;
      }
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
      let manualCount = 0;
      let bulkChoice = null;
      const conflictPromptFn = async (obTask, sgTask, state, reason, _msg) => {
        if (bulkChoice) return bulkChoice;
        manualCount++;
        const choice = await new ConflictModal(this.app, obTask, sgTask, state, {
          reason,
          progress: { current: manualCount },
          resolveProjectName: async (projectId) => {
            const proj = await apiClient.getProjectById(projectId);
            return proj?.title ?? null;
          },
          resolveTagName: async (tagId) => apiClient.getTagTitle(tagId),
          resolveGroupName: async (groupId) => apiClient.getTaskGroupTitle(groupId)
        }).waitForChoice();
        if (choice === "obsidian_all") {
          bulkChoice = "obsidian";
          new import_obsidian11.Notice("\u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u043E \u043A\u043E \u0432\u0441\u0435\u043C: \u0432\u0435\u0440\u0441\u0438\u044F Obsidian", 3e3);
          return "obsidian";
        }
        if (choice === "singularity_all") {
          bulkChoice = "singularity";
          new import_obsidian11.Notice("\u041F\u0440\u0438\u043C\u0435\u043D\u0435\u043D\u043E \u043A\u043E \u0432\u0441\u0435\u043C: \u0432\u0435\u0440\u0441\u0438\u044F Singularity", 3e3);
          return "singularity";
        }
        return choice;
      };
      const FULL_SYNC_INTERVAL_MS = 24 * 3600 * 1e3;
      const nowIso = (/* @__PURE__ */ new Date()).toISOString();
      const lastFull = data.lastFullSyncAt ?? null;
      const lastFullMs = lastFull ? Date.parse(lastFull) : NaN;
      const fullDue = !lastFull || isNaN(lastFullMs) || Date.parse(nowIso) - lastFullMs >= FULL_SYNC_INTERVAL_MS;
      const deltaSince = fullDue ? null : data.lastDeltaSyncAt ?? lastFull;
      if (!fullDue) console.log(`[SingularitySync] delta sync since ${deltaSince}`);
      const runId = `${Date.now().toString(36)}${Math.floor(Math.random() * 16777215).toString(36)}`;
      const runStartedAt = Date.now();
      console.log(`[SingularitySync] run ${runId} started (${fullDue ? "full" : "delta"})`);
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
        data.projectFiles ?? {},
        this.settings.notesSectionMarker,
        data.noteHashes ?? {},
        this.settings.deleteProjectOnFileDelete ?? false,
        deltaSince
      );
      stats = await orchestrator.sync(
        this.settings.obsidianTasksFile,
        this.settings.obsidianProjectsFolder,
        runId
      );
      const syncState = this.taskStore.getAll();
      data.syncState = syncState;
      data.projectFiles = orchestrator.getProjectFiles();
      data.noteHashes = orchestrator.getNoteHashes();
      data.lastDeltaSyncAt = nowIso;
      if (fullDue) data.lastFullSyncAt = nowIso;
      data.lastSync = {
        runId,
        at: nowIso,
        mode: fullDue ? "full" : "delta",
        durationMs: Date.now() - runStartedAt,
        stats: stats ? {
          created: stats.created,
          updated: stats.updated,
          archived: stats.archived,
          deleted: stats.deleted,
          errors: stats.errors,
          skipped: stats.skipped,
          dbCleaned: stats.dbCleaned
        } : null
      };
      await this.saveData(data);
      console.log(`[SingularitySync] run ${runId} finished in ${data.lastSync.durationMs}ms`, data.lastSync.stats);
      const now = /* @__PURE__ */ new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      this.statusBar.setText(`Singularity: \u2705 ${time}`);
      if (this.activeTimer) this.renderTimerStatus();
      let msg = `\u2705 \u0421\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430 (${fullDue ? "\u043F\u043E\u043B\u043D\u0430\u044F" : "\u0434\u0435\u043B\u044C\u0442\u0430"})`;
      if (stats.dbCleaned > 0) msg += `. \u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0435\u043D\u043E ${stats.dbCleaned} \u0437\u0430\u0434\u0430\u0447-\u043F\u0440\u0438\u0437\u0440\u0430\u043A\u043E\u0432`;
      new import_obsidian11.Notice(msg, 3e3);
      this.refreshSingularityView();
    } catch (e) {
      const errMsg = e?.message || String(e);
      new import_obsidian11.Notice(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430: ${errMsg}`, 5e3);
    } finally {
      this._syncing = false;
    }
  }
  async refreshSingularityView() {
    const leaves = this.app.workspace.getLeavesOfType(SINGULARITY_VIEW_TYPE);
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view?.refresh) await view.refresh();
    }
  }
  // ===== Time tracking =====
  async restoreTimer() {
    const data = await this.loadData() ?? {};
    const t = data.activeTimer;
    if (t?.taskId && t?.startIso && !isNaN(Date.parse(t.startIso))) {
      this.activeTimer = { taskId: t.taskId, title: t.title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)", startIso: t.startIso };
      this.renderTimerStatus();
      this.syncTimerToViews();
    }
    if (Array.isArray(data.timerLog)) {
      this.timerLog = data.timerLog.filter((e) => e?.taskId && e?.start && e?.end).slice(0, TIMER_LOG_CAP);
    }
  }
  async persistTimer() {
    const data = await this.loadData() ?? {};
    if (this.activeTimer) data.activeTimer = { ...this.activeTimer };
    else delete data.activeTimer;
    data.timerLog = [...this.timerLog];
    delete data.singularityApiKey;
    delete data.singularityMcpToken;
    delete data.singularityMcpBaseUrl;
    await this.saveData(data);
  }
  renderTimerStatus() {
    if (!this.statusBar) return;
    if (this.activeTimer) {
      this.statusBar.setText(`Singularity: \u23F1 ${formatClockIso(this.activeTimer.startIso)} ${this.activeTimer.title}`);
    } else {
      this.statusBar.setText("Singularity: \u2014");
    }
  }
  /** Push timer + local-only flags to open sidebar views. */
  syncTimerToViews() {
    const leaves = this.app.workspace.getLeavesOfType(SINGULARITY_VIEW_TYPE);
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view && "activeTimerTaskId" in view) {
        view.activeTimerTaskId = this.activeTimer?.taskId ?? null;
        view.activeTimerStartIso = this.activeTimer?.startIso ?? null;
        view.localOnlyTimer = this.settings.localOnlyTimer ?? false;
      }
    }
  }
  /** Local journal of stopped sessions (newest first) for manual entry. */
  getTimerLog() {
    return [...this.timerLog];
  }
  async clearTimerLog() {
    this.timerLog = [];
    await this.persistTimer();
    await this.refreshSingularityView();
  }
  async toggleTimer(sgTaskId, title) {
    if (this.activeTimer?.taskId === sgTaskId) {
      await this.stopTimer();
      return;
    }
    if (this.activeTimer) await this.stopTimer(true);
    this.activeTimer = { taskId: sgTaskId, title: title || "(\u0431\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F)", startIso: (/* @__PURE__ */ new Date()).toISOString() };
    await this.persistTimer();
    this.renderTimerStatus();
    this.syncTimerToViews();
    new import_obsidian11.Notice(`\u25B6 \u0422\u0440\u0435\u043A\u043A\u0438\u043D\u0433: ${this.activeTimer.title}`);
    await this.refreshSingularityView();
  }
  async stopTimer(silent = false) {
    if (!this.activeTimer) {
      if (!silent) new import_obsidian11.Notice("\u041D\u0435\u0442 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0442\u0440\u0435\u043A\u0438\u043D\u0433\u0430");
      return;
    }
    const { taskId, title, startIso } = this.activeTimer;
    const endDate = /* @__PURE__ */ new Date();
    const elapsed = Math.max(0, Math.floor((endDate.getTime() - Date.parse(startIso)) / 1e3));
    const entry = {
      taskId,
      title,
      date: todayLocalDate(endDate),
      start: formatClockIso(startIso),
      end: `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`,
      minutes: Math.round(elapsed / 60)
    };
    this.activeTimer = null;
    this.timerLog = appendLog(this.timerLog, entry);
    await this.persistTimer();
    this.renderTimerStatus();
    this.syncTimerToViews();
    if (!this.settings.localOnlyTimer) {
      const client = this.getApiClient();
      if (client && elapsed > 0) {
        try {
          await client.createTimeStat(new Date(startIso).toISOString(), elapsed, taskId);
        } catch (e) {
          const code = e?.statusCode;
          new import_obsidian11.Notice(
            code === 403 ? "\u26A0\uFE0F \u041D\u0435\u0442 scope \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u0443 \u0442\u043E\u043A\u0435\u043D\u0430 \u2014 \u0437\u0430\u043F\u0438\u0441\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0436\u0443\u0440\u043D\u0430\u043B. \u0412\u043A\u043B\u044E\u0447\u0438\u0442\u0435 local-only \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445." : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0437\u0430\u043F\u0438\u0441\u044C \u0432\u0440\u0435\u043C\u0435\u043D\u0438 \u2014 \u0434\u0430\u043D\u043D\u044B\u0435 \u0432 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u043C \u0436\u0443\u0440\u043D\u0430\u043B\u0435",
            6e3
          );
        }
      }
    }
    if (!silent) new import_obsidian11.Notice(`\u23F9 ${title}: ${entry.start} \u2192 ${entry.end} (${formatElapsed(elapsed)})`);
    await this.refreshSingularityView();
  }
  async resetAndSync() {
    new import_obsidian11.Notice("\u{1F5D1}\uFE0F \u0421\u0431\u0440\u043E\u0441 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F...", 2e3);
    this.taskStore.deleteAll();
    const data = await this.loadData() ?? {};
    data.syncState = [];
    delete data.singularityApiKey;
    delete data.singularityMcpToken;
    delete data.singularityMcpBaseUrl;
    await this.saveData(data);
    new import_obsidian11.Notice("\u{1F504} \u0427\u0438\u0441\u0442\u0430\u044F \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F...", 2e3);
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
      new import_obsidian11.Notice(ok ? "\u2705 \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043A Singularity \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442" : "\u274C \u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 API \u043A\u043B\u044E\u0447");
    } catch (e) {
      this.statusBar.setText("Singularity: \u274C");
      new import_obsidian11.Notice(`\u274C \u041E\u0448\u0438\u0431\u043A\u0430: ${e.message}`);
    }
  }
  async loadSettings() {
    let data = await this.loadData() ?? {};
    delete data.singularityApiKey;
    delete data.singularityMcpToken;
    delete data.singularityMcpBaseUrl;
    delete data.dbPath;
    delete data.logLevel;
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  }
  async saveSettings() {
    const data = await this.loadData() ?? {};
    const clean = { ...this.settings };
    delete clean.singularityApiKey;
    if (this.taskStore) clean.syncState = this.taskStore.getAll();
    if (data.projectFiles) clean.projectFiles = data.projectFiles;
    if (data.noteHashes) clean.noteHashes = data.noteHashes;
    if (data.habitState) clean.habitState = data.habitState;
    if (data.activeTimer) clean.activeTimer = data.activeTimer;
    if (data.timerLog) clean.timerLog = data.timerLog;
    await this.saveData(clean);
  }
};
