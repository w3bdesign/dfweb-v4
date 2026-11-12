/**
 * @jest-environment node
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

/**
 * Which layer may import from which. A layer may always import from itself.
 * Keep in sync with the layer table in AGENTS.md.
 */
const ALLOWED_IMPORTS: Record<string, readonly string[]> = {
  app: ["components", "hooks", "lib", "utils", "types"],
  components: ["hooks", "lib", "utils", "types"],
  hooks: ["lib", "utils", "types"],
  lib: ["utils", "types"],
  utils: ["types"],
  types: [],
};

const LAYERS = Object.keys(ALLOWED_IMPORTS);

/** Folders that production code must never import from. */
const NON_PRODUCTION_FOLDERS = ["__tests__", "__mocks__", "stories", "e2e"];

const SOURCE_EXTENSIONS = [".ts", ".tsx"];

const IMPORT_PATTERNS = [
  /\bfrom\s+["']([^"']+)["']/g,
  /\bimport\s+["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
];

type ImportRecord = { file: string; specifier: string };

/** Installed or generated folders that are not project source. */
const SKIPPED_FOLDERS = ["node_modules", "dist"];

const listFiles = (dir: string): string[] => {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return SKIPPED_FOLDERS.includes(entry.name) ? [] : listFiles(fullPath);
    }
    return [fullPath];
  });
};

const toRepoPath = (file: string) =>
  path.relative(ROOT, file).split(path.sep).join("/");

const extractSpecifiers = (source: string): string[] =>
  IMPORT_PATTERNS.flatMap((pattern) =>
    Array.from(source.matchAll(pattern), (match) => match[1]),
  );

const collectImports = (): ImportRecord[] =>
  LAYERS.flatMap((layer) =>
    listFiles(path.join(SRC, layer))
      .filter((file) => SOURCE_EXTENSIONS.includes(path.extname(file)))
      .flatMap((file) =>
        extractSpecifiers(fs.readFileSync(file, "utf8")).map((specifier) => ({
          file,
          specifier,
        })),
      ),
  );

const layerOfFile = (file: string): string =>
  path.relative(SRC, file).split(path.sep)[0];

/** Returns the top-level src folder a specifier points to, or null for packages. */
const targetFolder = (file: string, specifier: string): string | null => {
  if (specifier.startsWith("@/")) {
    return specifier.slice(2).split("/")[0];
  }
  if (specifier.startsWith("src/")) {
    return specifier.slice(4).split("/")[0];
  }
  if (specifier.startsWith(".")) {
    const resolved = path.resolve(path.dirname(file), specifier);
    const relative = path.relative(SRC, resolved);
    return relative.startsWith("..") ? null : relative.split(path.sep)[0];
  }
  return null;
};

const describeImport = ({ file, specifier }: ImportRecord) =>
  `${toRepoPath(file)} -> "${specifier}"`;

describe("Architecture: import boundaries", () => {
  const imports = collectImports();

  it("finds source files in every layer that exists", () => {
    // Arrange
    const existingLayers = LAYERS.filter((layer) =>
      fs.existsSync(path.join(SRC, layer)),
    );

    // Act
    const layersWithImports = new Set(
      imports.map(({ file }) => layerOfFile(file)),
    );

    // Assert
    expect(existingLayers.length).toBeGreaterThan(0);
    expect(layersWithImports.size).toBeGreaterThan(0);
  });

  it("each layer imports only from the layers it is allowed to use", () => {
    // Arrange
    const isAllowed = (from: string, to: string) =>
      from === to || ALLOWED_IMPORTS[from].includes(to);

    // Act
    const violations = imports
      .filter((record) => {
        const target = targetFolder(record.file, record.specifier);
        return (
          target !== null &&
          LAYERS.includes(target) &&
          !isAllowed(layerOfFile(record.file), target)
        );
      })
      .map(describeImport);

    // Assert
    expect(violations).toStrictEqual([]);
  });

  it("production code never imports tests, mocks, stories or e2e code", () => {
    // Arrange
    const isNonProduction = (target: string | null) =>
      target !== null && NON_PRODUCTION_FOLDERS.includes(target);

    // Act
    const violations = imports
      .filter((record) =>
        isNonProduction(targetFolder(record.file, record.specifier)),
      )
      .map(describeImport);

    // Assert
    expect(violations).toStrictEqual([]);
  });

  it("production code uses the @/ alias instead of parent-relative imports", () => {
    // Arrange
    const isParentRelative = (specifier: string) => specifier.startsWith("../");

    // Act
    const violations = imports
      .filter(({ specifier }) => isParentRelative(specifier))
      .map(describeImport);

    // Assert
    expect(violations).toStrictEqual([]);
  });
});
