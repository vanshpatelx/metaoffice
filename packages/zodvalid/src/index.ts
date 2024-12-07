import z from 'zod';

export const signUpParams = z.object({
    username: z.string()
        .min(1, 'Username is required')
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Username must be a valid email address'
        ),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    type: z.enum(['admin', 'user']),
});

export const signInParams = z.object({
    username: z.string(),
    password: z.string()
});

export const addElementParams = z.object({
    name: z.string(),
    height: z.number(),
    width: z.number(),
    staticImg : z.boolean()
});

export const updateElementParams = z.object({
    name: z.string(),
    height: z.number(),
    width: z.number(),
    staticImg : z.boolean(),
    Id: z.bigint()
});


export const addAvatarParams = z.object({
    name: z.string()
});

export const addMapParams = z.object({
    name: z.string(),
    height: z.number(),
    width: z.number(),
    elements: z.array(z.bigint())
});