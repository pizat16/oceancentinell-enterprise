import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Fix __dirname for ES modules (CRÍTICO en Linux)
const __filename = fileURLToPath(import.meta.url);
const __dirname = new URL('.', import.meta.url).pathname;

// MIME types
const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

const server = createServer(async (req, res) => {

  const url = req.url.split("?")[0]; // limpia parámetros

  // =========================
  // API: Metrics
  // =========================
  if (url === "/api/metrics") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      riskScore: 47.3,
      assets: 110,
      uptime: 99.88,
      eps: 6400
    }));
  }

  // =========================
  // API: Incidents
  // =========================
  if (url === "/api/incidents") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify([
      {
        id: "INC-1223",
        severity: "CRITICAL",
        tags: ["Brute Force", "Fleet Gateway", "Operational Zone Alpha"]
      },
      {
        id: "INC-9345",
        severity: "LOW",
        tags: ["Ransomware", "Bridge Server", "Operational Zone Bravo"]
      },
      {
        id: "INC-7857",
        severity: "HIGH",
        tags: ["Port Scan", "Radar Host", "Operational Zone Bravo"]
      }
    ]));
  }

  // =========================
  // STATIC FILES (FIX REAL)
  // =========================
  let filePath = join(__dirname, "public", url === "/" ? "index.html" : url);

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "text/plain"
    });

    res.end(data);

  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});

// =========================
// START SERVER (CLAVE)
// =========================
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
