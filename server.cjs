const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const rawPort = process.env.PORT || 3000;
const port = isNaN(rawPort) ? rawPort : parseInt(rawPort, 10);

const app = next({ dev, hostname, port: typeof port === "number" ? port : 3000 });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("Internal Server Error");
    }
  });

  server.once("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> Next.js CMS ready on port/pipe: ${port}`);
  });
}).catch((err) => {
  console.error("Failed to start Next.js app:", err);
  process.exit(1);
});
