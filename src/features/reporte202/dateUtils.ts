import dayjs from "dayjs";

export function getDefaultCurrentQuarterRange() {
  const today = dayjs();
  const y = today.year();
  const m = today.month() + 1; // 1..12

  if (m <= 3) return { fechaIni: `${y}-01-01`, fechaFin: `${y}-03-31` }; // Q1
  if (m <= 6) return { fechaIni: `${y}-04-01`, fechaFin: `${y}-06-30` }; // Q2
  if (m <= 9) return { fechaIni: `${y}-07-01`, fechaFin: `${y}-09-30` }; // Q3
  return { fechaIni: `${y}-10-01`, fechaFin: `${y}-12-31` };             // Q4
}
