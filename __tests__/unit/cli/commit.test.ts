import { describe, it, expect, jest, beforeEach } from "@jest/globals";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockChat = jest.fn<any>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockConfirm = jest.fn<any>();

jest.mock("../../../src/core/config.js", () => ({
  readConfig: jest.fn(),
}));

jest.mock("../../../src/providers/claude.js", () => ({
  ClaudeProvider: jest.fn().mockImplementation(() => ({
    chat: mockChat,
  })),
  validateApiKey: jest.fn(),
  handleLLMError: jest.fn(),
}));

jest.mock("../../../src/providers/model-router.js", () => ({
  resolveModelTier: () => "fast",
}));

jest.mock("../../../src/infra/git.js", () => ({
  getStagedDiff: jest.fn(),
  commit: jest.fn(),
  getBranch: jest.fn<() => Promise<string>>().mockResolvedValue("feature/test"),
  push: jest.fn(),
}));

jest.mock("@clack/prompts", () => ({
  intro: jest.fn(),
  cancel: jest.fn(),
  outro: jest.fn(),
  log: { info: jest.fn(), success: jest.fn(), message: jest.fn() },
  confirm: jest.fn(),
  isCancel: () => false,
}));

import { readConfig } from "../../../src/core/config.js";
import { handleLLMError } from "../../../src/providers/claude.js";
import * as git from "../../../src/infra/git.js";
import * as p from "@clack/prompts";
import { makeCommitCommand } from "../../../src/cli/commands/commit.js";

const mockReadConfig = readConfig as jest.MockedFunction<typeof readConfig>;
const mockGetStagedDiff = git.getStagedDiff as jest.MockedFunction<typeof git.getStagedDiff>;
const mockGitCommit = git.commit as jest.MockedFunction<typeof git.commit>;
const mockHandleLLMError = handleLLMError as jest.MockedFunction<typeof handleLLMError>;

describe("commit command", () => {
  const mockExit = jest.spyOn(process, "exit").mockImplementation((() => {
    throw new Error("process.exit");
  }) as never);

  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p.confirm as any).mockResolvedValue(true);
  });

  it("should exit when no config found", async () => {
    mockReadConfig.mockResolvedValue(null);
    const cmd = makeCommitCommand();
    await expect(cmd.parseAsync(["node", "test"])).rejects.toThrow("process.exit");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should exit when no staged changes", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockReadConfig.mockResolvedValue({ models: {}, contextMode: "normal" } as any);
    mockGetStagedDiff.mockResolvedValue("");
    const cmd = makeCommitCommand();
    await expect(cmd.parseAsync(["node", "test"])).rejects.toThrow("process.exit");
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it("should generate commit message and commit on confirmation", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockReadConfig.mockResolvedValue({ models: { fast: "haiku" }, contextMode: "normal" } as any);
    mockGetStagedDiff.mockResolvedValue("diff --git a/file.ts");
    mockChat.mockResolvedValue({
      content: "feat(core): add new feature",
      usage: { inputTokens: 10, outputTokens: 5 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p.confirm as any).mockResolvedValue(true);
    mockGitCommit.mockResolvedValue("abc1234");

    const cmd = makeCommitCommand();
    await cmd.parseAsync(["node", "test"]);

    expect(mockChat).toHaveBeenCalledTimes(1);
    expect(mockGitCommit).toHaveBeenCalledWith(
      expect.any(String),
      "feat(core): add new feature",
    );
  });

  it("should exit when user cancels confirmation", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockReadConfig.mockResolvedValue({ models: { fast: "haiku" }, contextMode: "normal" } as any);
    mockGetStagedDiff.mockResolvedValue("diff --git a/file.ts");
    mockChat.mockResolvedValue({
      content: "feat: something",
      usage: { inputTokens: 10, outputTokens: 5 },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p.confirm as any).mockResolvedValue(false);

    const cmd = makeCommitCommand();
    await expect(cmd.parseAsync(["node", "test"])).rejects.toThrow("process.exit");
    expect(mockGitCommit).not.toHaveBeenCalled();
  });

  it("should handle LLM error gracefully", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockReadConfig.mockResolvedValue({ models: { fast: "haiku" }, contextMode: "normal" } as any);
    mockGetStagedDiff.mockResolvedValue("diff --git a/file.ts");
    mockChat.mockRejectedValue(new Error("API error"));

    const cmd = makeCommitCommand();
    await cmd.parseAsync(["node", "test"]);

    expect(mockHandleLLMError).toHaveBeenCalled();
    expect(mockGitCommit).not.toHaveBeenCalled();
  });
});
