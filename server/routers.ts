import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { uploadToCloudinary } from "./cloudinary-storage.js";
import {
  createUser,
  getUserByEmail,
  verifyPassword,
  getPendingUsers,
  approveUser as dbApproveUser,
  rejectUser as dbRejectUser,
  getApprovedUsers,
  createPost as dbCreatePost,
  getPosts as dbGetPosts,
  likePost as dbLikePost,
  addPostComment as dbAddPostComment,
  getPostComments as dbGetPostComments,
  createMessage as dbCreateMessage,
  getConversationMessages as dbGetConversationMessages,
  createRecognition as dbCreateRecognition,
  getRecognitions as dbGetRecognitions,
} from "./db.js";
import { z } from "zod";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    uploadAvatar: publicProcedure
      .input(
        z.object({
          imageBase64: z.string().min(1, "Imagem é obrigatória"),
          mimeType: z.string().default("image/jpeg"),
        }),
      )
      .mutation(async ({ input }) => {
        try {
          // Converter base64 para Buffer
          const base64Data = input.imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");

          // Fazer upload para Cloudinary (armazenamento gratuito)
          const { url } = await uploadToCloudinary(
            buffer,
            "avatars", // folder
            `avatar_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`, // public_id
          );

          return { url };
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? `Erro ao fazer upload da foto: ${error.message}`
              : "Erro desconhecido ao fazer upload da foto",
          );
        }
      }),
    register: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email(),
          password: z.string().min(4),
          appRole: z.enum(["gerente", "consultora"]),
          unitId: z.number(),
          avatarUrl: z.string().url().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        // Check if email already exists
        const existing = await getUserByEmail(input.email);
        if (existing) {
          throw new Error("Este e-mail já está cadastrado");
        }

        const userId = await createUser({
          name: input.name,
          email: input.email,
          password: input.password,
          appRole: input.appRole,
          unitId: input.unitId,
          avatarUrl: input.avatarUrl,
        });
        if (!userId) {
          throw new Error("Erro ao criar usuário");
        }

        return { success: true, userId };
      }),
    login: publicProcedure
      .input(
        z.object({
          identifier: z.string(),
          password: z.string(),
        }),
      )
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.identifier);
        if (!user) {
          throw new Error("Credenciais inválidas");
        }

        if (!user.password) {
          throw new Error("Credenciais inválidas");
        }

        const isValid = await verifyPassword(input.password, user.password);
        if (!isValid) {
          throw new Error("Credenciais inválidas");
        }

        if (user.approvalStatus === "pending") {
          return { success: false, pending: true };
        }

        if (user.approvalStatus === "rejected") {
          throw new Error("Seu cadastro foi rejeitado. Entre em contato com o administrador.");
        }

        return { success: true, user };
      }),
    getPendingUsers: publicProcedure.query(async ({ ctx }) => {
      // Por enquanto público - autenticação será verificada no frontend
      // TODO: Implementar autenticação JWT ou sessão para proteger
      return await getPendingUsers();
    }),
    approveUser: publicProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        // TODO: Implementar autenticação JWT ou sessão para proteger
        const success = await dbApproveUser(input.userId);
        if (!success) {
          throw new Error("Erro ao aprovar usuário");
        }
        return { success: true };
      }),
    rejectUser: publicProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        // TODO: Implementar autenticação JWT ou sessão para proteger
        const success = await dbRejectUser(input.userId);
        if (!success) {
          throw new Error("Erro ao rejeitar usuário");
        }
        return { success: true };
      }),
    getApprovedUsers: publicProcedure.query(async () => {
      // Por enquanto público - autenticação será verificada no frontend
      return await getApprovedUsers();
    }),
  }),

  posts: router({
    uploadImage: protectedProcedure
      .input(
        z.object({
          imageBase64: z.string().min(1, "Imagem é obrigatória"),
          mimeType: z.string().default("image/jpeg"),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Converter base64 para Buffer
          const base64Data = input.imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");

          // Fazer upload para Cloudinary (armazenamento gratuito)
          const { url } = await uploadToCloudinary(
            buffer,
            "posts", // folder
            `post_${ctx.user.id}_${Date.now()}`, // public_id
          );

          return { url };
        } catch (error) {
          throw new Error(
            error instanceof Error
              ? `Erro ao fazer upload da imagem: ${error.message}`
              : "Erro desconhecido ao fazer upload da imagem",
          );
        }
      }),
    create: publicProcedure
      .input(
        z.object({
          authorId: z.number(),
          content: z.string().min(1),
          category: z.string().default("geral"),
          imageUrl: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        // TODO: Implementar autenticação JWT ou sessão para proteger
        const postId = await dbCreatePost({
          authorId: input.authorId,
          content: input.content,
          category: input.category,
          imageUrl: input.imageUrl || null,
        });

        if (!postId) {
          throw new Error("Erro ao criar post");
        }

        return { success: true, postId };
      }),
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        return await dbGetPosts(input.category);
      }),
    like: publicProcedure
      .input(
        z.object({
          postId: z.number(),
          userId: z.number(),
        }),
      )
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        const success = await dbLikePost(input.postId, input.userId);
        if (!success) {
          throw new Error("Erro ao curtir post");
        }
        return { success: true };
      }),
    addComment: publicProcedure
      .input(
        z.object({
          postId: z.number(),
          authorId: z.number(),
          content: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        const commentId = await dbAddPostComment({
          postId: input.postId,
          authorId: input.authorId,
          content: input.content,
        });

        if (!commentId) {
          throw new Error("Erro ao adicionar comentário");
        }

        return { success: true, commentId };
      }),
    getComments: publicProcedure
      .input(
        z.object({
          postId: z.number(),
        }),
      )
      .query(async ({ input }) => {
        return await dbGetPostComments(input.postId);
      }),
  }),

  messages: router({
    create: publicProcedure
      .input(
        z.object({
          conversationId: z.number(),
          senderId: z.number(),
          content: z.string().min(1),
        }),
      )
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        const messageId = await dbCreateMessage({
          conversationId: input.conversationId,
          senderId: input.senderId,
          content: input.content,
        });

        if (!messageId) {
          throw new Error("Erro ao enviar mensagem");
        }

        return { success: true, messageId };
      }),
    getConversation: publicProcedure
      .input(
        z.object({
          conversationId: z.number(),
        }),
      )
      .query(async ({ input }) => {
        return await dbGetConversationMessages(input.conversationId);
      }),
  }),

  recognitions: router({
    create: publicProcedure
      .input(
        z.object({
          senderId: z.number(),
          receiverId: z.number(),
          type: z.enum(["parabens", "obrigado", "destaque"]),
          message: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        // Por enquanto público - autenticação será verificada no frontend
        const recognitionId = await dbCreateRecognition({
          senderId: input.senderId,
          receiverId: input.receiverId,
          type: input.type,
          message: input.message || null,
        });

        if (!recognitionId) {
          throw new Error("Erro ao criar reconhecimento");
        }

        return { success: true, recognitionId };
      }),
    list: publicProcedure.query(async () => {
      return await dbGetRecognitions();
    }),
  }),
});

export type AppRouter = typeof appRouter;
