import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-7xl">404</h1>
        <h2 className="mt-4 text-xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          A página que você procura não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl">Esta página não carregou</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Algo deu errado do nosso lado. Você pode tentar recarregar ou voltar para o início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-text-inverse)] transition-colors hover:bg-[var(--color-accent-hover)]"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
          >
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "DevCheck" },
      {
        name: "description",
        content:
          "O DevCheck avalia projetos de software em testes, documentação, CI/CD, qualidade de código e arquitetura, com dicas acionáveis de melhoria.",
      },
      { property: "og:title", content: "DevCheck" },
      {
        property: "og:description",
        content:
          "Avalie, diagnostique e melhore qualquer projeto de software com base em boas práticas de engenharia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "DevCheck" },
      {
        name: "description",
        content:
          "O DevCheck avalia a qualidade de projetos de software, fornecendo notas e sugestões acionáveis de melhoria.",
      },
      {
        property: "og:description",
        content:
          "O DevCheck avalia a qualidade de projetos de software, fornecendo notas e sugestões acionáveis de melhoria.",
      },
      {
        name: "twitter:description",
        content:
          "O DevCheck avalia a qualidade de projetos de software, fornecendo notas e sugestões acionáveis de melhoria.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a96b7095-a261-4603-9c36-cdbd50a057f4/id-preview-69f0a209--9cf2ab2e-8ed8-4205-9982-606a77875517.lovable.app-1779825060774.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a96b7095-a261-4603-9c36-cdbd50a057f4/id-preview-69f0a209--9cf2ab2e-8ed8-4205-9982-606a77875517.lovable.app-1779825060774.png",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
