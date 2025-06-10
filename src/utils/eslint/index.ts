import { ESLintUtils, TSESTree, TSESLint } from "@typescript-eslint/utils";

type MessageIds = "missingAAAPattern";
type Options = [];

const isTestFunction = (node: TSESTree.CallExpression): boolean => {
  const testNames = ["it", "test"];
  return (
    node.callee.type === TSESTree.AST_NODE_TYPES.Identifier &&
    testNames.includes(node.callee.name)
  );
};

const isArrowFunction = (
  node: TSESTree.Node,
): node is TSESTree.ArrowFunctionExpression => {
  return node?.type === TSESTree.AST_NODE_TYPES.ArrowFunctionExpression;
};

const validateAAAPattern = (
  context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
  node: TSESTree.CallExpression,
) => {
  const testFn = node.arguments[1];
  if (!isArrowFunction(testFn)) return;

  if (!hasAAAComments(context, testFn)) {
    context.report({
      node,
      messageId: "missingAAAPattern",
    });
  }
};

const validateTestCase = (
  context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
  node: TSESTree.CallExpression,
) => {
  if (!isTestFunction(node)) return;
  validateAAAPattern(context, node);
};

const hasAAAComments = (
  context: Readonly<TSESLint.RuleContext<MessageIds, Options>>,
  testFn: TSESTree.ArrowFunctionExpression,
): boolean => {
  const comments = context.getSourceCode().getCommentsBefore(testFn.body);
  const patterns = ["Arrange", "Act", "Assert"];

  return comments.some((comment: TSESTree.Comment) =>
    patterns.some((pattern) => comment.value.includes(pattern)),
  );
};

const createRule = ESLintUtils.RuleCreator(
  (name) =>
    `https://github.com/your-repo/eslint-plugin/blob/main/docs/rules/${name}.md`,
);

const rule = createRule<Options, MessageIds>({
  name: "arrange-act-assert",
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce AAA pattern in tests",
    },
    messages: {
      missingAAAPattern: "Test should follow AAA pattern with comments",
    },
    schema: [],
  },

  defaultOptions: [],

  create(context) {
    return {
      CallExpression: (node: TSESTree.CallExpression) =>
        validateTestCase(context, node),
    };
  },
});

module.exports = {
  configs: {
    recommended: {
      plugins: ["test-rules"],
      rules: {
        "test-rules/arrange-act-assert": "error",
      },
    },
  },
  rules: {
    "arrange-act-assert": rule,
  },
};
