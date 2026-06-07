import { CHECKLIST } from "@/constants/checklist";
import type {
  AnswerValue,
  CategoryScore,
  ChecklistAnswers,
  ImprovementTip,
  ScoreResult,
} from "@/types";

const POINTS: Record<AnswerValue, number> = {
  yes: 1,
  partial: 0.5,
  no: 0,
};

export function scoreAnswer(answer: AnswerValue | undefined): number {
  if (!answer) return 0;
  return POINTS[answer];
}

export function calculateScore(answers: ChecklistAnswers): ScoreResult {
  const byCategory: CategoryScore[] = CHECKLIST.map((category) => {
    const total = category.questions.length;
    let earned = 0;
    let answered = 0;

    for (const question of category.questions) {
      const answer = answers[question.id];
      if (answer) answered += 1;
      earned += scoreAnswer(answer);
    }

    const score = total === 0 ? 0 : Math.round((earned / total) * 100);
    return {
      categoryId: category.id,
      categoryName: category.name,
      score,
      answered,
      total,
    };
  });

  const overall =
    byCategory.length === 0
      ? 0
      : Math.round(byCategory.reduce((sum, entry) => sum + entry.score, 0) / byCategory.length);

  return { overall, byCategory };
}

export function scoreColor(score: number): "red" | "amber" | "green" {
  if (score <= 40) return "red";
  if (score <= 70) return "amber";
  return "green";
}

export function buildImprovementTips(answers: ChecklistAnswers): ImprovementTip[] {
  const tips: ImprovementTip[] = [];
  for (const category of CHECKLIST) {
    for (const question of category.questions) {
      const answer = answers[question.id];
      if (answer === "partial" || answer === "no") {
        tips.push({
          categoryName: category.name,
          questionText: question.text,
          tip: question.tip,
          severity: answer === "partial" ? "partial" : "missing",
        });
      }
    }
  }
  return tips;
}

export function buildDiagnosis(projectName: string, result: ScoreResult): string {
  const sorted = [...result.byCategory].sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2).filter((entry) => entry.score >= 60);
  const weaknesses = [...sorted]
    .reverse()
    .slice(0, 2)
    .filter((entry) => entry.score < 60);

  const name = projectName.trim() || "Este projeto";
  const overallLabel =
    result.overall >= 71
      ? "está em ótima forma para produção"
      : result.overall >= 41
        ? "está no caminho certo, mas ainda tem lacunas claras"
        : "ainda não está pronto para produção";

  const strengthsText = strengths.length
    ? ` Áreas mais fortes: ${strengths.map((entry) => entry.categoryName).join(" e ")}.`
    : "";
  const weaknessesText = weaknesses.length
    ? ` Foque a seguir em ${weaknesses.map((entry) => entry.categoryName).join(" e ")}.`
    : " Mantenha o nível alto em todas as categorias.";

  return `${name} ${overallLabel} com uma nota geral de ${result.overall}/100.${strengthsText}${weaknessesText}`;
}
