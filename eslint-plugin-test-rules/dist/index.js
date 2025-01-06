"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = {
    configs: {
        recommended: {
            plugins: ['test-rules'],
            rules: {
                'test-rules/arrange-act-assert': 'error'
            }
        }
    },
    rules: {
        'arrange-act-assert': {
            meta: {
                type: 'suggestion',
                docs: {
                    description: 'enforce AAA pattern in tests',
                    category: 'Best Practices',
                    recommended: true
                },
                schema: [] // no options
            },
            create(context) {
                return {
                    CallExpression(node) {
                        const callee = node.callee;
                        if (callee.name === 'it' || callee.name === 'test') {
                            const testFn = node.arguments[1];
                            if (testFn?.type === 'ArrowFunctionExpression') {
                                const comments = context.getSourceCode().getCommentsBefore(testFn.body);
                                const hasAAA = comments.some((comment) => comment.value.includes('Arrange') ||
                                    comment.value.includes('Act') ||
                                    comment.value.includes('Assert'));
                                if (!hasAAA) {
                                    context.report({
                                        node,
                                        message: 'Test should follow AAA pattern with comments'
                                    });
                                }
                            }
                        }
                    }
                };
            }
        }
    }
};
module.exports = plugin;
