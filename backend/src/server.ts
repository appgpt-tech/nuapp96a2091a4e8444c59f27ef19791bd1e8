// src/server.ts
import "reflect-metadata";
import { app, initialize } from "./app";

const port = process.env.PORT || 3000;

(async function () {
  await initialize();
  app.listen(port, () =>
    console.log(`App backend listening at http://localhost:${port}`)
  );
})();
