import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth-service";
import { TurmaService } from "@/services/turmaService";

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
        await TurmaService.delete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting turma:", error);
        return NextResponse.json({ error: "Erro ao excluir turma" }, { status: 500 });
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
        const updated = await TurmaService.update(id, body);
        return NextResponse.json({ success: true, turma: updated });
    } catch (error) {
        console.error("Error updating turma:", error);
        return NextResponse.json({ error: "Erro ao atualizar turma" }, { status: 500 });
    }
}
