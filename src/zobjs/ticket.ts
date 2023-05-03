import { z } from 'zod';

export const ZTicketCreateInput = z.object({
  name: z.string(),
  issueType: z.string(),
  description: z.string().optional(),
  files: z.array(z.string()),
  assignedTo: z.string().optional(),
  status: z.string(),
});

export const ZTicketUpdateInput = ZTicketCreateInput.partial().extend({
  _id: z.string(),
});

export const ZTicket = ZTicketCreateInput.extend({
  createdAt: z.date(),
  companyId: z.string(),
});

export type ITicket = z.infer<typeof ZTicket>;
export type ITicketCreateInput = z.infer<typeof ZTicketCreateInput>;
