import { describe, it, expect } from 'vitest';
import { PhoneVO } from '../phone';

describe('PhoneVO', () => {
  it('should create valid phone with 11 digits', () => {
    const phone = PhoneVO.create('11987654321');
    expect(phone.getValue()).toBe('11987654321');
  });

  it('should create valid phone with 10 digits', () => {
    const phone = PhoneVO.create('1134567890');
    expect(phone.getValue()).toBe('1134567890');
  });

  it('should clean phone format', () => {
    const phone = PhoneVO.create('(11) 98765-4321');
    expect(phone.getValue()).toBe('11987654321');
  });

  it('should format phone correctly for 11 digits', () => {
    const phone = PhoneVO.create('11987654321');
    expect(phone.getFormatted()).toBe('(11) 98765-4321');
  });

  it('should format phone correctly for 10 digits', () => {
    const phone = PhoneVO.create('1134567890');
    expect(phone.getFormatted()).toBe('(11) 3456-7890');
  });

  it('should throw error for empty phone', () => {
    expect(() => PhoneVO.create('')).toThrow('Telefone é obrigatório');
  });

  it('should throw error for phone with less than 10 digits', () => {
    expect(() => PhoneVO.create('123456789')).toThrow('Telefone deve ter 10 ou 11 dígitos');
  });

  it('should throw error for phone with more than 11 digits', () => {
    expect(() => PhoneVO.create('123456789012')).toThrow('Telefone deve ter 10 ou 11 dígitos');
  });

  it('should check equality correctly', () => {
    const phone1 = PhoneVO.create('11987654321');
    const phone2 = PhoneVO.create('(11) 98765-4321');
    const phone3 = PhoneVO.create('11876543210');

    expect(phone1.equals(phone2)).toBe(true);
    expect(phone1.equals(phone3)).toBe(false);
  });
});
