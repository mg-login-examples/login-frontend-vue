import {
  Reporter,
  // Suite,
  TestCase,
  TestResult,
  TestStep,
} from "@playwright/test/reporter";

class MyReporter implements Reporter {
  onStepEnd(test: TestCase, result: TestResult, step: TestStep) {
    console.log(step.title);
  }
}
export default MyReporter;
