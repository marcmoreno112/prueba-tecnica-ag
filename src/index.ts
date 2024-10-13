import "./loadEnvironment.js";
import createDebug from "debug";
import chalk from "chalk";
import app from "./server/index.js";
import connectToDatabase from "./database/connectToDatabase.js";

const debug = createDebug("api:root");

const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  debug(chalk.bgGreen(`Listening on http://localhost:${port}`));
});

const mongoDbConnection = process.env.MONGODB_CONNECTION;

if (!mongoDbConnection) {
  debug(chalk.bgRed(`Missing mongoDbConnection environment variable`));
  process.exit(1);
}

try {
  await connectToDatabase(mongoDbConnection);
  debug(chalk.bgGreen("Connected to database"));
} catch (error: unknown) {
  debug(
    chalk.bgRed(`Error connecting to database: ${(error as Error).message}`)
  );
}
