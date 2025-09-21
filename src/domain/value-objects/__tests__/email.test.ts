import { describe, it, expect } from 'vitest';
import { EmailVO } from '../email';

describe('EmailVO', () => {
  it('should create valid email', () => {
    const email = EmailVO.create('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should normalize email to lowercase', () => {
    const email = EmailVO.create('TEST@EXAMPLE.COM');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should trim whitespace', () => {
    const email = EmailVO.create('  test@example.com  ');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for empty email', () => {
    expect(() => EmailVO.create('')).toThrow('E-mail é obrigatório');
  });

  it('should throw error for invalid email format', () => {
    expect(() => EmailVO.create('invalid-email')).toThrow('Formato de e-mail inválido');
  });

  it('should check equality correctly', () => {
    const email1 = EmailVO.create('test@example.com');
    const email2 = EmailVO.create('test@example.com');
    const email3 = EmailVO.create('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
