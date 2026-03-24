import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { fileExists } from "../infra/filesystem.js";
import { debug } from "../infra/logger.js";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const BUNDLED_TEMPLATES_PATH = join(CURRENT_DIR, "..", "..", "templates");

export class TemplateEngine {
  private readonly projectTemplatesPath: string;
  private readonly bundledTemplatesPath: string;

  constructor(projectTemplatesPath: string) {
    this.projectTemplatesPath = projectTemplatesPath;
    this.bundledTemplatesPath = BUNDLED_TEMPLATES_PATH;
  }

  async load(templateName: string): Promise<string> {
    const overridePath = join(this.projectTemplatesPath, `${templateName}.md`);
    if (await fileExists(overridePath)) {
      debug("Loading project template override", { path: overridePath });
      return readFile(overridePath, "utf-8");
    }
    const defaultPath = join(this.bundledTemplatesPath, `${templateName}.md`);
    if (await fileExists(defaultPath)) {
      debug("Loading bundled template", { path: defaultPath });
      return readFile(defaultPath, "utf-8");
    }
    throw new Error(`Template '${templateName}' not found`);
  }

  interpolate(template: string, vars: Record<string, string>): string {
    return template.replace(
      /\{\{(\w+)\}\}/g,
      (match, key: string) => vars[key] ?? match,
    );
  }

  validateRequiredVars(
    template: string,
    requiredVars: string[],
    vars: Record<string, string>,
  ): string[] {
    const missing: string[] = [];
    for (const varName of requiredVars) {
      if (template.includes(`{{${varName}}}`) && !(varName in vars)) {
        missing.push(varName);
      }
    }
    return missing;
  }
}
