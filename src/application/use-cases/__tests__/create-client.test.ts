import { describe, it, expect, beforeEach } from 'vitest';
import { CreateClientUseCase } from '../create-client';
import { MockClientRepository } from '@/infrastructure/repositories/mock-client-repository';
import { DuplicatedEmailError } from '@/domain/errors/client-errors';

describe('CreateClientUseCase', () => {
  let useCase: CreateClientUseCase;
  let repository: MockClientRepository;

  beforeEach(() => {
    repository = new MockClientRepository();
    useCase = new CreateClientUseCase(repository);
  });

  it('should create client successfully', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'joao.novo@exemplo.com',
      phone: '11987654321',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('João Silva');
      expect(result.data.email.getValue()).toBe('joao.novo@exemplo.com');
      expect(result.data.phone?.getValue()).toBe('11987654321');
    }
  });

  it('should normalize email', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: '  JOAO.NOVO@EXEMPLO.COM  ',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email.getValue()).toBe('joao.novo@exemplo.com');
    }
  });

  it('should create client without phone', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'joao.semfone@exemplo.com',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.phone).toBeUndefined();
    }
  });

  it('should return error for duplicate email', async () => {
    const result = await useCase.execute({
      name: 'Outro João',
      email: 'joao@exemplo.com', // Email já existe no mock
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(DuplicatedEmailError);
    }
  });

  it('should return error for invalid email', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'email-invalido',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe('Formato de e-mail inválido');
    }
  });

  it('should return error for invalid phone', async () => {
    const result = await useCase.execute({
      name: 'João Silva',
      email: 'joao.telefone@exemplo.com',
      phone: '123', // Telefone muito curto
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toBe('Telefone deve ter 10 ou 11 dígitos');
    }
  });
});
