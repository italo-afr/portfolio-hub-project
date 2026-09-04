import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatMonth } from "./format";
import { SERIES } from "./series";

// Tokens em vez de hex: a grade branca a 6% ficava invisível no modo claro.
const AXIS = "var(--color-mist-600)";
const GRID = "var(--color-line-strong)";
const CURSOR = "var(--color-surface-2)";

/** Ordem de desenho das barras — a legenda segue a mesma. */
const ORDER = ["income", "expense"];

/** Eixo Y compacto: 6500 → "R$ 6,5 mil". */
const compact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-line bg-ink-800 px-3 py-2 shadow-xl">
      <p className="font-mono text-xs text-mist-500">{formatMonth(label)}</p>
      <ul className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <li key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-sm"
              style={{ background: entry.color }}
            />
            {/* O texto usa token de tinta; a cor da série fica no marcador. */}
            <span className="text-mist-500">{SERIES[entry.dataKey].label}</span>
            <span className="ml-auto font-medium text-mist-100">
              {formatCurrency(entry.value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FinanceChart({ months }) {
  if (!months?.length) {
    return (
      <p className="grid h-64 place-items-center rounded-lg border border-dashed border-line text-sm text-mist-600">
        Sem dados suficientes para o gráfico.
      </p>
    );
  }

  return (
    <figure className="w-full">
      {/*
        Legenda em HTML em vez do <Legend> do Recharts: o componente da lib
        reordenava as séries mesmo recebendo payload explícito, e legenda fora
        de ordem faz o olho trocar as barras.
      */}
      <figcaption className="mb-2 flex justify-end gap-4">
        {ORDER.map((key) => (
          <span
            key={key}
            className="flex items-center gap-1.5 text-xs text-mist-500"
          >
            <span
              aria-hidden="true"
              className="size-2.5 rounded-sm"
              style={{ background: SERIES[key].color }}
            />
            {SERIES[key].label}
          </span>
        ))}
      </figcaption>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={months}
            margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            barGap={2}
          >
            {/* Grade recessiva: só o suficiente para ancorar a leitura. */}
            <CartesianGrid
              vertical={false}
              stroke={GRID}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: AXIS, fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: GRID }}
            />
            <YAxis
              tickFormatter={(value) => compact.format(value)}
              tick={{ fill: AXIS, fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: CURSOR, fillOpacity: 0.6 }}
            />
            {/* Topo arredondado em 4px, ancorado na linha de base. */}
            <Bar
              dataKey="income"
              fill={SERIES.income.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="expense"
              fill={SERIES.expense.color}
              radius={[4, 4, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
