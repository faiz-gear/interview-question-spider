**关键词**：webpack 配置代码优化

当 Webpack 配置代码变得冗长和难以管理时，可以采取以下方法来优化配置：

*   **配置文件拆分**

将配置文件分成多个部分，每个文件只负责一部分逻辑。比如基础配置、开发环境配置、生产环境配置等。

// webpack.base.js - 存放共同的配置项
// webpack.dev.js - 开发环境特定的配置项
// webpack.prod.js - 生产环境特定的配置项

*   **使用环境变量**

通过环境变量来区分不同的配置环境，使用 `webpack-merge` 或 `env-cmd` 这样的库来合并配置。

// 通过环境变量确定不同的配置文件
const env \= process.env.NODE\_ENV;

let config;
if (env \=== "production") {
  config \= require("./webpack.prod.js");
} else {
  config \= require("./webpack.dev.js");
}

module.exports \= config;

*   **模块化配置**

将常用的 loader、plugins、entry 等配置项封装成函数或者模块，然后在主配置文件中引入。

// loaders.js - 存放所有loader的配置
// plugins.js - 存放所有plugins的配置
// entries.js - 存放入口文件配置

// webpack.config.js
const loaders \= require("./loaders");
const plugins \= require("./plugins");
const entries \= require("./entries");

module.exports \= {
  module: {
    rules: loaders.getRules(),
  },
  plugins: plugins.getPlugins(),
  entry: entries.getEntries(),
  // ...
};

*   **使用 webpack-merge 抽离通用配置**

检查配置中的重复部分，将它们抽象成共用的配置， 再使用 `webpack-merge` 来合并多个配置文件，保持配置的清晰和可维护性。

const { merge } \= require("webpack-merge");
const baseConfig \= require("./webpack.base.js");
const devConfig \= require("./webpack.dev.js");

module.exports \= merge(baseConfig, devConfig);

*   **统一管理插件和加载器**

如果项目中使用了大量插件和加载器，请考虑将它们的实例化和配置逻辑封装在单独的函数或文件中。 然后根据不同的环境， 直接 pick 不同的配置即可。 可以达到配置的 loader 和 plugin 集中管理。**关键词**：webpack 效率提升

*   webpack-dashboard：可以更友好的展示相关打包信息。
*   webpack-merge：提取公共配置，减少重复配置代码
*   speed-measure-webpack-plugin：简称 SMP，分析出 Webpack 打包过程中 Loader 和 Plugin 的耗时，有助于找到构建过程中的性能瓶颈。
*   size-plugin：监控资源体积变化，尽早发现问题
*   HotModuleReplacementPlugin：模块热替换
*   webpack.ProgressPlugin：打包进度分析
*   webpack-bundle-analyzer：打包结果分析
*   friendly-errors-webpack-plugin： 代码源码编译报错友好提示**关键词**：hooks 单测

如果你想对一个独立的 React Hook 函数进行单元测试，不涉及对它在组件中使用的测试，那么你可以使用由`react-hooks-testing-library`提供的工具来完成。这个库允许你在一个隔离的环境中渲染和测试 hook 函数，而不必担心组件的其他部分。

首先，你需要安装`@testing-library/react-hooks`：

npm install --save-dev @testing-library/react-hooks

或者使用 yarn：

yarn add --dev @testing-library/react-hooks

然后，让我们以一个简单的`useCounter` Hook 为例，来看怎么进行单元测试。以下是这个 Hook 的代码：

import { useState, useCallback } from "react";

function useCounter(initialValue \= 0) {
  const \[count, setCount\] \= useState(initialValue);
  const increment \= useCallback(() \=> setCount((c) \=> c + 1), \[\]);
  const decrement \= useCallback(() \=> setCount((c) \=> c \- 1), \[\]);

  return { count, increment, decrement };
}

export default useCounter;

接下来是对应的单元测试：

import { renderHook, act } from "@testing-library/react-hooks";
import useCounter from "./useCounter";

describe("useCounter", () \=> {
  it("should use counter", () \=> {
    const { result } \= renderHook(() \=> useCounter());

    expect(result.current.count).toBe(0);
  });

  it("should increment counter", () \=> {
    const { result } \= renderHook(() \=> useCounter());

    act(() \=> {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should decrement counter", () \=> {
    const { result } \= renderHook(() \=> useCounter(10));

    act(() \=> {
      result.current.decrement();
    });

    expect(result.current.count).toBe(9);
  });
});

这里我们使用了`renderHook`函数来渲染我们的 hook 并返回一个对象，这个对象中包含当前 hook 返回的所有值。我们还使用了`act`函数来包裹我们对 hook 中函数的调用。这是因为 React 需要确保在测试过程中状态更新能够正常同步。

需要注意的是，如果你的 hook 依赖于其他 React 的 Context，你可以使用`renderHook`的第二个参数来传入一个 wrapper，该 wrapper 是一个 React 组件，它将包裹你的 hook。

上面的这个测试覆盖了 hook 在默认值和指定初始值时的行为，以及它暴露的`increment`和`decrement`函数是否正常工作。这种方式可以用来测试任何自定义 hook，并且只关注 hook 本身的逻辑，不涉及到任何组件。**关键词**：useEffect 与 componentDidMount 区别

`useEffect` 是 React 函数组件的生命周期钩子，它是替代类组件中 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 生命周期方法的统一方式。

当你给 `useEffect` 的依赖项数组传入一个空数组（`[]`），它的行为类似于 `componentDidMount`，但实质上有些区别：

1.  执行时机：
    
    *   `componentDidMount`：在类组件的实例被创建并插入 DOM 之后（即挂载完成后）会立即被调用一次。
    *   `useEffect`（依赖为空数组）：在函数组件的渲染结果被提交到 DOM 之后，在浏览器绘制之前被调用。React 保证了不会在 DOM 更新后阻塞页面绘制。
2.  清除操作：
    
    *   `componentDidMount`：不涉及清理机制。
    *   `useEffect`：可以返回一个清理函数，React 会在组件卸载或重新渲染（当依赖项改变时）之前调用这个函数。对于只依赖空数组的 `useEffect`，此清理函数只会在组件卸载时被调用。
3.  执行次数：
    
    *   `componentDidMount`：在 render 执行之后，componentDidMount 会执行，如果在这个生命周期中再一次 setState ，会导致再次 render ，返回了新的值，浏览器只会渲染第二次 render 返回的值，这样可以避免闪屏。
    *   `useEffect`：是在真实的 DOM 渲染之后才会去执行，在这个 hooks 中再一次 setState, 这会造成两次 render ，有可能会闪屏。

实际上 `useLayoutEffect` 会更接近 `componentDidMount` 的表现，它们都同步执行且会阻碍真实的 DOM 渲染的**关键词**：技术选型

> 作者推荐一下五个标准，适用于编程语言、框架、大小工具库 等方向

*   可控性
*   稳定性
*   适用性
*   易用性
*   唯一性

当然，以下是对你提出的五个前端技术选型原则的详细描述：

1.  **可控性**：
    
    *   **定义**：选择的技术应该使团队能够对产品的开发过程有充分的控制，包括代码质量、部署流程、性能优化和错误处理等方面。
    *   **细节**：
        *   允许定制化和扩展：技术栈应该支持自定义功能，以满足特定业务需求。
        *   易于维护：代码库应该易于维护和升级，方便团队应对长远的技术演进。
        *   开放源代码或支持社区：最好选择有活跃社区支持的开源技术，以便在遇到问题时可以获得帮助。
        *   文档和工具：有充分的文档和开发工具，帮助团队理解并控制技术实现。
        
2.  **稳定性**：
    
    *   **定义**：选用的技术需要稳固可靠，拥有良好的社区支持和持续的发展。
    *   **细节**：
        *   成熟度：技术应该是经过时间检验，市场验证的成熟解决方案。
        *   庞大的用户基础：广泛的用户和使用案例保证了技术的稳定性和可靠性。
        *   正式的版本管理：应该有一个清晰的版本管理政策，以及频繁可靠的更新和安全补丁。
        *   抗脆弱性：即使在意外情况下也能表现出良好的弹性和错误恢复能力。
3.  **适用性**：
    
    *   **定义**：技术选择应该针对特定项目的需求和团队的技能水平。
    *   **细节**：
        *   业务需求匹配：选用的技术应能高效解决实际业务问题，并支持业务即将来临的挑战。
        *   团队的技能和经验：需要考量团队成员对技术栈的熟悉程度，以便能快速有效地产生结果。
        *   开发周期： 要考虑该技术是否能够在开发周期类完成对应需求开发。
4.  **易用性**：
    
    *   **定义**：技术应该简单易懂，易于团队成员学习和使用。
    *   **细节**：
        *   学习曲线：技术栈的学习曲线不应过于陡峭，以免增加新团队成员的入职门槛。
        *   开发效率：提供良好的开发体验，如源代码清晰、API 简洁、丰富的开发工具。
        *   调试和测试：应包含易于进行故障排除、调试和测试的工具或功能。
        *   文档和学习资源：应有良好、全面的文档和在线学习资源助于团队成员快速上手。
5.  **唯一性**：
    
    *   **定义**：确保在项目开发过程中， 同一个类型的问题解决方向只选用一个技术体系。
    *   **细节**：
        *   避免同类型库重复：选择最适合特定用例的工具和库，避免在项目中引入重复功能的库。

在选择前端技术栈时，这些原则可以帮助团队做出更符合项目需求、更利于长期维护和开发效率的决策。需要注意的是，这些原则并不是孤立的，他们之间相互影响，有时候在某些方面需要妥协以满足其他更为重要的需求。**关键词**：commit 与 eslint 规范

跳过`eslint`和`commitlint`的钩子，使用`--no-verify`（对于`git commit`来说是`-n`），的确是一个容许开发者在紧急情况下超越钩子检查的手段。然而，这也削弱了代码质量保证的制度。以下是一些方法，可以用来加强这些卡点的靠谱办法：

*   **CI/CD 流水线中增加检查**：在你的 CI/CD 流程中增加`eslint`和`commitlint`的检查步骤。如果检查失败，则阻止代码合并或部署。
    
*   **强制挂钩**：虽然开发者可能在本地禁用钩子，但你不能控制别人的本地环境。相反，你可以编写服务器端的钩子，比如在 Git 仓库的服务器上使用`pre-receive`钩子，来拒绝不符合规范的提交。
    
*   **定期自动化检查**：定期运行一个自动化的脚本或 GitHub Action，检查代码库的 eslint 与 commitlint 违规情况，并自动创建一个修复问题的 issue 或拉取请求。
    

你可以最大限度地减少绕过`eslint`和`commitlint`检查的情况。然而，值得记住的是，在极少数情况下，可能存在合法的理由需要紧急提交代码。因此，为了灵活性和效率，完全禁止`--no-verify`可能不是一个最佳的选择。好的实践中应该找到安全和灵活性之间的平衡，核心在于建立一个质量意识，制定明智的操作规范。**关键词**：commit 规范

Commit lint 是一种实践，用于在代码库中规范化提交信息的格式。这种做法通常有助于团队成员理解代码库的历史记录，以及自动化生成变更日志。下面是实施 Commit lint 的一些基本步骤：

1.  **选择 Commit 信息规范：** 首先，你需要选择一个提交信息的规范，最常见的是[Conventional Commits](https://www.conventionalcommits.org/)，它具有明确的结构和规则。
    
2.  **配置 Linter 工具：** [commitlint](https://commitlint.js.org/#/) 是一个流行的工具，用于检查提交信息是否符合规定的格式。安装 commitlint，通常是作为项目的开发依赖。
    
    npm install --save-dev @commitlint/{config-conventional,cli}
    
3.  **设置 commitlint 配置：** 在你的项目根目录下创建一个名为 `commitlint.config.js` 的文件，并且导入你选择的规范：
    
    module.exports \= { extends: \["@commitlint/config-conventional"\] };
    
4.  **安装钩子（Hook）管理工具：** [Husky](https://typicode.github.io/husky/#/) 是一个钩子管理工具，它可以助你轻松的在 Git 挂钩中添加脚本（例如，在 commit 之前检查提交信息格式）。
    
    npm install husky --save-dev
    
5.  **配置 Husky 来使用 commitlint**:
    
    *   初始化 husky：
    
    npx husky install
    
    *   添加 `commit-msg` 钩子来使用 commitlint。执行非交互式的命令配置钩子脚本：
    
    npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
    
    这行代码会在`.husky/commit-msg`文件中创建一个钩子，并且在你试图创建提交时，会调用 commitlint 来检查你的提交信息。
    
6.  **提交代码：** 当你提交代码时，Husky 会触发 `commit-msg` 钩子调用 commitlint 检查提交信息。如果信息不符合规范，提交将被拒绝，并显示错误信息。
    
7.  **配置 CI/CD 流水线：** 为了确保规范被强制执行，可以在 CI/CD 流水线中添加一步来执行 commitlint。这样，如果提交的信息不符合规范，构建将会失败。**关键词**：自动化 changelog

在编写 npm 包时，可以使用自动化工具来生成 changelog 和自动更新 tag。以下是你可以使用的一些流行的工具以及它们的基本用法。

1.  **semantic-release**: 这是一个全自动的版本管理和包发布工具。它能根据 commit 信息来自动决定版本号、生成变更日志（changelog）以及发布。
    
    要使用 semantic-release，你需要按照以下步骤操作：
    
    *   安装 semantic-release 工具：
        
        npm install -D semantic-release
        
    *   在项目中添加配置文件 (`semantic-release.config.js`) 或在 `package.json` 中配置。
        
    *   在 CI 工具中（例如 GitHub Actions、Travis CI）配置发布脚本。
        
    *   遵循规范化的 commit 消息风格（如 Angular 规范），因为 semantic-release 会根据 commit 消息来确定版本号和生成 changelog。
        
2.  **standard-version**: 如果你更希望进行半自动化的版本管理，standard-version 是一个很好的替代选择。它可以自动地根据 commit 记录来生成 changelog。
    
    使用 standard-version 的大致步骤如下：
    
    *   安装 standard-version 工具：
        
        npm install --save-dev standard-version
        
    *   在 `package.json` 中配置脚本：
        
        {
          "scripts": {
            "release": "standard-version"
          }
        }
        
    *   当你准备发布新版本时，运行以下命令：
        
        npm run release
        
    *   standard-version 会自动根据 commit 消息创建一个新的 tag，并更新 changelog。然后，你可以手动推送这些改动到仓库。
        

在这两种情况下，都推荐使用遵循某种规范的 commit 消息，如 Conventional Commits 规范，这样可以让工具更准确地解析 commit 消息来进行版本管理。此外，确保你的 CI/CD 系统有足够的权限来推送 tags 到远程仓库。**关键词**：对外提供 d.ts

在 TypeScript (TS) 中使用 Webpack 构建并为库提供 `.d.ts` 类型声明文件，需要遵循以下步骤：

1.  **配置 TypeScript 编译选项**：  
    在库项目的根目录下创建或编辑 `tsconfig.json` 文件，确保编译器配置选项如下：
    
    {
      "compilerOptions": {
        "declaration": true, // 生成对应的 '.d.ts' 文件
        "declarationDir": "types", // 指定生成的声明文件存放目录
        "outDir": "lib" // 指定编译后文件的输出目录
        // 其他需要的编译选项
      },
      "include": \["src/\*\*/\*"\], // 包含源码的目录
      "exclude": \["node\_modules"\] // 排除的目录
    }
    
    *   `declaration`: 这个选项会告诉 TypeScript 编译器为每个 `.ts` 文件生成相应的 `.d.ts` 声明文件。
    *   `declarationDir`: 这是指定声明文件的输出目录。
2.  **配置 Webpack**：  
    在我们的 Webpack 配置中（通常是 `webpack.config.js`），我们需要设置 `output` 以指向我们的输出目录，同时可能需要使用一些加载器(loader)如 `ts-loader` 或 `babel-loader` 来处理 TypeScript 文件。
    
    一个简单的 webpack 配置示例可能如下：
    
    const path \= require("path");
    
    module.exports \= {
      entry: "./src/index.ts", // 入口文件
      module: {
        rules: \[
          {
            test: /\\.tsx?$/,
            use: "ts-loader",
            exclude: /node\_modules/,
          },
        \],
      },
      resolve: {
        extensions: \[".tsx", ".ts", ".js"\],
      },
      output: {
        filename: "your-library.js", // 输出文件名
        path: path.resolve(\_\_dirname, "lib"), // 输出文件夹
        libraryTarget: "umd", // 使库支持各种模块系统
        globalObject: "this",
      },
    };
    
3.  **发布包**：  
    当你发布你的库时，你需要确保 `package.json` 文件中包含 `types` 或 `typings` 字段指向入口 `.d.ts` 文件。
    
    例如：
    
    {
      "name": "your-library",
      "version": "1.0.0",
      "main": "lib/your-library.js",
      "typings": "types/index.d.ts"
      // 其他配置项...
    }
    
    这告诉使用你库的 TypeScript 用户，在哪里可以找到类型声明文件。
    
4.  **保证类型声明文件的发布**：  
    如果你的 npm 发布流程排除了 `types` 目录，你需要更新 `.npmignore` 文件来确保 `.d.ts` 文件会被包含在发布的 npm 包中。
    

完成这些配置后，当你用 webpack 构建并发布你的库时，用户将能够获得与 JavaScript 文件关联的 TypeScript 类型声明，以便在他们的 TypeScript 项目中获得类型检查和智能提示。**关键词**：覆盖率

前端代码的测试覆盖率通常是指衡量在测试过程中有多少代码被执行了的一个指标。测试覆盖率有助于了解测试的全面性，以下是测试前端代码覆盖率常用的手段：

1.  **单元测试**：
    
    *   使用测试框架（例如 Jest, Mocha, Jasmine 等）编写单元测试。
    *   利用测试框架或插件生成覆盖率报告（例如 Istanbul/nyc 工具可以与这些框架集成以生成覆盖率数据）。
2.  **集成测试**：
    
    *   使用测试工具（比如 Cypress, Selenium 等）编写集成测试来模拟用户操作。
    *   通常这些工具也支持收集代码覆盖率信息。
    
3.  **手动测试与覆盖率工具结合**：
    
    *   在手动测试过程中，可以开启浏览器的覆盖率工具（如 Chrome DevTools 中的 Coverage Tab）记录覆盖率。
    *   可以通过浏览器扩展程序或者自动化脚本来启动这些工具。
4.  **测试覆盖率服务**：
    
    *   使用像 Codecov 或 Coveralls 这样的服务，在 CI/CD 流程中集成覆盖率测试和报告。**关键词**：代码复用

在 Webpack 中提取源码里被多个入口点复用的代码，例如一个 `utils` 文件，可以通过配置 `optimization.splitChunks` 来实现。Webpack 会将这些频繁复用的模块提取出来，打包到一个独立的 chunk 中，使得浏览器可以单独缓存这部分代码，并在多个页面间共享使用，优化加载性能。

使用 `splitChunks` 的基本配置如下：

module.exports \= {
  // ...其他配置...
  optimization: {
    splitChunks: {
      chunks: "all", // 对所有的 chunk 有效，包括异步和非异步 chunk
      cacheGroups: {
        commons: {
          name: "commons", // 提取出来的文件命名为 'commons.js'
          chunks: "initial", // 提取出的 chunk 类型，'initial' 为初始 chunk，'async' 为异步 chunk，'all' 表示全部 chunk
          minChunks: 2, // 模块被引用>=2次，便分割
          minSize: 0, // 模块的最小体积
        },
      },
    },
  },
};

这个配置的含义是：

*   `chunks: 'all'` 指定要优化的 chunk 类型，这里设置为 `all` 代表所有的 chunk，不管是动态还是非动态加载的模块。
*   `cacheGroups` 是一个对象，用于定义缓存组，可以继承和/或覆盖 `splitChunks` 的任何选项。每个缓存组可以有自己的配置，将不同的模块提取到不同的文件中。
*   `cacheGroups.commons` 定义了一个缓存组，专门用于提取 `initial` chunk（最初依赖的模块）中被至少两个 chunk 所共享的模块。
*   `name: 'commons'` 为生成的文件定义了一个自定义名称。
*   `minChunks: 2` 表示模块至少被两个入口点引用时，才会被提取。
*   `minSize: 0` 指定模块的最小体积是 0，即任意大小的模块都被提取。

这会让任何从 `node_modules` 目录导入，并在至少两个入口点中使用的模块，都会被打包到一个名为 `commons.js` 的文件中（当然，实际的文件名会受到 `output` 配置的影响，例如是否包含哈希值等）。

正确配置这些参数后，`utils` 这样的模块就会被自动提取并共享，而不是在每个入口点的 bundle 中重复包含。这样做的好处是，任何更新业务逻辑的时候，只要 `utils` 没有发生变化，用户浏览器上已缓存的 `commons.js` 文件就不需要重新下载。**关键词**：依赖打包

在 Webpack 中，将一些通用的依赖，如 React、React DOM、React Router 等库和框架，打包成一个独立的 bundle，通常是为了长期缓存和减少每次部署更新的下载量。这可以通过 "代码分割" (code splitting) 和 "优化" (optimization) 配置来实现。

以下是 Webpack 中分离通用依赖的几个步骤：

1.  **使用 `entry` 来定义不同的入口点**: 可以通过配置一个额外的入口来创建一个只包含通用库的 bundle，也就是所谓的 "vendor" bundle。

module.exports \= {
  entry: {
    main: "./src/index.js", // 你的应用代码
    vendor: \["react", "react-dom", "react-router"\], // 指定共享库
  },
  // ...
};

2.  **使用 `SplitChunksPlugin`**: 这个插件可以将共享代码分割成不同的 chunks，并可以通过配置将其从业务代码中分离出来。在 Webpack 4 及之后的版本中，默认内置了 `optimization.splitChunks`，就是这个插件的配置方法。

module.exports \= {
  // ...
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /\[\\\\/\]node\_modules\[\\\\/\]/, // 指定是 node\_modules 下的第三方包
          name: "vendors", // 打包后的文件名，任意命名
          chunks: "all", // 对所有的 chunk 生效
        },
      },
    },
  },
};

3.  **配置 `output`**: 虽然不是必须的，你还可以在 output 中定义 `filename` 和 `chunkFilename`，来控制主入口和非主入口 chunks 的文件名。

output: {
  filename: '\[name\].\[contenthash\].js',
  chunkFilename: '\[name\].\[contenthash\].js'
}

通过这样的配置，Webpack 在打包时会自动将 node\_modules 中的依赖和业务代码分离开来，业务代码会被打包到 `main` chunk 中，而第三方库则会打包到 `vendors` chunk。**关键词**：chunkFilename 和 filename

在 Webpack 中的 `output` 配置对象中，`filename` 和 `chunkFilename` 是用来指定输出文件的命名方式的关键属性。它们之间的区别主要涉及到最终生成的 JavaScript 文件的类型。

1.  **filename**: `filename` 属性用于指定输出的 **bundle** 的名称。当你的应用只有一个入口点时，可以直接使用一个固定名称。如果有多个入口点，那么你可以使用占位符来确保每个文件具有唯一的名称，如使用 `[name]` 来对应每个入口点的名称。`filename` 主要与入口点相关联的那些文件有关。
    
    output: {
      filename: "bundle.js"; // 一个固定名称，适用于单入口
      // 或者
      filename: "\[name\].bundle.js"; // 使用占位符，适用于多入口
    }
    
2.  **chunkFilename**: `chunkFilename` 属性用于指定非入口的 **chunk**（通常是动态加载的模块）的名称。这些 chunk 文件通常是由于代码分割产生的。当使用如 `import()` 这样的动态导入语法时，Webpack 会分割代码到新的 chunk 中，这时候 `chunkFilename` 的命名规则就会被应用。
    
    output: {
      chunkFilename: "\[name\].chunk.js";
    }
    

这意味着如果你有一个动态加载的模块（例如懒加载模块），Webpack 会使用 chunkFilename 的规则来生成这些额外的文件。同样，你也可以在 `chunkFilename` 中使用占位符来保持文件名的唯一性。常用的占位符有 `[id]`, `[name]`, `[chunkhash]` 等。

使用这两个属性使得 Webpack 能够区分出入口文件和其他类型的文件，从而允许开发者更好地控制输出资源的命名和缓存。**关键词**：webpack 多入口共享模块

默认情况下，每个入口 chunk 保存了全部其用的模块(modules)。使用 dependOn 选项你可以与另一个入口 chunk 共享模块:

module.exports \= {
  //...
  entry: {
    app: { import: "./app.js", dependOn: "react-vendors" },
    "react-vendors": \["react", "react-dom", "prop-types"\],
  },
};

app 这个 chunk 就不会包含 react-vendors 拥有的模块了.

dependOn 选项的也可以为字符串数组：

module.exports \= {
  //...
  entry: {
    moment: { import: "moment-mini", runtime: "runtime" },
    reactvendors: { import: \["react", "react-dom"\], runtime: "runtime" },
    testapp: {
      import: "./wwwroot/component/TestApp.tsx",
      dependOn: \["reactvendors", "moment"\],
    },
  },
};

此外，你还可以使用数组为每个入口指定多个文件：

module.exports \= {
  //...
  entry: {
    app: { import: \["./app.js", "./app2.js"\], dependOn: "react-vendors" },
    "react-vendors": \["react", "react-dom", "prop-types"\],
  },
};

**看一个完整案例**

module.exports \= {
  //...
  entry: {
    home: "./home.js",
    shared: \["react", "react-dom", "redux", "react-redux"\],
    catalog: {
      import: "./catalog.js",
      filename: "pages/catalog.js",
      dependOn: "shared",
      chunkLoading: false, // Disable chunks that are loaded on demand and put everything in the main chunk.
    },
    personal: {
      import: "./personal.js",
      filename: "pages/personal.js",
      dependOn: "shared",
      chunkLoading: "jsonp",
      asyncChunks: true, // Create async chunks that are loaded on demand.
      layer: "name of layer", // set the layer for an entry point
    },
  },
};**关键词**：webpack ts 编写配置文件

要使用 [Typescript](https://www.typescriptlang.org/) 来编写 webpack 配置，你需要先安装必要的依赖，比如 Typescript 以及其相应的类型声明，类型声明可以从 [DefinitelyTyped](https://definitelytyped.org/) 项目中获取，依赖安装如下所示：

npm install --save-dev typescript ts-node @types/node @types/webpack
# 如果使用版本低于 v4.7.0 的 webpack-dev-server，还需要安装以下依赖
npm install --save-dev @types/webpack-dev-server

完成依赖安装后便可以开始编写配置文件，示例如下：

**webpack.config.ts**

import \* as path from "path";
import \* as webpack from "webpack";
// in case you run into any typescript error when configuring \`devServer\`
import "webpack-dev-server";

const config: webpack.Configuration \= {
  mode: "production",
  entry: "./foo.js",
  output: {
    path: path.resolve(\_\_dirname, "dist"),
    filename: "foo.bundle.js",
  },
};

export default config;

该示例需要 typescript 版本在 2.7 及以上，并在 `tsconfig.json` 文件的 compilerOptions 中添加 `esModuleInterop` 和 `allowSyntheticDefaultImports` 两个配置项。

值得注意的是你需要确保 `tsconfig.json` 的 `compilerOptions` 中 `module` 选项的值为 `commonjs`,否则 webpack 的运行会失败报错，因为 `ts-node` 不支持 `commonjs` 以外的其他模块规范。

你可以通过三个途径来完成 module 的设置：

*   直接修改 `tsconfig.json` 文件
*   修改 `tsconfig.json` 并且添加 `ts-node` 的设置。
*   使用 `tsconfig-paths`

**第一种方法**就是打开你的 `tsconfig.json` 文件，找到 `compilerOptions` 的配置，然后设置 `target` 和 `module` 的选项分别为 `"ES5"` 和 `"CommonJs"` (在 `target` 设置为 `es5` 时你也可以不显示编写 `module` 配置)。

**第二种方法** 就是添加 ts-node 设置：

你可以为 `tsc` 保持 `"module": "ESNext"`配置，如果你是用 webpack 或者其他构建工具的话，为 ts-node 设置一个重载（override）。[ts-node 配置项](https://typestrong.org/ts-node/docs/imports/)

{
  "compilerOptions": {
    "module": "ESNext"
  },
  "ts-node": {
    "compilerOptions": {
      "module": "CommonJS"
    }
  }
}

**第三种方法**需要先安装 `tsconfig-paths` 这个 npm 包，如下所示：

npm install --save-dev tsconfig-paths

安装后你可以为 webpack 配置创建一个单独的 TypeScript 配置文件，示例如下：

**tsconfig-for-webpack-config.json**

{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "esModuleInterop": true
  }
}

**提示**

ts-node 可以根据 `tsconfig-paths` 提供的环境变量 `process.env.TS_NODE_PROJECT` 来找到 `tsconfig.json` 文件路径。

`process.env.TS_NODE_PROJECT` 变量的设置如下所示:

**package.json**

{
  "scripts": {
    "build": "cross-env TS\_NODE\_PROJECT=\\"tsconfig-for-webpack-config.json. webpack"
  }
}

之所以要添加 `cross-env`，是因为我们在直接使用 `TS_NODE_PROJECT` 时遇到过 `"TS_NODE_PROJECT" unrecognized command` 报错的反馈，添加 `cross-env` 之后该问题也似乎得到了解决，你可以查看[这个 issue](https://github.com/webpack/webpack.js.org/issues/2733)获取到关于该问题的更多信息。

**参考文档**

*   [https://www.webpackjs.com/configuration/configuration-languages/#typescript](https://www.webpackjs.com/configuration/configuration-languages/#typescript)**关键词**：webpack 执行原理

这部分可以直接转官网，官网讲得非常好：

[https://www.webpackjs.com/concepts/under-the-hood/](https://www.webpackjs.com/concepts/under-the-hood/)**关键词**：webpack 模块化支持

> 作者总结一下原因：
> 
> 1.  CMD 是国内产品， webpack 是国外产品， 而且 CMD 还没有火起来的时候， 就已经被 ESM 替代了
> 2.  CMD 是更加懒惰，是依赖就近，延迟执行。也就是说，在模块中需要用到依赖时，才去引入依赖。这和 Webpack 的理念以及模块收集和打包机制不兼容

CMD（Common Module Definition）是一种深受国内前端开发者喜爱的模块定义规范，主要被用在了 Sea.js 这个模块加载器中。CMD 是国内开发者提出的规范，它和 AMD 很相似，但是更符合国内开发者的习惯，需要时可以延迟执行。

Webpack 本身是围绕 NPM 生态和标准化模块格式（如 ES Modules 和 CommonJS）构建的，而 NPM 生态主要使用的是 CommonJS 形式。因此，对于大多数使用 NPM 之 Webpack 的用户来说，这些就足够用了。而 ES Modules 作为 JavaScript 官方的模块系统标准，越来越多地在现代应用中被采用。

面对 CMD，Webpack 的社区并没有广泛地采用或者需要支持这种模块定义。CMD 在模块定义时依赖于具体的 API 和加载时机，这和 Webpack 的理念以及模块收集和打包机制不完全兼容。Webpack 鼓励在编译时就确定模块依赖，而 CMD 更倾向于运行时动态确定。

尽管如此，理论上是可以通过一些插件或 loader 来实现对 CMD 模块的支持的，但是官方并没有集成这样的功能，因为需求没有那么大，同时现有的模块加载机制已经可以满足绝大多数场景的需要。随着前端工程化的深入，标准化的模块定义（如 ES Modules）更加受到青睐，而特定的模块定义（如 CMD）则逐渐被边缘化。因此，Webpack 没有默认支持 CMD，也反映了当前前端模块化开发的趋势和实践。**关键词**：webpack 模块化支持

Webpack 支持以下几种模块化标准：

1.  **ESM (ECMAScript Modules)**: 这是 JavaScript ES6 中引入的官方标准模块系统。使用 `import` 和 `export` 语句来导入和导出模块。
    
2.  **CommonJS**: 主要用于 Node.js，允许使用 `require()` 来加载模块和 `module.exports` 来导出模块。
    
3.  **AMD (Asynchronous Module Definition)**: 用于异步加载模块，并使用 `define` 方法来定义模块。
    
4.  **UMD (Universal Module Definition)**: 结合了 AMD 和 CommonJS 的特点，并支持全局变量定义的方式，使得模块可以在客户端和服务端上运行。
    

除此之外，Webpack 还可以处理非 JavaScript 文件并将它们视为模块，例如 CSS, LESS, SASS, 图像文件(PNG, JPG, GIF, SVG 等), 字体(OTF, TTF, WOFF, WOFF2, EOT), HTML 以及任何其他类型的文件。这通过使用相应的 loader 来实现，如 `style-loader`, `css-loader`, `file-loader` 等。这些 loader 会将非 JavaScript 文件转换为可以被 Webpack 处理的模块。

**参考文档**

*   [https://www.webpackjs.com/concepts/modules/#supported-module-types](https://www.webpackjs.com/concepts/modules/#supported-module-types)**关键词**：主题色切换

页面主题色切换通常涉及到修改网页中的颜色方案，以提供不同的视觉体验，例如从明亮模式切换到暗黑模式。实现这一功能，可以通过配合使用 CSS、JavaScript 和本地存储来进行。以下是实施页面主题色切换的几种方法：

### 使用 CSS 自定义属性

1.  定义一套主题变量：

:root {
  \--primary-color: #5b88bd; /\* 明亮主题色 \*/
  \--text-color: #000; /\* 明亮主题文本颜色 \*/
}

\[data-theme\="dark"\] {
  \--primary-color: #1e2a34; /\* 暗黑主题色 \*/
  \--text-color: #ccc; /\* 暗黑主题文本颜色 \*/
}

2.  应用自定义属性到 CSS 规则中：

body {
  background-color: var(\--primary-color);
  color: var(\--text-color);
}

3.  使用 JavaScript 动态切换主题：

function toggleTheme() {
  const root \= document.documentElement;
  if (root.dataset.theme \=== "dark") {
    root.dataset.theme \= "light";
  } else {
    root.dataset.theme \= "dark";
  }
}

### 使用 CSS 类切换

1.  为每个主题创建不同的 CSS 类：

.light-theme {
  \--primary-color: #5b88bd;
  \--text-color: #000;
}

.dark-theme {
  \--primary-color: #1e2a34;
  \--text-color: #ccc;
}

2.  手动切换 CSS 类：

function toggleTheme() {
  const bodyClass \= document.body.classList;
  if (bodyClass.contains("dark-theme")) {
    bodyClass.replace("dark-theme", "light-theme");
  } else {
    bodyClass.replace("light-theme", "dark-theme");
  }
}

### 使用 LocalStorage 记录用户主题偏好

// 当用户切换主题时
function saveThemePreference() {
  localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
}

// 页面加载时应用用户偏好
function applyThemePreference() {
  const preferredTheme \= localStorage.getItem("theme");

  if (preferredTheme \=== "dark") {
    document.body.classList.add("dark-theme");
  } else {
    document.body.classList.remove("dark-theme");
  }
}

applyThemePreference();

### 使用媒体查询自动应用暗黑模式

某些现代浏览器支持 CSS 媒体查询`prefers-color-scheme`。你可以使用这个特性来自动根据用户的系统设置应用暗黑模式或明亮模式，而无须 JavaScript：

@media (prefers-color-scheme: dark) {
  :root {
    \--primary-color: #1e2a34; /\* 暗黑主题色 \*/
    \--text-color: #ccc; /\* 暗黑主题文本颜色 \*/
  }
}

@media (prefers-color-scheme: light) {
  :root {
    \--primary-color: #5b88bd; /\* 明亮主题色 \*/
    \--text-color: #000; /\* 明亮主题文本颜色 \*/
  }
}

通过以上方法，开发人员能够为前端页面提供灵活的主题色切换功能，从而增强用户体验。**关键词**：稳定性

前端视角来做稳定性， 本是一个开放性话题，这里没有统一的解法， 作者在此提供几个思路和反向：

1.  静态资源多备份（需要有备份）
2.  首屏请求缓存
3.  请求异常报警
4.  页面崩溃报警
5.  E2E 定时全量跑用例**关键词**：长任务统计

在 JavaScript 中，可以使用 Performance API 中的 PerformanceObserver 来监视和统计长任务（Long Task）。长任务是指那些执行时间超过 50 毫秒的任务，这些任务可能会阻塞主线程，影响页面的交互性和流畅性。

### 使用 PerformanceObserver 监听长任务

// 创建一个性能观察者实例来订阅长任务
let observer \= new PerformanceObserver((list) \=> {
  for (const entry of list.getEntries()) {
    console.log("Long Task detected:");
    console.log(\`Task Start Time: ${entry.startTime}, Duration: ${entry.duration}\`);
  }
});

// 开始观察长任务
observer.observe({ entryTypes: \["longtask"\] });

// 启动长任务统计数据的变量
let longTaskCount \= 0;
let totalLongTaskTime \= 0;

// 更新之前的性能观察者实例，以增加统计逻辑
observer \= new PerformanceObserver((list) \=> {
  list.getEntries().forEach((entry) \=> {
    longTaskCount++; // 统计长任务次数
    totalLongTaskTime += entry.duration; // 累加长任务总耗时
    // 可以在这里添加其他逻辑，比如记录长任务发生的具体时间等
  });
});

// 再次开始观察长任务
observer.observe({ entryTypes: \["longtask"\] });

在上面的代码中，我们创建了一个`PerformanceObserver`对象来订阅长任务。每当检测到长任务时，它会向回调函数传递一个包含长任务性能条目的列表。在这个回调中，我们可以统计长任务的次数和总耗时。

注意：`PerformanceObserver`需要在支持该 API 的浏览器中运行。截至到我所知道的信息（2023 年 4 月的知识截点），所有现代浏览器都支持这一 API，但在使用前你应该检查用户的浏览器是否支持这个特性。

以下是如何在实际使用中停止观察和获取当前的统计数据：

// 停止观察能力
observer.disconnect();

// 统计数据输出
console.log(\`Total number of long tasks: ${longTaskCount}\`);
console.log(\`Total duration of all long tasks: ${totalLongTaskTime}ms\`);

使用这种方法，你可以监控应用程序中的性能问题，并根据长任务的发生频率和持续时间进行优化。**关键词**：属性计算函数 calc

CSS 属性计算函数 `calc()` 是用来进行动态的尺寸计算以及数值混合运算的一种函数。它增强了纯 CSS 的灵活性，允许你在属性值的设置中直接执行基础的加（`+`）、减（`-`）、乘（`*`）、除（`/`）运算。

###使用方式

`calc()` 函数用于各种 CSS 属性，如 `width`、`height`、`margin`、`padding`、`top`、`right`、`bottom`、`left`、`font-size` 等。以下是 `calc()` 函数的基本语法：

property: calc(expression);

其中，`expression` 可以包括：

*   其他 CSS 单位值
*   数字常量
*   括号来控制运算顺序

### 基础示例

.element {
  width: calc(100% \- 50px); // 宽度是容器宽度减50px
  padding: calc(1em + 10px); // 上下内边距是当前字体尺寸的1em加上10px
  margin: calc(10px / 2); // 外边距为5px
  font-size: calc(12px + 2vw); // 根据视窗宽度改变字体大小
}

### 高级用法

使用 `calc()` 的同时可以嵌套使用 `min()` 和 `max()` 函数，这种组合对响应式设计非常有用。

.element {
  width: calc(min(100%, 500px)); // 宽度始终是容器的100%，但不超过500px
  font-size: calc(max(12px, 1vw)); // 在某些实现中此用法可能不生效
}

### 括号

如果要进行优先级计算，你需要使用括号，比如在多重运算中：

.element {
  width: calc(25% + (2em \* (100vw \- 200px) / 2));
}

### 注意事项

*   在进行除法运算时，要注意除数不能为零。
*   CSS 变量可以在 `calc()` 中使用，使得你能够进行更灵活的样式控制。
*   `calc()` 必须确保表达式的两侧是兼容的单位，比如不能将像素（`px`）和百分比（`%`）相除。
*   我很遗憾要指出一个小误导：`calc()` 并不是 CSS 的原生属性，尽管它是 CSS 核心语法的一部分，它的适用性非常广泛。

### 兼容性

截至我的知识更新点（2023 年），`calc()` 得到了现代浏览器的广泛支持，包括 Chrome、Firefox、Safari、Edge 以及旧的 Internet Explorer 版本。唯一的例外是 Windows Phone 中的老版本浏览器。

### 实际应用场景

`calc()` 的一个常见用途是在响应式设计中，你可以用 `calc()` 来设置一个固定宽度和视口宽度的融合：

.container {
  width: calc(100% \- 20px); /\* 虚拟列不存在时，容器宽度为屏幕宽度减去20px \*/
}
.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  /\* 这部分代码创建一个栅格布局，其中每一格至少宽250px，每列最大填充至填满屏幕，如果没有空间填满则按最小宽度计算 \*/
}

通过 `calc()` 函数，开发人员可以设计出更加灵活和响应用户屏幕大小的界面布局。**关键词**：less 函数

LESS 是一种基于 JavaScript 的 CSS 预处理器，它扩展了 CSS 的功能，提供了变量、嵌套、混合（Mixins）、函数等功能。LESS 中的函数允许你执行计算、转换和操纵值的操作，使得你的样式表更加灵活和动态。

### 使用 LESS 函数的基本步骤：

1.  **定义函数**：你可以定义一个 LESS 函数，它接受参数并执行代码块。

.my-function(@arg) {
  .result {
    width: @arg;
  }
}

2.  **调用函数**：使用 `@` 前缀后跟函数名和所需的参数列表来调用函数。

.my-class {
  .my-function(200px);
}

3.  **传递参数**：函数可以接收一个或多个参数。上面的例子只传递一个参数。

### 示例：简单的 LESS 函数

// 定义一个 LESS 函数
.pi(@num) {
  .pi-box {
    width: @num \* 3.14159;
  }
}

// 调用这个函数
body {
  .pi(5px);
}

在该示例中，`pi` 是一个接受数字参数并返回其圆周长度的 LESS 函数。这个 `pi` 函数在 `body` 选择器内部被调用，并设置了宽度为 5 \* 3.14159 像素。

### LESS 内建函数

LESS 还包括多个内建函数，可以直接在 LESS 代码中使用。以下是一些常见的内建函数示例：

*   **`percentage()`**：将值转换成百分比。
    
    margin: percentage(20px / 100px); // 输出 20%
    
*   **`round()`**：四舍五入数字。
    
    width: round(23.7px); // 输出 24px
    
*   **`floor()`** 和 **`ceil()`**：向下取整和向上取整。
    
    height: ceil(14.2px); // 输出 15px
    
*   **`unit()`** 和 **`convert()`**：分别用来获取值的单位和转换单位。
    
    width: convert(10, ms); // 将 10 转换为毫秒
    margin: unit(25, "%"); // 输出 默认单位为 px，这次你却要改成百分比
    
*   **`color-function()`**：用于操作颜色值的函数，例如 `lighten()`、`darken()`、`saturate()` 等。
    
    background: lighten(#800, 10%); // 将颜色 #800 变亮 10%
    
*   **`e()`**：允许你将 CSS 代码作为参数传递到 `&` 中，用于可扩展的类选择器。
    
    .borderbox {
      \*,
      \*:before,
      \*:after {
        .box-sizing(border-box);
      }
    }
    

### 注意事项：

*   函数可以返回任意值，包括颜色、数字、字符串和数组。
*   如果想要执行的是一个操作而非函数定义，需要注意的是 LESS 并不像 JavaScript 一样需要用 `function` 关键字声明。

合理使用函数可以极大增加 CSS 的动态性和灵活性，是构建维护性和复用性更强的 CSS 不可或缺的部分。**关键词**：CSS 变量

CSS 自定义属性，又称 CSS 变量，是一种在 CSS 样式表中声明可以使用任意值的方法，这样的值在同一份 CSS 代码中可以多次引用并调用来替代特定的内容。使用 CSS 变量可以提高样式表的可维护性和灵活性。以下是如何声明和使用 CSS 变量的步骤：

### 声明 CSS 变量

CSS 变量的声明总是以 `--` 开头，跟随变量名。你可以在 CSS 的任何范围内声明变量，包括 `:root`（相当于 HTML 的根），这样所有样式规则都可以访问到。

**示例**：

:root {
  \--main-color: #3498db;
  \--padding: 8px;
  \--transition-speed: 0.3s;
}

### 使用 CSS 变量

在 CSS 中使用变量时，你需要使用 `var()` 函数，并在括号中提供变量名，可以包含在`--` 前缀之后。

**示例**：

body {
  background-color: var(\--main-color);
  padding: var(\--padding);
  transition: all var(\--transition-speed) ease-in-out;
}

### 默认值

有时候，你可能想为 CSS 变量提供一个默认值，以防它未被声明时使用。在 `var()` 函数中，你可以添加一个可选的第二个参数作为默认值。

**示例**：

body {
  font-size: var(\--font-size, 16px);
}

在上面的例子中，如果 `--font-size` 变量没有在任何地方声明，`body` 的 `font-size`将默认使用 `16px`。

### 作用域

变量的作用域是根据它们声明的地方确定的：

*   在 `:root` 选择器内声明的变量是全局变量，在任何地方都可以使用。
*   在其他元素或伪类的 CSS 规则中声明的变量会在该元素或这些伪类中局部有效。

**示例**：

button {
  \--button-bg-color: #e74c3c;
}

.btn-primary {
  background-color: var(\--button-bg-color);
}

在上面的例子中，`--button-bg-color` 变量只在 `button` 元素中声明，因此它只在 `button` 下的所有样式规则中可用，`.btn-primary`则是基于这个变量设置的。

CSS 变量是非常强大的工具，特别是当你需要在整个页面上保持一致性，或者是要实现主题应用时。它们有助于实现动态主题，使样式管理更系统化。**关键词**：React 19 新特性

更多详细信息可以看下面这个文章： [https://juejin.cn/post/7362057701792923684](https://juejin.cn/post/7362057701792923684)

作者总结上文的重点信息内容

### React 19 的新功能

*   新型 hook：`useActionState`
*   React DOM：`<form>` Action
*   React DOM：新型 hook：`useFormStatus`
*   新型 hook：`useOptimistic`
*   新型 API：`use`

### React 服务器组件

*   服务器组件
*   Server Action（服务器操作）