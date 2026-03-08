import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { User, Profile, School } from '@prisma/client';

export class UserService {
    static async createUser(data: {
        email: string;
        password: string;
        name: string;
        role?: string;
        schoolId?: string;
    }) {
        const hashedPassword = await hashPassword(data.password);

        return await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
                role: data.role || 'TEACHER',
                profile: {
                    create: {
                        schoolId: data.schoolId,
                    },
                },
            },
            include: {
                profile: true,
            },
        });
    }

    static async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }

    static async findUserById(id: string) {
        return await prisma.user.findUnique({
            where: { id },
            include: { profile: { include: { school: true } } },
        });
    }
}
