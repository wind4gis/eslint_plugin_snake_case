const path = require('path')
const eslint = require('eslint');
const rules = require('./').rules;

const parser = path.resolve(__dirname, './node_modules', '@typescript-eslint/parser')
const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
};

const ruleTester = new eslint.RuleTester({ parserOptions, parser });
ruleTester.run('snake_case', rules.snakecase, {
  valid: [
    {
      code: `
        const Component:React.FC<IProps> = function(props:IProps){
          return <div />
        }
        const map_state_to_props = () => ({ });
        const ConnectComponent = connect(map_state_to_props)(Component)
      `,
    },
    {
      code: `
        const Component:FC<IProps> = (props:IProps) => {
          const { visible } = props;
          if (!visible) { return null; }
          return (
            visible ? <div /> : null
          );
        };
      `
    },
  ],
  invalid: [
    {
      code: `const aVariable = 123`,
      errors: [{ 
        message: 'Identifiers must be snake case: aVariable',
      }],
      output: 'const a_variable = 123'
    },
    {
      code: `const aFunction = () => {}`,
      errors: [{ 
        message: 'Identifiers must be snake case: aFunction',
      }],
      output: 'const a_function = () => {}'
    },
  ],
});
