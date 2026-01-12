import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Enable CORS for all routes - reflect the request origin to support credentials
  app.use((req, res, next) => {
    try {
      const origin = req.headers.origin;
      if (origin) {
        res.header("Access-Control-Allow-Origin", origin);
      }
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      );
      res.header("Access-Control-Allow-Credentials", "true");

      // Handle preflight requests
      if (req.method === "OPTIONS") {
        res.sendStatus(200);
        return;
      }
      next();
    } catch (error) {
      console.error("[Server] CORS middleware error:", error);
      next(error);
    }
  });

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Error handling middleware - must be before routes
  app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("[Server] Unhandled error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
    next();
  });

  registerOAuthRoutes(app);

  app.get("/api/health", (_req, res) => {
    try {
      res.json({ ok: true, timestamp: Date.now() });
    } catch (error) {
      console.error("[Server] Health check error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Health check failed" });
      }
    }
  });

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );

  // Global error handler for unhandled promise rejections
  server.on("error", (error: Error) => {
    console.error("[Server] Server error:", error);
  });

  const preferredPort = parseInt(process.env.PORT || "3000", 10);
  if (isNaN(preferredPort) || preferredPort < 1 || preferredPort > 65535) {
    throw new Error(`Invalid PORT environment variable: ${process.env.PORT}`);
  }

  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  return new Promise<void>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`[api] server listening on port ${port}`);
      resolve();
    });

    server.on("error", (error: Error) => {
      console.error("[Server] Failed to start server:", error);
      reject(error);
    });
  });
}

startServer().catch((error) => {
  console.error("[Server] Fatal error starting server:", error);
  process.exit(1);
});
