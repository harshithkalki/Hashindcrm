import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import UserModel from '@/models/userModel';
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
        initialStatus: z.boolean(),
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
        target: z.string(),
        linkedStatus: z.string(),
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

      const target = await StatusModel.findById(input.target);
      const status2 = await StatusModel.findById(input.linkedStatus);

      const targetStatuses = new Set(target?.linkedStatuses);

      const linkedStatus2 = new Set(status2?.linkedStatuses);

      if (status2 && target) {
        targetStatuses.add(status2?._id.toString());
        linkedStatus2.add(target._id.toString());

        target.linkedStatuses = [...targetStatuses];
        await target.save();
        status2.linkedStatuses = [...linkedStatus2];
        await status2.save();
      }

      return {
        success: true,
        message: 'New linked added successfully',
      };
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

  getWorkflow: protectedProcedure.query(async ({ ctx }) => {
    const client = await UserModel.findById(ctx.userId);

    type Status = {
      id: string;
      name: string;
      linkedStatuses: { name: string; value: string }[];
      initialStatus: boolean;
    };

    type Workflow = Status[];

    if (!client) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to create workflow',
      });
    }

    const isPermitted = await checkPermission(
      'WORKFLOW',
      'create',
      client?.toObject(),
      true
    );

    if (!isPermitted) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'You are not permitted to create workflow',
      });
    }

    const statuses = await StatusModel.find({ companyId: client.companyId });

    const workflow: Workflow = statuses.map((val) => {
      return {
        id: val._id.toString(),
        initialStatus: val.initialStatus,
        name: val.name,
        linkedStatuses: val.linkedStatuses.map((id) => {
          const result = statuses.find((val) => val._id.toString() === id);
          if (result)
            return { name: result.name, value: result._id.toString() };
          return { name: '', value: '' };
        }),
      };
    });

    return workflow;
  }),

  removeLink: protectedProcedure
    .input(
      z.object({
        target: z.string(),
        linkedStatus: z.string(),
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

      const target = await StatusModel.findById(input.target);
      const status2 = await StatusModel.findById(input.linkedStatus);

      const targetStatuses = new Set(target?.linkedStatuses);

      const linkedStatus2 = new Set(status2?.linkedStatuses);

      if (status2 && target) {
        targetStatuses.delete(status2?._id.toString());
        linkedStatus2.delete(target._id.toString());

        target.linkedStatuses = [...targetStatuses];
        await target.save();
        status2.linkedStatuses = [...linkedStatus2];
        await status2.save();
      }

      return {
        success: true,
        message: 'New linked added successfully',
      };
    }),
});
