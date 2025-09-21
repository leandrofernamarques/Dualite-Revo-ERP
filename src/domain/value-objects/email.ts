export class EmailVO {
  private constructor(private readonly value: string) {}

  static create(email: string): EmailVO {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail) {
      throw new Error('E-mail é obrigatório');
    }
    
    // RFC 5322 básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error('Formato de e-mail inválido');
    }
    
    return new EmailVO(trimmedEmail);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailVO): boolean {
    return this.value === other.value;
  }
}
