import { z } from "zod";

export const authSessionSchema = z.object({
  idToken: z.string().min(1, "idToken is required"),
});

export const turmaCreateSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  serie: z.string().trim().min(1).max(60),
  turno: z.string().trim().min(1).max(30).optional(),
  schoolId: z.string().trim().optional(),
  subjectId: z.string().trim().optional(),
});

export const turmaPatchSchema = z.object({
  nome: z.string().trim().min(2).max(100).optional(),
  serie: z.string().trim().min(1).max(60).optional(),
  turno: z.string().trim().min(1).max(30).optional(),
});

export const studentCreateSchema = z.object({
  nome: z.string().trim().min(2).max(120),
  matricula: z.string().trim().min(2).max(50),
  turmaId: z.string().trim().min(1),
  frequenciaGeral: z.number().min(0).max(100).optional(),
  desempenhoGeral: z.number().min(0).max(10).optional(),
  status: z.string().trim().min(1).max(30).optional(),
  observacoes: z.string().trim().max(1000).optional(),
});

export const studentPatchSchema = z.object({
  nome: z.string().trim().min(2).max(120).optional(),
  matricula: z.string().trim().min(2).max(50).optional(),
  turmaId: z.string().trim().min(1).optional(),
  status: z.string().trim().min(1).max(30).optional(),
  observacoes: z.string().trim().max(1000).optional(),
});
