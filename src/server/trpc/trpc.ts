import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";

import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const router = t.router;

export const publicProcedure = t.procedure;

const isAuthed = t.middleware(({ ctx, next }) => {
<<<<<<< HEAD
  if (!ctx.session || !ctx.session.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
=======
  if (!ctx.session || !ctx.session.clientId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
>>>>>>> 02fa523047798f2c47a348a4c73fc173a3930190
  }
  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: {
          id: ctx.session.clientId,
        },
      },
    },
  });
});

/**
 * Protected procedure
 **/
export const protectedProcedure = t.procedure.use(isAuthed);
