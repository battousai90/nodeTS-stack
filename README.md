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

        > pnpm add --save-dev @swc/cli @swc/core @swc-node/register rimraf

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
                "start": "node -r '@swc-node/register' --watch --enable-source-maps src/index.ts",
            },

    3.5.Testing compilation
        > pnpm build

    3.6.Correct start for managed SWC compile with folowing sourcemaps links
        In package.json change the start command
            "start": "node -r '@swc-node/register' --watch --enable-source-maps src/index.ts"

    3.7.Start the project
        > pnpm start

4.ESLint setup
    4.1.Setup
    > pnpm add --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser

    4.2.Setup
    Create .eslinrc file with
    {
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "@typescript-eslint"
    ]
    }

5.Express Setup
    5.1.Setup
    > pnpm add express morgan

    5.2.adding types for typescript
    > pnpm add --save-dev @types/express @types/morgan

6.Docker Setup
    5.1.Create dockerfile
        FROM node:18

        # Install pnpm
        RUN npm -i -g pnpm

        # Create app directory
        WORKDIR /usr/src/app

        # Install app dependencies
        COPY package*.json pnpm-lock.yaml ./

        RUN pnpm install --frozen-lockfile

        # Bundle app source
        COPY . .

        # Build app
        EXPOSE 8080
        CMD [ "pnpm", "start" ]

    5.2.Create dockerignor file
        .pnpm-store
        .vscode
        dist
        node_modules

    5.3.Create dockercompose.yml file
        services: 
        backend: # name of the service
            build: . # path to the Dockerfile
            ports:
            - 5000:5000 # for the app
            - 9229:9229 # for debugging
            volumes:
            - .:/usr/src/app # mount the current directory to /app
            - /usr/src/app/.pnpm-store # prevent the pnpm-store from being mounted
            - /usr/src/app/node_modules # prevent the node_modules from being mounted
            command: pnpm start:docker # start the app in dev mode
            environment:
            PORT: 5000

    5.4.Edit package.json for adding start docker command
        Adding in script section
        "start:docker": "pnpm build && pnpm start"

6.Restart on Save

    6.1.Get extension for VSCODE triggertaskonsave
    6.2.Confugiring Task on VScode
        Create tasks.json file in vscode folder
        {
            "version": "2.0.0",
            "tasks": [
                {
                "label": "restart backend",
                "type": "shell",
                "command": "docker compose restart backend",
                "presentation": {
                    "reveal": "never"
                }
                }
            ]
        }
    6.3.Configuring Extension
        Editing settings.json in the folder vscode
        "files.watcherExclude": {
            "**/.git/objects/**": true,
            "**/.git/subtree-cache/**": true,
        },
        "triggerTaskOnSave.tasks": {
            "restart backend": ["src/**/*"]
        }

7.Debugging setup

    7.1.Configuring VScode
        adding launch.json in vscode folder
        {
            "version": "0.2.0",
            "configurations": [
            {
                "type": "node",
                "request": "attach",
                "name": "Node (Docker)",
                "port": 9229,
                "restart": true,
                "remoteRoot": "/usr/src/app",
                "sourceMaps": true,
                "skipFiles": [
                "/usr/src/app/node_modules/**/*.js",
                "<node_internals>/**"
                ]
            }
            ]
        }

    7.2.Catch Docker debugger
        Editing start docker option in script section of package.json
        "start:docker": "pnpm build && node --inspect=0.0.0.0 -r '@swc-node/register' --watch --enable-source-maps src/index.ts"
