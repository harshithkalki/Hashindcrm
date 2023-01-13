import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/userModel';
import LinkModel from '@/models/Link';
import StatusModel from '@/models/Status';
import WorkflowModel from '@/models/Workflow';
import { TRPCError } from '@trpc/server';
import checkPermission from '@/utils/checkPermission';

interface StatusType {
  id: string;
  name: string;
  linkedStatuses: StatusType[];
}

const Status: z.ZodType<StatusType> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    linkedStatuses: z.array(Status),
  })
);

export const workflowRouter = router({
  createStatus: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const isPermitted = await checkPermission(
        'WORKFLOW',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a status',
        });
      }

      const status = await StatusModel.create({
        ...input,
        companyId: client.companyId,
      });

      return status;
    }),

  createLink: protectedProcedure
    .input(
      z.object({
        workflowId: z.string(),
        target: z.string(),
        linkedStatus: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a link',
        });
      }

      const isPermitted = await checkPermission(
        'WORKFLOW',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create a link',
        });
      }

      const link = await LinkModel.create(input.target);

      return link;
    }),

  createWorkflow: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const client = await UserModel.findById(ctx.userId);

      if (!client) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create workflow',
        });
      }

      const isPermitted = await checkPermission(
        'WORKFLOW',
        'create',
        client?.toObject()
      );

      if (!isPermitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You are not permitted to create workflow',
        });
      }

      const workflow = await WorkflowModel.create({
        ...input,
        companyId: client.companyId,
      });

      return workflow;
    }),
});
