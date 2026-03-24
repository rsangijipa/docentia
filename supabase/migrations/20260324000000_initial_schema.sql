-- Initial Schema for Docentia Migration from Firebase

-- 1. Schools
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Profiles (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'TEACHER',
    school_id UUID REFERENCES public.schools(id),
    disciplina TEXT,
    escola_nome TEXT,
    biografia TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Textbooks
CREATE TABLE public.textbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    autor TEXT,
    materia TEXT,
    isbn TEXT,
    progresso_medio INTEGER DEFAULT 0,
    turmas UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Classrooms
CREATE TABLE public.classrooms (
...
-- 5. Students
CREATE TABLE public.students (
...
-- 6. Course Plans
CREATE TABLE public.course_plans (
...
-- 7. Projects
CREATE TABLE public.projects (
...
-- 8. Lesson Plans
CREATE TABLE public.lesson_plans (
...
-- 9. Diary Entries
CREATE TABLE public.diary_entries (
...
-- 10. Evaluations
CREATE TABLE public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    turma_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date DATE,
    weight FLOAT DEFAULT 1.0,
    max_grade FLOAT DEFAULT 10.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Calendar Events
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT,
    type TEXT NOT NULL, -- 'Atividade', 'Prova', 'Reunião', 'Feriado'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Results table
CREATE TABLE public.evaluation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    grade FLOAT NOT NULL,
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(evaluation_id, student_id)
);

-- 10. Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS (Row Level Security) - Basic Examples
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage their own classrooms" ON public.classrooms USING (auth.uid() = teacher_id);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teachers can manage their own students" ON public.students USING (auth.uid() = teacher_id);

-- 11. Templates
CREATE TABLE public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    categoria TEXT,
    tipo TEXT DEFAULT 'plano-de-aula',
    conteudo TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE POLICY "Teachers can manage their own course plans" ON public.course_plans USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage their own projects" ON public.projects USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage their own lesson plans" ON public.lesson_plans USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage their own diary entries" ON public.diary_entries USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage their own evaluations" ON public.evaluations USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can manage their own calendar events" ON public.calendar_events USING (auth.uid() = teacher_id OR (school_id IS NOT NULL AND auth.jwt() ->> 'school_id' = school_id::text));
CREATE POLICY "Teachers can view notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
