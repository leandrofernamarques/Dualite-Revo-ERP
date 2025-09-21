export class DuplicatedEmailError extends Error {
  constructor(email: string) {
    super(`E-mail ${email} já está em uso`);
    this.name = 'DuplicatedEmailError';
  }
}

export class ClientNotFoundError extends Error {
  constructor(id: string) {
    super(`Cliente com ID ${id} não foi encontrado`);
    this.name = 'ClientNotFoundError';
  }
}
