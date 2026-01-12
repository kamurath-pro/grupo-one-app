import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  InsertPost, 
  posts, 
  InsertPostComment,
  postComments,
  InsertMessage,
  messages,
  InsertRecognition,
  recognitions,
  InsertConversation,
  conversations,
  conversationParticipants,
  postLikes,
  units,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    if (_connectionAttempts >= MAX_CONNECTION_ATTEMPTS) {
      console.error("[Database] Max connection attempts reached. Database unavailable.");
      return null;
    }

    try {
      _connectionAttempts++;
      _db = drizzle(process.env.DATABASE_URL);
      _connectionAttempts = 0; // Reset on success
    } catch (error) {
      console.warn(`[Database] Failed to connect (attempt ${_connectionAttempts}/${MAX_CONNECTION_ATTEMPTS}):`, error);
      _db = null;
      // Don't throw - allow graceful degradation
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// User management functions
export async function createUser(userData: {
  name: string;
  email: string;
  password: string;
  appRole: "socio" | "gerente" | "consultora";
  unitId: number;
  avatarUrl?: string;
}): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    // Por enquanto, armazenar senha em texto plano (será migrado para hash depois)
    // TODO: Implementar bcrypt quando necessário
    const result = await db.insert(users).values({
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: userData.password, // TODO: hash com bcrypt
      appRole: userData.appRole,
      unitId: userData.unitId,
      avatarUrl: userData.avatarUrl || null,
      approvalStatus: "pending",
      registeredAt: new Date(),
    });

    return result[0].insertId;
  } catch (error) {
    return null;
  }
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    return undefined;
  }
}

export async function verifyPassword(plainPassword: string, storedPassword: string): Promise<boolean> {
  try {
    // Por enquanto, comparação simples (será migrado para bcrypt depois)
    // TODO: Implementar bcrypt quando necessário
    return plainPassword === storedPassword;
  } catch {
    return false;
  }
}

export async function getPendingUsers() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.approvalStatus, "pending"))
      .orderBy(desc(users.registeredAt));
  } catch (error) {
    return [];
  }
}

export async function approveUser(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(users)
      .set({ approvalStatus: "approved" })
      .where(eq(users.id, userId));
    return true;
  } catch (error) {
    return false;
  }
}

export async function rejectUser(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(users)
      .set({ approvalStatus: "rejected" })
      .where(eq(users.id, userId));
    return true;
  } catch (error) {
    return false;
  }
}

export async function getApprovedUsers() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(users)
      .where(eq(users.approvalStatus, "approved"));
  } catch (error) {
    return [];
  }
}

// Posts functions
export async function createPost(postData: InsertPost): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(posts).values(postData);
    return result[0].insertId;
  } catch (error) {
    return null;
  }
}

export async function getPosts(category?: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    if (category && category !== "geral") {
      return await db
        .select()
        .from(posts)
        .where(eq(posts.category, category))
        .orderBy(desc(posts.createdAt))
        .limit(100);
    }
    return await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(100);
  } catch (error) {
    return [];
  }
}

export async function likePost(postId: number, userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Check if already liked
    const existing = await db
      .select()
      .from(postLikes)
      .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      // Unlike
      await db
        .delete(postLikes)
        .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)));
      
      // Decrement likes count - buscar valor atual e decrementar
      const currentPost = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
      if (currentPost.length > 0) {
        await db
          .update(posts)
          .set({ likesCount: Math.max(0, (currentPost[0].likesCount || 0) - 1) })
          .where(eq(posts.id, postId));
      }
    } else {
      // Like
      await db.insert(postLikes).values({ postId, userId });
      // Increment likes count - buscar valor atual e incrementar
      const currentPost = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
      if (currentPost.length > 0) {
        await db
          .update(posts)
          .set({ likesCount: (currentPost[0].likesCount || 0) + 1 })
          .where(eq(posts.id, postId));
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

export async function addPostComment(commentData: InsertPostComment): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(postComments).values(commentData);
    
    // Update post comments count - buscar valor atual e incrementar
    const currentPost = await db.select().from(posts).where(eq(posts.id, commentData.postId)).limit(1);
    if (currentPost.length > 0) {
      await db
        .update(posts)
        .set({ commentsCount: (currentPost[0].commentsCount || 0) + 1 })
        .where(eq(posts.id, commentData.postId));
    }

    return result[0].insertId;
  } catch (error) {
    return null;
  }
}

export async function getPostComments(postId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(postComments)
      .where(eq(postComments.postId, postId))
      .orderBy(desc(postComments.createdAt));
  } catch (error) {
    return [];
  }
}

// Messages functions
export async function createMessage(messageData: InsertMessage): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(messages).values(messageData);
    return result[0].insertId;
  } catch (error) {
    return null;
  }
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.createdAt))
      .limit(100);
  } catch (error) {
    return [];
  }
}

// Recognitions functions
export async function createRecognition(recognitionData: InsertRecognition): Promise<number | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(recognitions).values(recognitionData);
    return result[0].insertId;
  } catch (error) {
    return null;
  }
}

export async function getRecognitions() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(recognitions)
      .orderBy(desc(recognitions.createdAt))
      .limit(100);
  } catch (error) {
    return [];
  }
}

// Units functions
export async function getAllUnits() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(units).orderBy(units.name);
  } catch (error) {
    return [];
  }
}
