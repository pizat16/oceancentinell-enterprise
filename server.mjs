import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json"
};

const server = createServer(async (req, res) => {

  // API: Metrics
  if (req.url === "/api/metrics") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      riskScore: 47.3,
      assets: 110,
      uptime: 99.88,
      eps: 6400
    }));
  }

  // API: Incidents
  if (req.url === "/api/incidents") {
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

  // Static files
  let filePath = "./public" + (req.url === "/" ? "/index.html" : req.url);

  try {
    const data = await readFile(filePath);
    const ext = extname(filePath);

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "text/plain"
    });

    res.end(data);

  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});

// Start server
server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
