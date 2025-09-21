# ERP Moderno - CRUD de Clientes

Sistema ERP moderno e simples para PMEs, com foco em gestão de clientes sem fricção.

## 🎯 Features Implementadas

- ✅ CRUD completo de clientes
- ✅ Busca com debounce (300ms)
- ✅ Paginação (20 itens por página)
- ✅ Validação de dados com Zod
- ✅ Interface glassmorphism (macOS-like)
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ Dark/Light mode support
- ✅ Feature flags
- ✅ Testes unitários
- ✅ Arquitetura limpa (Domain/Application/Infrastructure/Interface)

## 🚀 Como Executar

```bash
# Instalar dependências
yarn install

# Executar em modo desenvolvimento
yarn dev

# Executar testes
yarn test

# Type checking
yarn typecheck

# Linting
yarn lint
```

## 🔧 Tecnologias Utilizadas

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Tables**: TanStack Table
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library

## 📁 Estrutura do Projeto

```
src/
├── components/         # Componentes UI
├── domain/            # Entidades, VOs, contratos
├── application/       # Casos de uso
├── infrastructure/    # Repositórios, adaptadores
├── features/          # Feature flags
├── lib/              # Utilitários
└── pages/            # Páginas da aplicação
```

## 🎨 Design System

- **Glassmorphism**: Efeitos de vidro com backdrop-blur
- **Cores**: Sistema de design tokens
- **Tipografia**: Hierarquia clara e legível
- **Espaçamento**: Grid system consistente
- **Animações**: Transições suaves (120-150ms)

## 🧪 Testes

```bash
# Executar todos os testes
yarn test

# Executar em modo watch
yarn test --watch

# Coverage
yarn test --coverage
```

## 🚩 Feature Flags

- `feature.clients`: Habilita/desabilita funcionalidade de clientes

## 📝 Demo

1. Abra a aplicação
2. Visualize a lista de clientes (dados mockados)
3. Crie um novo cliente
4. Edite um cliente existente
5. Busque por nome ou email
6. Delete um cliente (soft delete)

## 🔮 Próximos Passos

Para continuar o desenvolvimento:

1. **Conectar Supabase**: Para persistência real dos dados
2. **Autenticação**: Sistema de login/registro
3. **Outros CRUDs**: Fornecedores, produtos, serviços
4. **Relatórios**: Dashboard com métricas
5. **Deploy**: Publicar no Netlify

## 🎯 Critérios de Qualidade (DoD)

- ✅ TypeScript sem erros
- ✅ ESLint/Prettier configurados
- ✅ 1+ teste unitário por caso de uso
- ✅ Acessibilidade básica (foco visível, contraste AA)
- ✅ Feature flag implementada
- ✅ README com instruções
- ✅ Componentes modulares e reutilizáveis
- ✅ Tratamento de erros consistente
- ✅ Interface responsiva
