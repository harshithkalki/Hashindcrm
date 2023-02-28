import { z } from 'zod';

export const ZStatusCreateInput = z.object({
  name: z.string(),
  initialStatus: z.boolean(),
  linkedStatuses: z.array(z.string()).optional(),
});

export const ZStatusUpdateInput = ZStatusCreateInput.partial().extend({
  _id: z.string(),
});

export const ZStatus = ZStatusCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});
