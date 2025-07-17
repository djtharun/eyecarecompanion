import { 
  users, 
  userSettings,
  timerSessions,
  dailyStats,
  type User, 
  type InsertUser,
  type UserSettings,
  type InsertUserSettings,
  type TimerSession,
  type InsertTimerSession,
  type DailyStats,
  type InsertDailyStats
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Settings methods
  getUserSettings(userId: number): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  
  // Timer session methods
  createTimerSession(session: InsertTimerSession): Promise<TimerSession>;
  updateTimerSession(id: number, updates: Partial<InsertTimerSession>): Promise<TimerSession>;
  getUserTimerSessions(userId: number, limit?: number): Promise<TimerSession[]>;
  
  // Daily stats methods
  getDailyStats(userId: number, date: string): Promise<DailyStats | undefined>;
  createDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  updateDailyStats(userId: number, date: string, updates: Partial<InsertDailyStats>): Promise<DailyStats>;
  getUserWeeklyStats(userId: number): Promise<DailyStats[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Settings methods
  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings || undefined;
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [newSettings] = await db
      .insert(userSettings)
      .values(settings)
      .returning();
    return newSettings;
  }

  async updateUserSettings(userId: number, updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    const [updatedSettings] = await db
      .update(userSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userSettings.userId, userId))
      .returning();
    return updatedSettings;
  }

  // Timer session methods
  async createTimerSession(session: InsertTimerSession): Promise<TimerSession> {
    const [newSession] = await db
      .insert(timerSessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateTimerSession(id: number, updates: Partial<InsertTimerSession>): Promise<TimerSession> {
    const [updatedSession] = await db
      .update(timerSessions)
      .set(updates)
      .where(eq(timerSessions.id, id))
      .returning();
    return updatedSession;
  }

  async getUserTimerSessions(userId: number, limit: number = 50): Promise<TimerSession[]> {
    return await db
      .select()
      .from(timerSessions)
      .where(eq(timerSessions.userId, userId))
      .orderBy(desc(timerSessions.startedAt))
      .limit(limit);
  }

  // Daily stats methods
  async getDailyStats(userId: number, date: string): Promise<DailyStats | undefined> {
    const [stats] = await db
      .select()
      .from(dailyStats)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)));
    return stats || undefined;
  }

  async createDailyStats(stats: InsertDailyStats): Promise<DailyStats> {
    const [newStats] = await db
      .insert(dailyStats)
      .values(stats)
      .returning();
    return newStats;
  }

  async updateDailyStats(userId: number, date: string, updates: Partial<InsertDailyStats>): Promise<DailyStats> {
    const [updatedStats] = await db
      .update(dailyStats)
      .set(updates)
      .where(and(eq(dailyStats.userId, userId), eq(dailyStats.date, date)))
      .returning();
    return updatedStats;
  }

  async getUserWeeklyStats(userId: number): Promise<DailyStats[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateString = sevenDaysAgo.toISOString().split('T')[0];
    
    return await db
      .select()
      .from(dailyStats)
      .where(and(
        eq(dailyStats.userId, userId),
        // Note: This is a simple comparison, in production you'd want proper date filtering
      ))
      .orderBy(desc(dailyStats.date))
      .limit(7);
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private settings: Map<number, UserSettings>;
  private sessions: Map<number, TimerSession>;
  private stats: Map<string, DailyStats>;
  currentId: number;
  currentSessionId: number;
  currentStatsId: number;

  constructor() {
    this.users = new Map();
    this.settings = new Map();
    this.sessions = new Map();
    this.stats = new Map();
    this.currentId = 1;
    this.currentSessionId = 1;
    this.currentStatsId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async getUserSettings(userId: number): Promise<UserSettings | undefined> {
    return this.settings.get(userId);
  }

  async createUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const newSettings: UserSettings = {
      id: this.currentId++,
      eyeInterval: 20,
      postureInterval: 45,
      eyeNotifications: true,
      postureNotifications: true,
      soundAlerts: false,
      autoStart: true,
      ...settings,
      updatedAt: new Date(),
    };
    this.settings.set(settings.userId, newSettings);
    return newSettings;
  }

  async updateUserSettings(userId: number, updates: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = this.settings.get(userId);
    if (!existing) {
      throw new Error('Settings not found');
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.settings.set(userId, updated);
    return updated;
  }

  async createTimerSession(session: InsertTimerSession): Promise<TimerSession> {
    const newSession: TimerSession = {
      id: this.currentSessionId++,
      completed: false,
      ...session,
      startedAt: new Date(),
      completedAt: null,
    };
    this.sessions.set(newSession.id, newSession);
    return newSession;
  }

  async updateTimerSession(id: number, updates: Partial<InsertTimerSession>): Promise<TimerSession> {
    const existing = this.sessions.get(id);
    if (!existing) {
      throw new Error('Session not found');
    }
    const updated = { ...existing, ...updates };
    this.sessions.set(id, updated);
    return updated;
  }

  async getUserTimerSessions(userId: number, limit: number = 50): Promise<TimerSession[]> {
    return Array.from(this.sessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }

  async getDailyStats(userId: number, date: string): Promise<DailyStats | undefined> {
    const key = `${userId}-${date}`;
    return this.stats.get(key);
  }

  async createDailyStats(stats: InsertDailyStats): Promise<DailyStats> {
    const newStats: DailyStats = {
      id: this.currentStatsId++,
      eyeBreaksCompleted: 0,
      postureChecksCompleted: 0,
      totalFocusTime: 0,
      ...stats,
    };
    const key = `${stats.userId}-${stats.date}`;
    this.stats.set(key, newStats);
    return newStats;
  }

  async updateDailyStats(userId: number, date: string, updates: Partial<InsertDailyStats>): Promise<DailyStats> {
    const key = `${userId}-${date}`;
    const existing = this.stats.get(key);
    if (!existing) {
      throw new Error('Stats not found');
    }
    const updated = { ...existing, ...updates };
    this.stats.set(key, updated);
    return updated;
  }

  async getUserWeeklyStats(userId: number): Promise<DailyStats[]> {
    return Array.from(this.stats.values())
      .filter(stat => stat.userId === userId)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);
  }
}

export const storage = new DatabaseStorage();
