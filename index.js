const reactTypeArr = ['React.FC', 'FC'];
const reactLikeArr = ['connect'];

function getNodeText(prop, source) {
  if (!prop) return null;
  return source.slice(prop.range[0], prop.range[1]);
}

function getTypeAnnotation(node, source) {
  if (node.parent.init.type === 'ArrowFunctionExpression' || node.parent.init.type === 'FunctionExpression') {
    return getNodeText(node.typeAnnotation, source);
  }
}

function isReactComponent(typeAnnotation) {
  return reactTypeArr.indexOf(typeAnnotation) > -1;
}

function getCallStatement(node, source) {
  if (node.parent.init.type === 'CallExpression') {
    return getNodeText(node.parent.init, source);
  }
}

function isReactLikeComponent(callStatement) {
  if (!callStatement) return false;
  const regex = new RegExp(`\\b${reactLikeArr.join('|')}\\b`);
  return callStatement.search(regex) > -1;
}

module.exports = {
  rules: {
    snakecase: {
      meta: {
        type: 'problem',
        fixable: 'code',
      },
      create(context) {
        return {
          Identifier(node) {
            const name = node.name;
            const splitUpper = name.split(/(?=[A-Z])/);
            const splitLowwer = name.split(/(?=[a-z])/);
            // 只对变量赋值语句进行操作
            if (node.parent.type !== 'VariableDeclarator') {
              return;
            }
            if (splitUpper.length > 1 && splitLowwer.length > 1) {
              const sourceCode = context.getSourceCode();
              const source = sourceCode.getText();
              const typeAnnotation = getTypeAnnotation(node, source);
              const callStatement = getCallStatement(node, source);
              // 对React函数组件声明不做处理
              if (isReactComponent(typeAnnotation) || isReactLikeComponent(callStatement)) {
                return true;
              }
              context.report({
                message: 'Identifiers must be snake case: {{ identifier }}',
                node: node,
                data: {
                  identifier: node.name,
                },
                fix(fixer) {
                  return fixer.replaceText(
                    node,
                    node.name
                      .split(/(?=[A-Z])/)
                      .join('_')
                      .toLowerCase()
                  );
                },
              });
            }
          },
        };
      },
    },
  },
};
