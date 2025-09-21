import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Client } from '@/domain/entities/client';
import { cleanPhone } from '@/lib/utils';

const clientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').trim(),
  email: z.string().email('E-mail inválido').trim(),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client;
  onSubmit: (data: ClientFormData) => Promise<void>;
  loading: boolean;
}

export function ClientForm({
  open,
  onOpenChange,
  client,
  onSubmit,
  loading,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email.getValue() || '',
      phone: client?.phone?.getValue() || '',
    },
  });

  React.useEffect(() => {
    if (client) {
      setValue('name', client.name);
      setValue('email', client.email.getValue());
      setValue('phone', client.phone?.getValue() || '');
    } else {
      reset();
    }
  }, [client, setValue, reset]);

  const handleFormSubmit = async (data: ClientFormData) => {
    try {
      // Clean phone number
      const cleanedData = {
        ...data,
        phone: data.phone ? cleanPhone(data.phone) : undefined,
      };
      
      await onSubmit(cleanedData);
      reset();
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and common phone formatting characters
    const formatted = value.replace(/[^\d\s()-]/g, '');
    e.target.value = formatted;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nome completo"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@exemplo.com"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="(11) 99999-9999"
              onChange={handlePhoneChange}
              disabled={loading}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : client ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
