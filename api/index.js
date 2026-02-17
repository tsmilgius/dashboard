import express from "express";
import si from "systeminformation";

const app = express();

app.get("/api/metrics", async (_req, res) => {
  try {
    const [load, mem, fs, temp] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.cpuTemperature(),
    ]);

    const root = fs.find((x) => x.mount === "/") ?? fs[0];

    res.json({
      cpu: { usagePercent: Number(load.currentLoad.toFixed(1)) },
      ram: {
        totalBytes: mem.total,
        usedBytes: mem.used,
        freeBytes: mem.free,
        usagePercent: Number(((mem.used / mem.total) * 100).toFixed(1)),
      },
      disk: root
        ? {
            mount: root.mount,
            totalBytes: root.size,
            usedBytes: root.used,
            freeBytes: root.size - root.used,
            usagePercent: Number(root.use.toFixed(1)),
          }
        : null,
      temperature: { celsius: temp.main ?? null },
      at: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

app.listen(3001, "0.0.0.0", () => console.log("metrics API on :3001"));