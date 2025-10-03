import dayjs from "dayjs";
import type { CanonicalRow, ColSpec } from "./cicloConfig";

/** Columnas comunes y estables para VISTA (no para export) */
export const COMMON_DISPLAY_COLS: ColSpec[] = [
  { key: "tipo_identificacion_usuario", title: "Tipo Doc" },
  { key: "numero_identificacion", title: "Documento" },

  // Nombre completo por render (usa distintas claves si vienen diferentes)
  {
    key: "primer_nombre_usuario",
    title: "Nombre completo",
    render: (_v: any, r: CanonicalRow) => {
      const pn = r.primer_nombre_usuario ?? r.nombres ?? "";
      const sn = r.segundo_nombre_usuario ?? r.segundo_nombre ?? "";
      const pa = r.primer_apellido_usuario ?? r.apellidos ?? "";
      const sa = r.segundo_apellido_usuario ?? r.segundo_apellido ?? "";
      return [pn, sn, pa, sa].filter(Boolean).join(" ");
    },
    width: 240,
  },

  { key: "sexo", title: "Sexo" },

  // Fecha nacimiento (como viene)
  { key: "fecha_nacimiento", title: "Fecha Nac." },

  // Edad calculada (si quieres mostrarla sin depender de un campo fijo)
  {
    key: "edad_calculada",
    title: "Edad (años)",
    render: (_: any, r: CanonicalRow) => {
      const fn = r.fecha_nacimiento;
      if (!fn) return "";
      const d = dayjs(fn);
      if (!d.isValid()) return "";
      const years = dayjs().diff(d, "year");
      return String(years);
    },
    width: 120,
  },

  // Algunas de uso frecuente
  {
    key: "fecha_consulta_valoracion_integral",
    title: "Fecha consulta",
    render: (v: any, r: CanonicalRow) => v ?? r.fecha_consulta ?? "",
  },
  {
    key: "peso_kg",
    title: "Peso (kg)",
    render: (v: any, r: CanonicalRow) => v ?? r.peso ?? "",
    width: 120,
  },
  {
    key: "talla_cm",
    title: "Talla (cm)",
    render: (v: any, r: CanonicalRow) => v ?? r.talla ?? r.talla_cm ?? r.tallacms ?? "",
    width: 120,
  },
];
