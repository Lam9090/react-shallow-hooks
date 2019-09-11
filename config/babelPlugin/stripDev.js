'use strict';

module.exports = function(babel, options) {

  return {
    visitor: {
      CallExpression: {
        exit: function(path) {
          const node = path.node;
          if (path.get('callee').isIdentifier({ name: 'deprecatedPrimitiveDeps' })) {
            path.remove();
          }
        },
      },
    },
  };
};
