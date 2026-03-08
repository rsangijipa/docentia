'use client';

import { AlertTriangle, Trash2, Info, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmActionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
};

export function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  variant = 'danger',
  onConfirm,
}: ConfirmActionDialogProps) {
  const Icon = variant === 'warning' ? AlertTriangle : variant === 'info' ? Info : Trash2;
  const iconColor = variant === 'warning' ? 'text-amber-500' : variant === 'info' ? 'text-blue-500' : 'text-rose-500';
  const iconBg = variant === 'warning' ? 'bg-amber-50' : variant === 'info' ? 'bg-blue-50' : 'bg-rose-50';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <div className="flex flex-col items-center pt-10 px-8 text-center space-y-4">
          <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shrink-0", iconBg)}>
            <Icon className={cn("w-8 h-8", iconColor)} />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl text-center">{title}</DialogTitle>
            <DialogDescription className="text-center">{description}</DialogDescription>
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="rounded-xl h-11 px-6">
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'destructive' : 'default'}
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "rounded-xl h-11 px-8 gap-2",
              variant === 'warning' && "bg-amber-500 hover:bg-amber-600 text-white",
              variant === 'info' && "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
