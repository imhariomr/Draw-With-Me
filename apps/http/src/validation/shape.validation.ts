import {z} from 'zod';

export const roomNameValidator = z.object({
    roomName: z.string().min(5, { message: "Must be 5 or more characters long" }),
    user: z.object({
        email: z.string(),
        username: z.string()
    })
});

const shapeTypeSchema = z.union([
    z.literal('rectangle'),
    z.literal('circle')
])

export const shapeValidator = z.object({
    type: z.enum(['rectangle', 'circle','line']),
    X: z.number(),
    y: z.number(),
    slug: z.string(),
    drawX: z.number().optional(),
    drawY: z.number().optional(),
    lineX: z.number().optional(),
    lineY: z.number().optional(),
    radius: z.number().optional(),
});

export const roomValidator = z.object({
    slug: z.string()
})