/**
 * @jest-environment node
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COMPONENTS_DIR = path.join(ROOT, "src", "components");
const HOOKS_DIR = path.join(ROOT, "src", "hooks");

const listFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
};

const toRepoPath = (file: string) =>
  path.relative(ROOT, file).split(path.sep).join("/");

describe("Architecture: file naming", () => {
  it("every .tsx file in src/components ends with .component.tsx", () => {
    // Arrange
    const tsxFiles = listFiles(COMPONENTS_DIR).filter((file) =>
      file.endsWith(".tsx"),
    );

    // Act
    const violations = tsxFiles
      .filter((file) => !file.endsWith(".component.tsx"))
      .map(toRepoPath);

    // Assert
    expect(tsxFiles.length).toBeGreaterThan(0);
    expect(violations).toStrictEqual([]);
  });

  it("every file in src/hooks starts with use", () => {
    // Arrange
    const hookFiles = listFiles(HOOKS_DIR);

    // Act
    const violations = hookFiles
      .filter((file) => !path.basename(file).startsWith("use"))
      .map(toRepoPath);

    // Assert
    expect(hookFiles.length).toBeGreaterThan(0);
    expect(violations).toStrictEqual([]);
  });
});
