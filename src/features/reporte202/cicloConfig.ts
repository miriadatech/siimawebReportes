// src/features/reporte202/cicloConfig.ts
import type React from "react";

/** Fila cruda del backend (flexible) */
export type RawRow = Record<string, any>;

/** Fila canónica para la UI */
export type CanonicalRow = {
  tipo_identificacion_usuario?: string;
  numero_identificacion?: string;
  primer_nombre_usuario?: string;
  segundo_nombre_usuario?: string;
  primer_apellido_usuario?: string;
  segundo_apellido_usuario?: string;
  nombres?: string;
  segundo_nombre?: string;
  apellidos?: string;
  segundo_apellido?: string;
  sexo?: string;
  fecha_nacimiento?: string;
  fecha_consulta?: string;
  fecha_consulta_valoracion_integral?: string;
  peso_kg?: number | string;
  peso?: number | string;
  talla_cm?: number | string;
  talla?: number | string;
  tallacms?: number | string;
} & Record<string, any>;

export type ColSpec = {
  key: keyof CanonicalRow | string;
  title?: string;
  width?: number;
  render?: (value: any, row: CanonicalRow, index: number) => React.ReactNode;
};

/** 👈 Añade columns como opcional */
export type CicloConfig = {
  columns?: ColSpec[];                      // opcional: columnas si algún día quieres por ciclo
  normalize?: (row: RawRow) => CanonicalRow;
};

export const CICLO_CONFIG: Record<number, CicloConfig> = {
  1: {
    normalize: (r) => ({
      ...r,
      peso_kg: r.peso_kg ?? r.peso,
      talla_cm: r.talla_cm ?? r.talla ?? r.tallacms,
    }),
  },
  2: {
    normalize: (r) => ({
      ...r,
      peso_kg: r.peso_kg ?? r.peso,
      talla_cm: r.talla_cm ?? r.talla ?? r.tallacms,
    }),
  },
  // ...otros ciclos si los necesitas
};
