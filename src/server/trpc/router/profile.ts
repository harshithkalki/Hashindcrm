import { router, protectedProcedure } from "@/server/trpc/trpc";
import { z } from "zod";
import StaffModel from "@/models/StaffMem";


export const profileRouter = router({
    update: protectedProcedure.input(z.object({
        name: z.string(),
        email: z.string(),
        profile: z.string(),
        password: z.string().optional(),
        phone: z.string(),
    })).mutation(({ ctx, input }) => {
        const id = ctx.clientId;
        const { password } = input;

        delete input.password;

        const staff = StaffModel.updateOne({
            _id: id,
        }, {
            ...input,
            ...(password ? { password } : {}),
        })

        return staff;
    })
});
