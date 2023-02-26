import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import StatusModel from '@/models/Status';
import WorkflowModel from '@/models/Workflow';
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
      const client = await checkPermission(
        'WORKFLOW',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create a status'
      );

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
      await checkPermission(
        'WORKFLOW',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create a link'
      );

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
      const client = await checkPermission(
        'WORKFLOW',
        {
          create: true,
        },
        ctx.clientId,
        'You are not permitted to create a workflow'
      );

      const workflow = await WorkflowModel.create({
        ...input,
        companyId: client.companyId,
      });

      return workflow;
    }),

  getWorkflow: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'WORKFLOW',
      {
        read: true,
        update: true,
        delete: true,
      },
      ctx.clientId,
      'You are not permitted to read a workflow'
    );

    type Status = {
      id: string;
      name: string;
      linkedStatuses: { name: string; value: string }[];
      initialStatus: boolean;
    };

    type Workflow = Status[];

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
      await checkPermission(
        'WORKFLOW',
        {
          update: true,
        },
        ctx.clientId,
        'You are not permitted to remove a link'
      );

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

  getInitialStatuses: protectedProcedure.query(async ({ ctx }) => {
    const client = await checkPermission(
      'WORKFLOW',
      {
        read: true,
        update: true,
        delete: true,
      },
      ctx.clientId,
      'You are not permitted to read a workflow'
    );

    const initialStatuses = await StatusModel.find({
      companyId: client.companyId,
      initialStatus: true,
    });

    return initialStatuses;
  }),

  getLinkedStatuses: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const client = await checkPermission(
        'WORKFLOW',
        {
          read: true,
          update: true,
          delete: true,
        },
        ctx.clientId,
        'You are not permitted to read a workflow'
      );

      const status = await StatusModel.findById(input).populate(
        'linkedStatuses',
        undefined,
        StatusModel
      );

      const linkedStatuses = status?.linkedStatuses as unknown as {
        _id: string;
        name: string;
      }[];

      linkedStatuses.push({
        _id: status!._id.toString(),
        name: status!.name,
      });

      return linkedStatuses;
    }),
});
