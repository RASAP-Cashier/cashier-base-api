module.exports = {
  apps: [
    {
      name: "develop",
      script: "./app/app.ts",
      watch: ["app"],
      ignore_watch: ["node_modules", "dist"],
      interpreter: "node_modules/.bin/ts-node",
      interpreter_args: "--files",
    },
  ],
};
