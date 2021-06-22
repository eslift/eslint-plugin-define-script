/**
 * @fileoverview Rule to flag any reference to parent scope from within a
 * function defined by `defineScript`.
 */
'use strict';

module.exports = {
  create: (context) => {
    return {
      CallExpression(expression) {
        if (
          expression.callee.type === 'Identifier' &&
          expression.callee.name === 'defineScript' &&
          expression.arguments.length === 2
        ) {
          let fn = expression.arguments[1];
          if (fn.type === 'ArrowFunctionExpression') {
            for (let scope of context.getScope().childScopes) {
              if (scope.block === fn) {
                for (let ref of scope.through) {
                  let isGlobal =
                    ref.resolved == null || ref.resolved.defs.length === 0;
                  if (!isGlobal) {
                    context.report(
                      ref.identifier,
                      `Don't use reference from parent scope within script.`,
                    );
                  }
                }
              }
            }
          }
        }
      },
    };
  },
};
