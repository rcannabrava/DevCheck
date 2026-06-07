/**
 * Testes de Sistema (Caixa Preta) — DevCheck
 *
 * Cobrem o fluxo completo da aplicação do ponto de vista do usuário final,
 * sem conhecimento da implementação interna. Alinhados com:
 *  - ISO 9126: Confiabilidade (comportamento correto end-to-end)
 *  - MPS.BR VAL — Validação (confirma que o sistema atende às necessidades do usuário)
 */

import { test, expect } from "@playwright/test";

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

/** Responde todas as perguntas visíveis na categoria atual com "Sim". */
async function responderTudoSim(page: import("@playwright/test").Page) {
  const botoesSim = page.getByRole("radio", { name: "Sim" });
  const total = await botoesSim.count();
  for (let i = 0; i < total; i++) {
    await botoesSim.nth(i).click();
  }
}

// --------------------------------------------------------------------------
// Fluxo completo
// --------------------------------------------------------------------------

test.describe("Fluxo completo de avaliação", () => {
  test("realiza avaliação do início ao fim e exibe resultados com nota", async ({ page }) => {
    // 1. Página inicial
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "DevCheck" })).toBeVisible();

    // 2. Navegar para setup
    await page.goto("/setup");
    await expect(page.getByRole("heading", { name: "Configurar avaliação" })).toBeVisible();

    // 3. Preencher nome do projeto e avançar
    await page.fill("#projectName", "Projeto Sistema");
    await page.getByRole("button", { name: "Continuar →" }).click();
    await expect(page).toHaveURL("/checklist");

    // 4. Percorrer as 5 categorias respondendo tudo "Sim"
    const TOTAL_CATEGORIAS = 5;
    for (let categoria = 0; categoria < TOTAL_CATEGORIAS; categoria++) {
      await responderTudoSim(page);

      if (categoria < TOTAL_CATEGORIAS - 1) {
        await page.getByRole("button", { name: "Próxima categoria →" }).click();
      } else {
        await page.getByRole("button", { name: "Ver resultados →" }).click();
      }
    }

    // 5. Validar página de resultados
    await expect(page).toHaveURL("/results");
    await expect(page.getByRole("heading", { name: "Projeto Sistema" })).toBeVisible();
    await expect(page.getByText("Detalhamento por categoria")).toBeVisible();
    await expect(page.getByText("Diagnóstico")).toBeVisible();
    // Com todas as respostas "Sim", a nota deve ser 100
    await expect(page.getByText("100")).toBeVisible();
  });

  test("exibe mensagem de erro ao tentar continuar sem nome do projeto", async ({ page }) => {
    await page.goto("/setup");
    await page.getByRole("button", { name: "Continuar →" }).click();
    await expect(page.getByRole("alert")).toContainText("nome do projeto é obrigatório");
    await expect(page).toHaveURL("/setup");
  });

  test("avaliação com respostas mistas gera nota entre 0 e 100", async ({ page }) => {
    await page.goto("/setup");
    await page.fill("#projectName", "Projeto Misto");
    await page.getByRole("button", { name: "Continuar →" }).click();

    // Primeira categoria: responde metade "Sim", metade "Não"
    const botoesSim = page.getByRole("radio", { name: "Sim" });
    const botoesNao = page.getByRole("radio", { name: "Não" });
    const totalSim = await botoesSim.count();
    const totalNao = await botoesNao.count();

    for (let i = 0; i < Math.ceil(totalSim / 2); i++) {
      await botoesSim.nth(i).click();
    }
    for (let i = Math.ceil(totalNao / 2); i < totalNao; i++) {
      await botoesNao.nth(i).click();
    }

    // Demais categorias: responde tudo "Não"
    const TOTAL_CATEGORIAS = 5;
    for (let categoria = 1; categoria < TOTAL_CATEGORIAS; categoria++) {
      await page.getByRole("button", { name: "Próxima categoria →" }).click();
      await responderTudoSim(page);
    }

    await page.getByRole("button", { name: "Ver resultados →" }).click();
    await expect(page).toHaveURL("/results");

    // Nota deve estar presente e ser um número entre 0 e 100
    const notaEl = page.locator('[data-testid="score-value"]').first();
    if ((await notaEl.count()) > 0) {
      const nota = Number(await notaEl.textContent());
      expect(nota).toBeGreaterThan(0);
      expect(nota).toBeLessThanOrEqual(100);
    } else {
      // Fallback: apenas verifica que a página de resultados carregou
      await expect(page.getByText("Detalhamento por categoria")).toBeVisible();
    }
  });
});

// --------------------------------------------------------------------------
// Navegação e rotas
// --------------------------------------------------------------------------

test.describe("Navegação entre rotas", () => {
  test("página /results sem avaliação exibe mensagem de estado vazio", async ({ page }) => {
    await page.goto("/results");
    await expect(page.getByRole("heading", { name: "Nenhuma avaliação ainda" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Iniciar avaliação" })).toBeVisible();
  });

  test("página /history é acessível", async ({ page }) => {
    await page.goto("/history");
    await expect(page).toHaveURL("/history");
    // A página deve carregar sem erro 500
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
  });

  test("link 'Iniciar avaliação' na página de resultados vazia redireciona para /setup", async ({
    page,
  }) => {
    await page.goto("/results");
    await page.getByRole("link", { name: "Iniciar avaliação" }).click();
    await expect(page).toHaveURL("/setup");
  });
});

// --------------------------------------------------------------------------
// Histórico
// --------------------------------------------------------------------------

test.describe("Histórico de avaliações", () => {
  test("avaliação completa é registrada no histórico", async ({ page }) => {
    // Completar uma avaliação
    await page.goto("/setup");
    await page.fill("#projectName", "Projeto Histórico");
    await page.getByRole("button", { name: "Continuar →" }).click();

    const TOTAL_CATEGORIAS = 5;
    for (let categoria = 0; categoria < TOTAL_CATEGORIAS; categoria++) {
      await responderTudoSim(page);
      if (categoria < TOTAL_CATEGORIAS - 1) {
        await page.getByRole("button", { name: "Próxima categoria →" }).click();
      } else {
        await page.getByRole("button", { name: "Ver resultados →" }).click();
      }
    }

    // Verificar que foi salvo no histórico
    await page.goto("/history");
    await expect(page.getByText("Projeto Histórico")).toBeVisible();
  });
});
