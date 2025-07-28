import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const PORT = process.env.PORT;

app.use(express.static(join(__dirname, "dist")));

app.get("/*", function (req, res) {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

app.listen(PORT);
console.log(`Server started on port ${PORT}`);
