// TCV-7055: Cucumber expects the formatter output directory to exist.
import { mkdirSync } from "node:fs";

mkdirSync("reports", { recursive: true });
