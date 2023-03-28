import { z } from "zod";
import { createTRPCRouter, publicProcedure, adminProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { MyPrismaClient } from "~/server/prisma";
import { difficulty, Prisma } from "@prisma/client";
import { getCombinedSchema, getOrderObject } from "~/server/api/utils/sortOrderHelpers";
import { getNonEmptyArray } from "~/utils/getNonEmptyArray";
import { intMaxSizes } from "~/consts/integerSizes";




const defaultDifficultySelect = Prisma.validator<Prisma.difficultySelect>()({
    id: true,
    name: true,
    description: true,
    parentDifficultyId: true,
    order: true,
});




const difficultyNameSchema_NonObject = z.string().min(1).max(50);


const difficultyIdSchema_NonObject = z.number().gte(1).lte(intMaxSizes.smallInt.unsigned);

const difficultyIdSchema = z.object({
    id: difficultyIdSchema_NonObject,
}).strict();


const difficultyPostSchema = z.object({
    name: difficultyNameSchema_NonObject,
    description: z.string().min(1).max(100).nullish(),
    parentDifficultyId: difficultyIdSchema_NonObject.nullable(),
    order: z.number().gte(1).lte(intMaxSizes.tinyInt.unsigned),
}).strict();


const difficultyOrderSchema = getCombinedSchema(
    getNonEmptyArray(Prisma.DifficultyScalarFieldEnum),
    ["parentDifficultyId", "order"],
    ["asc"],
);




const validateDifficulty = async (
    prisma: MyPrismaClient, id: number | undefined, parentDifficultyId: number | null | undefined, order: number | undefined
): Promise<void> => {
    if (parentDifficultyId) {
        const parentDifficulty = await prisma.difficulty.findUnique({ where: { id: parentDifficultyId } });

        if (!parentDifficulty) throw new TRPCError({
            message: "parentDifficulty not found",
            code: "NOT_FOUND"
        });

        if (parentDifficulty.parentDifficultyId !== 0) throw new TRPCError({
            message: "This difficulty is malformed. SubDifficulties may not have their own subDifficulties. Please contact an admin.",
            code: "INTERNAL_SERVER_ERROR",
        });
    }


    const matchingDifficulty = await prisma.difficulty.findFirst({
        where: {
            NOT: { id: id },
            parentDifficultyId: parentDifficultyId,
            order: order,
        }
    });

    if (matchingDifficulty) throw new TRPCError({
        message: `Conflicts with existing difficulty ${matchingDifficulty.id}`,
        code: "FORBIDDEN",
    });
}




const getDifficultyById = async (prisma: MyPrismaClient, id: number): Promise<difficulty> => {
    const difficulty = await prisma.difficulty.findUnique({
        where: { id: id },
        select: defaultDifficultySelect,
    });

    if (!difficulty) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: `No difficulty exists with id "${id}"`,
        });
    }

    return difficulty;
}




export const difficultyRouter = createTRPCRouter({
    getAll: publicProcedure
        .input(difficultyOrderSchema)
        .query(({ ctx, input }) => {
            return ctx.prisma.difficulty.findMany({
                select: defaultDifficultySelect,
                orderBy: getOrderObject(input.selectors, input.directions),
            });
        }),

    getMany: publicProcedure
        .input(
            z.object({
                pageSize: z.number().int().min(1).max(10).default(50),
                pageNumber: z.number().int().min(1).default(1),
            }).strict().merge(difficultyOrderSchema),
        )
        .query(async ({ ctx, input }) => {
            const { pageSize, pageNumber } = input;

            const numToSkip = pageSize * (pageNumber - 1);

            const difficulties = await ctx.prisma.difficulty.findMany({
                skip: numToSkip,
                take: pageSize,
                select: defaultDifficultySelect,
                orderBy: getOrderObject(input.selectors, input.directions),
            });

            return difficulties;
        }),

    getById: publicProcedure
        .input(difficultyIdSchema)
        .query(async ({ ctx, input }) => {
            const difficulty = await getDifficultyById(ctx.prisma, input.id);

            return difficulty;
        }),

    getByParentDifficultyId: publicProcedure
        .input(difficultyIdSchema.merge(difficultyOrderSchema))
        .query(async ({ ctx, input }) => {
            const difficulties = await ctx.prisma.difficulty.findMany({
                where: { parentDifficultyId: input.id },
                select: defaultDifficultySelect,
                orderBy: getOrderObject(input.selectors, input.directions),
            });

            return difficulties;
        }),

    getByName: publicProcedure
        .input(
            z.object({
                query: difficultyNameSchema_NonObject,
            }).strict().merge(difficultyOrderSchema),
        )
        .query(async ({ ctx, input }) => {
            const difficulties = await ctx.prisma.difficulty.findMany({
                where: { name: { contains: input.query } },
                select: defaultDifficultySelect,
                orderBy: getOrderObject(input.selectors, input.directions),
            });

            return difficulties;
        }),

    add: adminProcedure
        .input(difficultyPostSchema)
        .mutation(async ({ ctx, input }) => {
            await validateDifficulty(ctx.prisma, undefined, input.parentDifficultyId, input.order);     //check that the new difficulty won't conflict with an existing one

            const difficulty = await ctx.prisma.difficulty.create({
                data: input,
                select: defaultDifficultySelect,
            });

            return difficulty;
        }),

    edit: adminProcedure
        .input(difficultyPostSchema.partial().merge(difficultyIdSchema))
        .mutation(async ({ ctx, input }) => {
            await getDifficultyById(ctx.prisma, input.id);  //check that id matches an existing difficulty
            await validateDifficulty(ctx.prisma, input.id, input.parentDifficultyId, input.order);     //check that the new difficulty won't conflict with an existing one

            const difficulty = await ctx.prisma.difficulty.update({
                where: { id: input.id },
                data: input,
                select: defaultDifficultySelect,
            });

            return difficulty;
        }),

    delete: adminProcedure
        .input(difficultyIdSchema)
        .mutation(async ({ ctx, input }) => {
            await getDifficultyById(ctx.prisma, input.id);  //check that id matches an existing difficulty

            await ctx.prisma.difficulty.delete({ where: { id: input.id } });

            return true;
        }),
});