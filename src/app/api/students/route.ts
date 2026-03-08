import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth-service";
import { StudentService } from "@/services/studentService";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const turmaId = searchParams.get("turmaId");

    try {
        let students;
        if (turmaId) {
            students = await StudentService.getAllByTurma(turmaId);
        } else {
            students = await StudentService.getAllByTeacher(session.userId);
        }
        return NextResponse.json({ success: true, students });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ error: "Erro ao buscar alunos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { nome, matricula, turmaId, frequenciaGeral, desempenhoGeral, status, observacoes } = body;

        if (!nome || !matricula || !turmaId) {
            return NextResponse.json({ error: "Nome, matrícula e turmaId são obrigatórios" }, { status: 400 });
        }

        const newStudent = await StudentService.create({
            nome,
            matricula,
            turmaId,
            frequenciaGeral,
            desempenhoGeral,
            status,
            observacoes
        });

        return NextResponse.json({ success: true, student: newStudent });
    } catch (error) {
        console.error("Error creating student:", error);
        return NextResponse.json({ error: "Erro ao criar aluno" }, { status: 500 });
    }
}
