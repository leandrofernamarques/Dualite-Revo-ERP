export class PhoneVO {
  private constructor(private readonly value: string) {}

  static create(phone: string): PhoneVO {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!cleaned) {
      throw new Error('Telefone é obrigatório');
    }
    
    if (cleaned.length < 10 || cleaned.length > 11) {
      throw new Error('Telefone deve ter 10 ou 11 dígitos');
    }
    
    return new PhoneVO(cleaned);
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    if (this.value.length === 11) {
      return `(${this.value.slice(0, 2)}) ${this.value.slice(2, 7)}-${this.value.slice(7)}`;
    }
    
    if (this.value.length === 10) {
      return `(${this.value.slice(0, 2)}) ${this.value.slice(2, 6)}-${this.value.slice(6)}`;
    }
    
    return this.value;
  }

  equals(other: PhoneVO): boolean {
    return this.value === other.value;
  }
}
