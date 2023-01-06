import { type inferAsyncReturnType } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import connectDb from '@/server/db';
import getServerAuthSession from '../common/get-server-auth-session';

type user = {
  userId: string;
};

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = {
  session: user | null;
};

/** Use this helper for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 **/
export const createContextInner = async ({ session }: CreateContextOptions) => {
  const mongoose = await connectDb();
  return {
    session,
    mongoose,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: CreateNextContextOptions) => {
  await connectDb();
  const id = await getServerAuthSession(opts.req);
  return {
    ...(await createContextInner({
      session: id ? { userId: id } : null,
    })),
    req: opts.req,
    res: opts.res,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
