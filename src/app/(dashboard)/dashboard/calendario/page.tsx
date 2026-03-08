'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface Evento {
  id: number;
  titulo: string;
  tipo: string;
  data: string;
  horario?: string;
}

const eventColors: Record<string, string> = {
  'Prova': 'bg-rose-100 text-rose-700 border-rose-200',
  'Reunião': 'bg-blue-100 text-blue-700 border-blue-200',
  'Feriado': 'bg-muted text-muted-foreground border-border',
  'Atividade': 'bg-violet-100 text-violet-700 border-violet-200',
};

const initEventos: Evento[] = [
  { id: 1, titulo: 'Prova de Matemática 6ºA', tipo: 'Prova', data: '2026-03-10', horario: '08:00' },
  { id: 2, titulo: 'Conselho de Classe', tipo: 'Reunião', data: '2026-03-12', horario: '14:00' },
  { id: 3, titulo: 'Feriado Nacional', tipo: 'Feriado', data: '2026-03-17' },
];

export default function CalendarioPage() {
  const now = new Date(2026, 2, 7);
  const [current, setCurrent] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [eventos, setEventos] = useState<Evento[]>(initEventos);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ titulo: '', tipo: 'Atividade', data: '', horario: '' });

  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return eventos.filter(e => e.data === date);
  };

  const handleCreate = () => {
    if (!form.titulo || !form.data) { toast.error('Informe o título e a data.'); return; }
    setEventos(prev => [...prev, { id: Date.now(), ...form }]);
    setForm({ titulo: '', tipo: 'Atividade', data: '', horario: '' });
    setOpen(false);
    toast.success('Evento criado!');
  };

  const upcoming = eventos
    .filter(e => new Date(e.data) >= now)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">Calendário Pedagógico</h1>
          <p className="text-muted-foreground mt-1 text-sm">Provas, reuniões, feriados e atividades do ano letivo.</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-primary hover:bg-primary/90 gap-2 shadow-sm w-full sm:w-auto">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
            <button onClick={prev} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <h2 className="font-serif font-bold text-foreground">{MONTHS[month]} {year}</h2>
            <button onClick={next} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-border/50">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[70px] border-b border-r border-border/30 bg-muted/10" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = year === now.getFullYear() && month === now.getMonth() && day === now.getDate();
              const dayEvents = getEventsForDay(day);
              const col = (firstDay + i) % 7;
              return (
                <div
                  key={day}
                  className={`min-h-[70px] border-b border-r border-border/30 p-1.5 ${isToday ? 'bg-primary/5' : 'hover:bg-muted/20'} ${col === 0 || col === 6 ? 'bg-muted/10' : ''} transition-colors`}
                >
                  <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold mb-1 ${isToday ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map(ev => (
                      <div key={ev.id} className={`text-[10px] px-1.5 py-0.5 rounded font-medium truncate border ${eventColors[ev.tipo] ?? 'bg-muted text-muted-foreground border-border'}`}>
                        {ev.titulo}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 2} mais</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50">
            <h3 className="font-serif font-semibold text-foreground">Próximos Eventos</h3>
            <p className="text-xs text-muted-foreground mt-0.5">A partir de hoje</p>
          </div>
          <div className="divide-y divide-border/40 p-2">
            {upcoming.length > 0 ? upcoming.map(ev => {
              const d = new Date(ev.data + 'T00:00:00');
              return (
                <div key={ev.id} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-muted flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{MONTHS[d.getMonth()].slice(0, 3)}</span>
                    <span className="text-base font-bold text-foreground leading-none">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{ev.titulo}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold border ${eventColors[ev.tipo] ?? 'bg-muted text-muted-foreground border-border'}`}>{ev.tipo}</span>
                      {ev.horario && (
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {ev.horario}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="px-3 py-12 text-center text-sm text-muted-foreground">
                Nenhum evento próximo
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Event Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Novo Evento</DialogTitle>
            <DialogDescription>Adicione provas, reuniões, feriados ou atividades.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label>Título <span className="text-destructive">*</span></Label>
              <Input placeholder="Ex: Prova de Matemática" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Tipo</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  value={form.tipo}
                  onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}
                >
                  {['Prova', 'Reunião', 'Feriado', 'Atividade'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label>Horário</Label>
                <Input type="time" value={form.horario} onChange={e => setForm(p => ({ ...p, horario: e.target.value }))} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Data <span className="text-destructive">*</span></Label>
              <Input type="date" value={form.data} onChange={e => setForm(p => ({ ...p, data: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">Criar Evento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
