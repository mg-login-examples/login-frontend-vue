import {
  type AllureConfig,
  AllureGroup,
  AllureRuntime,
  LabelName,
  Status,
} from "allure-js-commons";

import type { File, Reporter, Task } from "vitest";

export class AllureReporter implements Reporter {
  private allureRuntime: AllureRuntime | null;

  constructor(config?: Partial<AllureConfig>) {
    this.allureRuntime = new AllureRuntime({
      resultsDir: "src/allure-results",
      ...config,
    });
  }

  onFinished(files?: File[]) {
    if (!this.allureRuntime) {
      return;
    }

    const rootSuite = this.allureRuntime.startGroup(undefined);
    for (const file of files || []) {
      const group = rootSuite.startGroup(file.name);
      group.name = file.name;
      for (const task of file.tasks) {
        this.handleTask(group, task);
      }
      group.endGroup();
    }
    rootSuite.endGroup();
  }

  handleTask(parent: AllureGroup, task: Task) {
    if (task.type === "suite") {
      const group = parent.startGroup(task.name);
      group.name = task.name;
      for (const innerTask of task.tasks) {
        this.handleTask(group, innerTask);
      }
      group.endGroup();
    } else {
      const test = parent.startTest(task.name, 0);
      test.name = task.name;
      test.fullName = `${task.file?.name}#${task.name}`;
      switch (task.result?.state) {
        case "fail": {
          test.detailsMessage = task.result.error?.message;
          test.detailsTrace = task.result.error?.stackStr;
          test.status = Status.FAILED;
          break;
        }
        case "pass": {
          test.status = Status.PASSED;
          break;
        }
        case "skip": {
          test.status = Status.SKIPPED;
          break;
        }
      }
      test.addLabel(LabelName.SUITE, parent.name);
      if (task.suite.suite?.name) {
        test.addLabel(LabelName.PARENT_SUITE, task.suite.suite.name);
      }
      test.historyId = task.id;
      test.endTest(task.result?.duration);
    }
  }
}
