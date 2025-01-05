import { Rule } from 'eslint';
import { RuleMeta } from '../.eslintrc-custom-rules';

interface RuleDefinition {
  meta: RuleMeta;
  create: (context: Rule.RuleContext) => Rule.RuleListener;
}

export const configs = {
  recommended: {
    plugins: ['test-rules'],
    rules: {
      'test-rules/arrange-act-assert': 'error'
    }
  }
};

export const rules: { [key: string]: RuleDefinition } = {
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
          if (node.callee.name === 'it' || node.callee.name === 'test') {
            const testFn = node.arguments[1];
            if (testFn && testFn.type === 'ArrowFunctionExpression') {
              const comments = context.getSourceCode().getCommentsBefore(testFn.body);
              const hasAAA = comments.some(comment => 
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
};
