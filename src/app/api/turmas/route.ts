import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-service";
import { TurmaService } from "@/services/turmaService";
import prisma from "@/lib/prisma";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const turmas = await TurmaService.getAllByTeacher(session.userId);
        return NextResponse.json({ success: true, turmas });
    } catch (error) {
        console.error("Error fetching turmas:", error);
        return NextResponse.json({ error: "Erro ao buscar turmas" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { nome, serie, turno, schoolId, subjectId } = body;

        if (!nome || !serie) {
            return NextResponse.json({ error: "Nome e série são obrigatórios" }, { status: 400 });
        }

        // If schoolId or subjectId are not provided, we try to find defaults for this user
        let sId = schoolId;
        let subId = subjectId;

        if (!sId || !subId) {
            const userProfile = await prisma.profile.findUnique({
                where: { userId: session.userId },
                include: { school: { include: { subjects: true } } }
            });

            if (!sId) sId = userProfile?.schoolId;
            if (!subId) subId = userProfile?.school?.subjects[0]?.id;
        }

        if (!sId || !subId) {
            return NextResponse.json({ error: "Escola ou Disciplina não encontradas" }, { status: 400 });
        }

        const newTurma = await TurmaService.create({
            nome,
            serie,
            turno: turno || "matutino",
            teacherId: session.userId,
            schoolId: sId,
            subjectId: subId
        });

        return NextResponse.json({ success: true, turma: newTurma });
    } catch (error) {
        console.error("Error creating turma:", error);
        return NextResponse.json({ error: "Erro ao criar turma" }, { status: 500 });
    }
}
