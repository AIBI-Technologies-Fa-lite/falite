import app from "./app";

const server = app.listen(app.get("port"), () => {
  console.log("\nApp is running at http://localhost:%d in %s mode\n", app.get("port"), app.get("env"));
});

export default server;
