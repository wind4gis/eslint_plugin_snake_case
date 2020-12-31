# 下划线变量命名 Eslint plugin

## 背景

- 目前在维护的旧项目里，变量命名需要通过下划线进行命名，而不能以驼峰的格式进行命名。因为已经存在大量的旧变量，需要保证统一的规范。新项目里就可以使用驼峰格式进行变量命名

- 旧项目里大量使用了下划线进行命名的变量，由于缺乏eslint规范的限制，导致在维护旧项目的过程中需要耗费精力在code review里检查变量命名。*需要寻找一个合适的eslint rule来限制和统一变量命名规范的问题。*

## 问题

通过配置`eslint rule: naming-convention`，实现了变量命名的下划线规范，但是存在一些问题，在遇到React组件时，下划线命名反倒不符合React的命名规范，造成了冲突

- 通过github得知，typescript-eslint规则的作者并不想维护这个问题，详情可以参考：https://github.com/typescript-eslint/typescript-eslint/issues/2909#event-4155316558

- 对于这种自定义的需求，需要编写插件实现

## 方案

### 自定义 eslint 插件

#### 说明

​    针对tsx文件进行处理，*因为在tsx文件里我们才能通过code review限制开发人员编写函数式组件时必须填写上对应的type annotation，也只有通过type annotation进行识别，我们才能将函数式组件和普通函数进行区分。*

#### 缺点

- 只支持ES6语法的箭头函数、普通函数表达式这两种语法进行初始化的React组件

- 不支持其他语法初始化的组件，比如直接通过React.createElement语法、函数声明初始化的方式等

- 不能识别高阶组件，只能通过很局限地判断connect语法

  因为eslint插件只能做到识别token，但是无法跟踪token对应的库是否指定的第三方库，因此我们只能识别到当前语句是否使用了connect方法进行初始化，但是无法识别到connect究竟是否是由redux导出。也就是说目前只能对用户习惯进行模拟，通过约定开发习惯，配合code review限制开发者行为

#### 识别原理

识别到变量赋值的语句，如果是通过函数表达式或箭头函数里进行初始化，并且对应的标识符的类型声明属于React组件类型，那么将不对该名称进行处理

识别到语法调用的语句，通过判断是否调用了connect进行初始化，如果使用了connect就识别为react相关组件，不见行处理

#### 内容

- 对于普通变量标识需要使用下划线命名

- 对于React及相关组件不使用下划线命名



### naming-convention需要进行额外的配置

#### 说明

针对tsx文件进行overrides处理，允许export语句里使用UPPER_CASE、snake_case和PascalCase这三种写法。主要是为了解决自定义插件无法很好地识别高阶组件的问题，允许使用export这种语法，跳出识别规则



## 总结

- 为了解决 naming-convention 规则无法很好地识别 React 函数式组件的问题，约定只能通过 tsx 文件编写 React 组件，同时编写时必须带上类型声明：const Component:React.FC = () => (<div />)。

- 同时在 tsx 文件里 naming-convention 规则需要设置 export 关键字，允许 export 关键字对应的变量可以使用驼峰命名。

- naming-convention 规则，是最主要的处理方式；对于 tsx 文件，使用自定义插件进行补充处理。