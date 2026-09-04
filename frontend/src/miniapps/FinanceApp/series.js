/**
 * Paleta das séries. Os valores vivem em src/index.css como tokens de tema
 * porque cada modo precisa do seu próprio passo — o verde escuro do modo
 * claro é ilegível sobre fundo preto e vice-versa.
 *
 * Ambos os pares foram validados com scripts/validate_palette.js da skill
 * dataviz, cada um contra a sua superfície:
 *   escuro (#0c0e12): #199e70 x #d95926 — ΔE 9.4 deutan · 26.5 normal
 *   claro  (#f8fafc): #0f8f61 x #c2490f — ΔE 8.8 deutan · 25.4 normal
 *
 * Verde x laranja, e não verde x vermelho: o par verde/vermelho reprova na
 * separação para deuteranopia (ΔE 5.8), o daltonismo mais comum.
 */
export const SERIES = {
  income: { color: 'var(--color-series-income)', label: 'Receita' },
  expense: { color: 'var(--color-series-expense)', label: 'Despesa' },
}
