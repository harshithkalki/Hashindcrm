import { z } from 'zod';

export const ZTicketCreateInput = z.object({
  name: z.string(),
  assignedTo: z.string().optional(),
  status: z.string(),
});

export const ZTicketUpdateInput = ZTicketCreateInput.partial().extend({
  _id: z.string(),
});

export const ZTicket = ZTicketCreateInput.extend({
  createdAt: z.date(),
  company: z.string(),
});
