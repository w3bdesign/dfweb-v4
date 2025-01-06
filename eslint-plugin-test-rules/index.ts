import type { Rule } from 'eslint';
import type { CallExpression, Identifier, ArrowFunctionExpression } from 'estree';

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
      create(context: Rule.RuleContext) {
        return {
          CallExpression(node: CallExpression) {
            const callee = node.callee as Identifier;
            if (callee.name === 'it' || callee.name === 'test') {
              const testFn = node.arguments[1] as ArrowFunctionExpression;
              if (testFn?.type === 'ArrowFunctionExpression') {
                const comments = context.getSourceCode().getCommentsBefore(testFn.body);
                const hasAAA = comments.some((comment: { value: string }) => 
                  comment.value.includes('Arrange') ||
                  comment.value.includes('Act') ||
                  comment.value.includes('Assert')
                );
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
