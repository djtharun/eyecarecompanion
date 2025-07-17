import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserSettingsSchema,
  insertTimerSessionSchema,
  insertDailyStatsSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid user data" });
    }
  });

  // Settings routes
  app.get("/api/users/:id/settings", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      let settings = await storage.getUserSettings(userId);
      
      // Create default settings if they don't exist
      if (!settings) {
        settings = await storage.createUserSettings({
          userId,
          eyeInterval: 20,
          postureInterval: 45,
          eyeNotifications: true,
          postureNotifications: true,
          soundAlerts: false,
          autoStart: true,
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id/settings", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const settingsData = insertUserSettingsSchema.parse(req.body);
      
      // Check if settings exist, create if they don't
      let settings = await storage.getUserSettings(userId);
      if (!settings) {
        settings = await storage.createUserSettings({ ...settingsData, userId });
      } else {
        settings = await storage.updateUserSettings(userId, settingsData);
      }
      
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  // Timer session routes
  app.post("/api/timer-sessions", async (req: Request, res: Response) => {
    try {
      const sessionData = insertTimerSessionSchema.parse(req.body);
      const session = await storage.createTimerSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session data" });
    }
  });

  app.put("/api/timer-sessions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateTimerSession(id, updates);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid session update" });
    }
  });

  app.get("/api/users/:id/timer-sessions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const sessions = await storage.getUserTimerSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Daily stats routes
  app.get("/api/users/:id/stats/:date", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { date } = req.params;
      let stats = await storage.getDailyStats(userId, date);
      
      // Create default stats if they don't exist
      if (!stats) {
        stats = await storage.createDailyStats({
          userId,
          date,
          eyeBreaksCompleted: 0,
          postureChecksCompleted: 0,
          totalFocusTime: 0,
        });
      }
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id/stats/:date", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { date } = req.params;
      const statsData = req.body;
      
      let stats = await storage.getDailyStats(userId, date);
      if (!stats) {
        stats = await storage.createDailyStats({ userId, date, ...statsData });
      } else {
        stats = await storage.updateDailyStats(userId, date, statsData);
      }
      
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid stats data" });
    }
  });

  app.get("/api/users/:id/stats/weekly", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const weeklyStats = await storage.getUserWeeklyStats(userId);
      res.json(weeklyStats);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Health check
  app.get("/api/health", async (req: Request, res: Response) => {
    res.json({ status: "ok", message: "EyeRest API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
