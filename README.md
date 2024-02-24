# nodeTS-stack
Complete Node Typescript stack with Pnpm Volta Docker Express

1.Dependencies

For gitignore use a generator
https://www.toptal.com/developers/gitignore

From first we need to have Volta to manage Node version
https://volta.sh/

# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node

After this we need to have Pnpm
https://pnpm.io/installation

npm install -g pnpm

And at last Docker
https://docs.docker.com/get-docker/

2.Initialization

    2.1.Generate package.json

        > pnpm init

    2.2.Choose and define node version

        > volta pin node@18

    2.3.Adding Typescript dependencie to the project

        > pnpm add typescript

    2.4.Define base config for typescript

        > pnpm add --save-dev @tsconfig/node18

    2.5.Create tsconfig.json

        {
            "extends": "@tsconfig/node18/tsconfig.json",
            "compilerOptions": {
                "lib": ["esnext"],
                "outDir": "dist",
            },
            "include": ["src"],
            "exclude": [
                "node_modules",
                "**/*.test.ts"
            ]
        }
    2.6.Create src folder
    2.7.Create first src file index.ts
    2.8.Adding node types for typescript
        > pnpm add --save-dev @types/node

3.Compilation setup

    3.1.Adding SWC compiler

        > pnpm add --save-dev @swc/cli @swc/core rimraf

    3.2.Defining how to build the project
    
        adding build option in script section of package.json
          "scripts": {
                "build": "rimraf dist && swc ./src -d ./dist",
            },
    3.3.Creating  .swcrc compiling profile file
        {
            "env": {
                "target": {
                    "node": 18
                }
            },
            "jsc": {
                "parser": {
                    "syntax": "typescript"
                }
            },
            "module": {
                "type": "commonjs"
            },
            "sourceMaps": "inline"
        }
    3.4.Defining how to start project
        adding start option in script section of package.json
            "scripts": {
                "build": "rimraf dist && swc ./src -d ./dist",
                "start": "node dist/index.js"
            },
    3.5.Testing compilation
        > pnpm build
    3.6.Correct start for managed SWC compile with folowing sourcemaps links
        In package.json change the start command
            "start": "node -r '@swc-node/register' --watch --enable-source-maps src/index.ts"
    3.7.Trat the project
        > pnpm start
    