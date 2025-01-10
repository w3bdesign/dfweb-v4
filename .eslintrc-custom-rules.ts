export interface RuleMeta {
  type: string;
  docs: {
    description: string;
    category: string;
    recommended: boolean;
  };
}

export interface Rule {
  meta: RuleMeta;
  create: (context: any) => any;
}

export interface ESLintCustomRules {
  meta: {
    name: string;
    version: string;
  };
  rules: {
    [key: string]: Rule;
  };
}

const eslintCustomRules: ESLintCustomRules = {
  meta: {
    name: "custom-test-rules",
    version: "1.0.0",
  },
  rules: {
    "arrange-act-assert": {
      meta: {
        type: "suggestion",
        docs: {
          description: "enforce AAA pattern in tests",
          category: "Best Practices",
          recommended: true,
        },
      },
      create(context) {
        return {
          CallExpression(node) {
            if (node.callee.name === "it" || node.callee.name === "test") {
              const testFn = node.arguments[1];
              if (testFn && testFn.type === "ArrowFunctionExpression") {
                const comments = context
                  .getSourceCode()
                  .getCommentsBefore(testFn.body);
                const hasAAA = comments.some(
                  (comment) =>
                    comment.value.includes("Arrange") ||
                    comment.value.includes("Act") ||
                    comment.value.includes("Assert"),
                );
                if (!hasAAA) {
                  context.report({
                    node,
                    message: "Test should follow AAA pattern with comments",
                  });
                }
              }
            }
          },
        };
      },
    },
  },
};

export default eslintCustomRules;
