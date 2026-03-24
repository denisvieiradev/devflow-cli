import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { join } from "node:path";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { scanProject } from "../../../src/core/scanner.js";

describe("ProjectScanner", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "devflow-scanner-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("should detect TypeScript project", async () => {
    await writeFile(join(tempDir, "package.json"), JSON.stringify({ devDependencies: { jest: "^29" } }));
    await writeFile(join(tempDir, "tsconfig.json"), "{}");
    const result = await scanProject(tempDir);
    expect(result.language).toBe("typescript");
  });

  it("should detect JavaScript project without tsconfig", async () => {
    await writeFile(join(tempDir, "package.json"), JSON.stringify({}));
    const result = await scanProject(tempDir);
    expect(result.language).toBe("javascript");
  });

  it("should detect Python project", async () => {
    await writeFile(join(tempDir, "requirements.txt"), "flask\n");
    const result = await scanProject(tempDir);
    expect(result.language).toBe("python");
    expect(result.framework).toBe("flask");
  });

  it("should detect Go project", async () => {
    await writeFile(join(tempDir, "go.mod"), "module example.com/myapp");
    const result = await scanProject(tempDir);
    expect(result.language).toBe("go");
    expect(result.testFramework).toBe("go test");
  });

  it("should detect Rust project", async () => {
    await writeFile(join(tempDir, "Cargo.toml"), "[package]\nname = \"myapp\"");
    const result = await scanProject(tempDir);
    expect(result.language).toBe("rust");
    expect(result.testFramework).toBe("cargo test");
  });

  it("should detect React framework", async () => {
    await writeFile(
      join(tempDir, "package.json"),
      JSON.stringify({ dependencies: { react: "^18" } }),
    );
    await writeFile(join(tempDir, "tsconfig.json"), "{}");
    const result = await scanProject(tempDir);
    expect(result.framework).toBe("react");
  });

  it("should detect Jest test framework", async () => {
    await writeFile(join(tempDir, "package.json"), JSON.stringify({}));
    await writeFile(join(tempDir, "tsconfig.json"), "{}");
    await writeFile(join(tempDir, "jest.config.ts"), "export default {}");
    const result = await scanProject(tempDir);
    expect(result.testFramework).toBe("jest");
  });

  it("should detect CI via GitHub Actions", async () => {
    await writeFile(join(tempDir, "package.json"), JSON.stringify({}));
    await mkdir(join(tempDir, ".github", "workflows"), { recursive: true });
    const result = await scanProject(tempDir);
    expect(result.hasCI).toBe(true);
  });

  it("should return unknown for empty project", async () => {
    const result = await scanProject(tempDir);
    expect(result.language).toBe("unknown");
    expect(result.framework).toBeNull();
    expect(result.testFramework).toBeNull();
    expect(result.hasCI).toBe(false);
  });
});
