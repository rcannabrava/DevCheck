import type { ChecklistCategory } from "@/types";

export const CHECKLIST: readonly ChecklistCategory[] = [
  {
    id: "testing",
    name: "Testes Automatizados",
    description: "Confiança para lançar sem quebrar nada.",
    iso9126: "Confiabilidade",
    mpsbr: "VER — Verificação / VAL — Validação",
    questions: [
      {
        id: "tests-unit",
        text: "O projeto possui testes unitários?",
        tip: "Adicione testes unitários para utilitários e regras de negócio usando Vitest ou Jest.",
      },
      {
        id: "tests-integration",
        text: "Possui testes de integração?",
        tip: "Cubra fluxos críticos do usuário com testes de integração usando React Testing Library.",
      },
      {
        id: "tests-coverage",
        text: "A cobertura de testes está acima de 70%?",
        tip: "Configure relatório de cobertura e mire em pelo menos 70% nos caminhos críticos.",
      },
    ],
  },
  {
    id: "docs",
    name: "Documentação",
    description: "Outros engenheiros não deveriam precisar te perguntar.",
    iso9126: "Manutenibilidade",
    mpsbr: "GRH — Gerência de Recursos Humanos",
    questions: [
      {
        id: "docs-readme",
        text: "O projeto tem um README completo?",
        tip: "Escreva um README cobrindo propósito, instalação, uso, variáveis de ambiente e deploy.",
      },
      {
        id: "docs-inline",
        text: "Existe documentação inline no código?",
        tip: "Documente funções e módulos não óbvios com JSDoc / TSDoc conciso.",
      },
      {
        id: "docs-api",
        text: "Os endpoints da API estão documentados?",
        tip: "Gere ou mantenha uma referência OpenAPI/Markdown para cada endpoint público.",
      },
    ],
  },
  {
    id: "cicd",
    name: "CI/CD",
    description: "Entrega segura, repetível e automatizada.",
    iso9126: "Portabilidade",
    mpsbr: "GCO — Gerência de Configuração",
    questions: [
      {
        id: "ci-pipeline",
        text: "Existe um pipeline de CI configurado?",
        tip: "Adicione um workflow de CI que rode install, lint, typecheck e testes em cada PR.",
      },
      {
        id: "ci-environments",
        text: "Existem ambientes separados?",
        tip: "Separe desenvolvimento, staging e produção com configuração e dados isolados.",
      },
      {
        id: "ci-deploy",
        text: "O deploy é automatizado?",
        tip: "Dispare deploys a partir de pushes em main/tag — nunca faça deploy do laptop de um dev.",
      },
    ],
  },
  {
    id: "quality",
    name: "Qualidade de Código",
    description: "Código que o seu eu do futuro ainda consegue ler.",
    iso9126: "Manutenibilidade",
    mpsbr: "GQA — Garantia da Qualidade de Software",
    questions: [
      {
        id: "quality-linter",
        text: "Existe um linter configurado?",
        tip: "Configure ESLint (ou equivalente) e force seu uso no CI.",
      },
      {
        id: "quality-formatter",
        text: "Existe um formatador configurado?",
        tip: "Use Prettier (ou equivalente) para que formatação nunca seja pauta de code review.",
      },
      {
        id: "quality-dead",
        text: "Não há código morto ou duplicado?",
        tip: "Remova exports não usados e extraia lógica duplicada para helpers compartilhados.",
      },
      {
        id: "quality-naming",
        text: "Os nomes são descritivos?",
        tip: "Substitua x, data, temp por nomes que descrevam a intenção.",
      },
    ],
  },
  {
    id: "arch",
    name: "Arquitetura & Versionamento",
    description: "Um repositório que um novo dev consegue navegar no primeiro dia.",
    iso9126: "Manutenibilidade",
    mpsbr: "DES — Desenvolvimento",
    questions: [
      {
        id: "arch-structure",
        text: "O projeto está organizado de forma clara?",
        tip: "Agrupe por feature ou camada com uma estrutura de pastas previsível e documentada.",
      },
      {
        id: "arch-commits",
        text: "Os commits são descritivos e seguem convenções?",
        tip: "Adote Conventional Commits e mantenha cada commit focado em uma única mudança.",
      },
      {
        id: "arch-gitignore",
        text: "O .gitignore está configurado corretamente?",
        tip: "Ignore node_modules, saídas de build, arquivos .env e metadados de editor.",
      },
    ],
  },
] as const;

export const TOTAL_QUESTIONS = CHECKLIST.reduce(
  (sum, category) => sum + category.questions.length,
  0,
);
