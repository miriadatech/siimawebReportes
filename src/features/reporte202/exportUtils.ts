// src/features/reporte202/exportUtils.ts
import { RES202_FIELD_ORDER, RES202_LABELS, expandRowsToRes202 } from "./res202Schema";

export function exportRes202CSV(
  visibleRows: Record<string, any>[],
  ciclo?: number,
  filename = "reporte_202_full.csv"
) {
  const fullRows = expandRowsToRes202(visibleRows, ciclo);
  const headers = RES202_FIELD_ORDER.map((k) => RES202_LABELS[k] ?? k) as string[];

  const csvRows = [
    headers.join(","),
    ...fullRows.map((r) =>
      RES202_FIELD_ORDER
        .map((k) => {
          const v = r[k];
          if (v === null || v === undefined) return "";
          const s = String(v).replace(/"/g, '""');
          return /[",\n]/.test(s) ? `"${s}"` : s;
        })
        .join(",")
    ),
  ];

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
