// src/features/reporte202/tableUtils.ts
import type { ColumnsType } from "antd/es/table";
import type { CanonicalRow, RawRow, ColSpec } from "./cicloConfig";
import { CICLO_CONFIG } from "./cicloConfig";

export function buildColumnsFromSpec(spec: ColSpec[]): ColumnsType<CanonicalRow> {
  return (spec ?? []).map(({ key, title, width, render }) => ({
    dataIndex: key as string,
    key: key as string,
    title: (title ?? (key as string)).toUpperCase(),
    ellipsis: true,
    width: width ?? 160,
    render,
  }));
}

/** Si no vas a usar columnas por ciclo, puedes borrar esta función.
 *  Si la mantienes, que sea tolerante a undefined: */
export function buildColumnsForCiclo(ciclo: number): ColumnsType<CanonicalRow> {
  const spec = (CICLO_CONFIG[ciclo]?.columns ?? []) as ColSpec[];
  return buildColumnsFromSpec(spec);
}

export function normalizeRowsByCiclo(rows: RawRow[], ciclo: number): CanonicalRow[] {
  const normalize = CICLO_CONFIG[ciclo]?.normalize;
  return normalize ? rows.map(normalize) : (rows as CanonicalRow[]);
}
