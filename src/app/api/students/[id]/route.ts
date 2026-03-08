import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-service";
import { StudentService } from "@/services/studentService";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const id = params.id;
        await StudentService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({ error: "Erro ao excluir aluno" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const id = params.id;
        const body = await request.json();
        const updated = await StudentService.update(id, body);
        return NextResponse.json({ success: true, student: updated });
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({ error: "Erro ao atualizar aluno" }, { status: 500 });
    }
}
