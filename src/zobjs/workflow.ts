import { z } from 'zod';

export const ZWorkflowCreateInput = z.object({
  name: z.string(),
  links: z.array(z.string()),
});

export const ZWorkflowUpdateInput = ZWorkflowCreateInput.partial().extend({
  _id: z.string(),
});

export const ZWorkflow = ZWorkflowCreateInput.extend({
  company: z.string(),
});

export type WorkflowCreateInput = z.infer<typeof ZWorkflowCreateInput>;

export type WorkflowUpdateInput = z.infer<typeof ZWorkflowUpdateInput>;

export type Workflow = z.infer<typeof ZWorkflow>;
