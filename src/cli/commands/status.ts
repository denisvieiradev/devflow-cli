import { Command } from "commander";
import * as p from "@clack/prompts";
import { readConfig } from "../../core/config.js";
import { readState } from "../../core/state.js";
import type { FeatureState, Phase } from "../../core/types.js";

const PHASE_LABELS: Record<Phase, string> = {
  initialized: "Initialized",
  prd_created: "PRD Created",
  techspec_created: "Tech Spec Created",
  tasks_created: "Tasks Created",
  in_progress: "In Progress",
  testing: "Testing",
  reviewing: "Reviewing",
  pr_created: "PR Created",
  done: "Done",
};

const NEXT_STEP: Record<Phase, string> = {
  initialized: "devflow prd <desc>",
  prd_created: "devflow techspec <ref>",
  techspec_created: "devflow tasks <ref>",
  tasks_created: "devflow run-tasks <ref>",
  in_progress: "devflow test <ref>",
  testing: "devflow review <ref>",
  reviewing: "devflow pr <ref>",
  pr_created: "devflow done <ref>",
  done: "Complete",
};

export function makeStatusCommand(): Command {
  return new Command("status")
    .description("Show status of all features")
    .action(async () => {
      const cwd = process.cwd();
      p.intro("devflow status");
      const config = await readConfig(cwd);
      if (!config) {
        p.cancel("No config found. Run `devflow init` first.");
        process.exit(1);
      }
      const state = await readState(cwd);
      const features = Object.entries(state.features);
      if (features.length === 0) {
        p.log.info("No features found. Start with `devflow prd <description>`.");
        p.outro("");
        return;
      }
      for (const [ref, feature] of features) {
        const completedTasks = feature.tasks.filter((t) => t.completed).length;
        const totalTasks = feature.tasks.length;
        const phaseLabel = PHASE_LABELS[feature.phase] ?? feature.phase;
        const nextStep = NEXT_STEP[feature.phase] ?? "unknown";
        p.log.info(`${ref}`);
        p.log.message(`  Phase: ${phaseLabel}`);
        if (totalTasks > 0) {
          p.log.message(`  Tasks: ${completedTasks}/${totalTasks} completed`);
        }
        p.log.message(`  Next: ${nextStep}`);
        p.log.message("");
      }
      p.outro(`${features.length} feature(s) tracked.`);
    });
}
