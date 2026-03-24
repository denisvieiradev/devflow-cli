export interface DevflowConfig {
  provider: "claude";
  models: {
    fast: string;
    balanced: string;
    powerful: string;
  };
  language: "en";
  commitConvention: "conventional";
  branchPattern: string;
  templatesPath: string;
  contextMode: ContextMode;
  project: ProjectInfo;
}

export interface ProjectInfo {
  name: string;
  language: string;
  framework: string | null;
  testFramework: string | null;
  hasCI: boolean;
}

export type ContextMode = "light" | "normal";

export interface DevflowState {
  features: Record<string, FeatureState>;
}

export interface FeatureState {
  slug: string;
  number: number;
  phase: Phase;
  tasks: TaskState[];
  artifacts: Record<string, ArtifactMeta>;
  createdAt: string;
  updatedAt: string;
}

export type Phase =
  | "initialized"
  | "prd_created"
  | "techspec_created"
  | "tasks_created"
  | "in_progress"
  | "testing"
  | "reviewing"
  | "pr_created"
  | "done";

export const PHASE_ORDER: Phase[] = [
  "initialized",
  "prd_created",
  "techspec_created",
  "tasks_created",
  "in_progress",
  "testing",
  "reviewing",
  "pr_created",
  "done",
];

export interface ArtifactMeta {
  path: string;
  createdAt: string;
  updatedAt: string;
  hash: string;
}

export interface TaskState {
  number: number;
  title: string;
  completed: boolean;
}

export const DEFAULT_CONFIG: DevflowConfig = {
  provider: "claude",
  models: {
    fast: "claude-haiku-4-5-20251001",
    balanced: "claude-sonnet-4-5-20250929",
    powerful: "claude-opus-4-5-20250929",
  },
  language: "en",
  commitConvention: "conventional",
  branchPattern: "feature/{{slug}}",
  templatesPath: ".devflow/templates",
  contextMode: "normal",
  project: {
    name: "",
    language: "unknown",
    framework: null,
    testFramework: null,
    hasCI: false,
  },
};

export const EMPTY_STATE: DevflowState = {
  features: {},
};
