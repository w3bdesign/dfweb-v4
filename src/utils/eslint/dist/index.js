"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@typescript-eslint/utils");
const isTestFunction = (node) => {
    const testNames = ["it", "test"];
    return (node.callee.type === utils_1.TSESTree.AST_NODE_TYPES.Identifier &&
        testNames.includes(node.callee.name));
};
const isArrowFunction = (node) => {
    return (node === null || node === void 0 ? void 0 : node.type) === utils_1.TSESTree.AST_NODE_TYPES.ArrowFunctionExpression;
};
const validateAAAPattern = (context, node) => {
    const testFn = node.arguments[1];
    if (!isArrowFunction(testFn))
        return;
    if (!hasAAAComments(context, testFn)) {
        context.report({
            node,
            messageId: "missingAAAPattern",
        });
    }
};
const validateTestCase = (context, node) => {
    if (!isTestFunction(node))
        return;
    validateAAAPattern(context, node);
};
const hasAAAComments = (context, testFn) => {
    const comments = context.getSourceCode().getCommentsInside(testFn.body);
    const patterns = ["Arrange", "Act", "Assert"];
    return comments.some((comment) => patterns.some((pattern) => comment.value.includes(pattern)));
};
const createRule = utils_1.ESLintUtils.RuleCreator((name) => `https://github.com/your-repo/eslint-plugin/blob/main/docs/rules/${name}.md`);
const rule = createRule({
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
            CallExpression: (node) => validateTestCase(context, node),
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
