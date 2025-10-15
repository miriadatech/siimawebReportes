import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  Table,
  Space,
  message,
  Typography,
  Tooltip,
  Empty,
  Form,
  DatePicker,
  Tag,
  Divider
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SearchOutlined,
  FilterOutlined
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import ExcelJS from "exceljs";

const { Title, Text } = Typography;

/* =========================
   Tipos
   ========================= */
interface ReportRow {
  _Row?: string; // clave interna única
  consulta_id?: number;
  afiliados_id?: number;
  VAR0_TipoRegistro?: string;
  VAR1_ConseRegistro?: string;
  VAR2_IPSprimaria?: string;  VAR3_TipoDocumento?: string;  VAR4_NumeroDocumento?: string;  VAR5_PrimerApellido?: string;  VAR6_SegundoApellido?: string;
  VAR7_PrimerNombre?: string;  VAR8_SegundoNombre?: string;  VAR9_FechaNacimeinto?: string;  VAR10_Sexo?: string;  VAR11_PerEtnica?: string;
  VAR12_Ocupacion?: string; VAR13_NivelEducativo?: string; VAR14_Gestacion?: string; VAR15_SifilisGestacional?: string; VAR16_PruebaMiniMental?: string;

  VAR17_HipotiroidismoCongenito?: string; VAR18_Sintomatico_Respi?: string; VAR19_ConsumoTabaco?: string; VAR20_Lepra?: string; 
  VAR21_ObesidadODesnutricion?: string;
  VAR22_ResultadoTactoRectal?: string; VAR23_AcidoFolicoPreconcepcional?: string; VAR24_SangreOcultaEnMateriaFecal?: string; 
  VAR25_EnfermedadMental?: string; VAR26_CancerDeCervix?: string;
  VAR27_AgudezaVisualLejanaOjoIzquierdo?: string; VAR28_AgudezaVisualLejanaOjoDerecho?: string; 
  VAR29_FechaDelPeso?: string; VAR30_PesoEnKilogramos?: string; VAR31_FechaDeLaTalla?: string;
  VAR32_TallaEnCentimetros?: string; VAR33_FechaProbableDeParto?: string; VAR34_CodigoPais?: string; VAR35_Clasificacion_Del_RiesgoGestacional?: string; 
  VAR36_ResultadoDeColonoscopiaTamizaje?: string;
  VAR37_ResultadoDeColonoscopiaTamizaje?: string; VAR38_ResultadoDeTamizajeVisualNeonatal?: string; VAR39_DPTMenoresDe5Anhos?: string; 
  VAR40_ResultadoDeTamizajeVale?: string; VAR41_Neumococo?: string;
  VAR42_ResultadoDeTamizajeParaHepatitisC?: string; VAR43_MotricidadGruesa?: string; VAR44_MotricidadFinoadaptativa?: string; 
  VAR45_EscalaAbreviadaDeDesarrolloAreaPersonalSocial?: string; VAR46_ResultadoDeEscalaAbreviadaDesarrolloAreaDeMotricidadAudicionLenguaje?: string;
  VAR47_CrioterapiaOLetz?: string; VAR48_ResultadoDeTamizacionConOximetriaPreyPostDuctal?: string; 
  VAR49_FechaAtencionPartoOCesarea?: string; VAR50_FechaSalidaDeLaAtencionndelPartoOCesarea?: string; 
  VAR51_FechaDeAtencionEnSaludParaLaPromocionYApoyoDeLaLactanciaMaterna?: string;
  VAR52_FechaDeConsultaDeValoracionIntegral?: string; VAR53_FechaDeAtencionEnSaludParaLaAsesoriaEnAnticoncepción?: string; 
  VAR54_SuministroDeMetodoAnticonceptivo?: string; VAR55_FechaDeSuministroDeMetodoAnticonceptivo?: string; 
  VAR56_FechaDePrimeraConsultaPrenatal?: string;
  VAR57_ResultadoDeGlicemiaBasal?: string; VAR58_FechaDeUltimoControlPrenatalDeSeguimiento?: string; 
  VAR59_SuministroDeAcidoFolicoEnElControlPrenatal?: string; VAR60_SuministroDeSulfatoFerrosoEnElControlPrenatal?: string; 
  VAR61_SuministroDeCarbonatoDeCalcioEnElControlPrenatal?: string;
  VAR62_FechaDeValoracionAgudezaVisual?: string; VAR63_FechaDeTamizajeVale?: string; 
  VAR64_FechaDelTactoRectal?: string; VAR65_FechaDeTamizacionConOximetriaPreyPostDuctal?: string; 
  VAR66_FechaDeRealizacionColonoscopiaTamizaje?: string;
  VAR67_FechaDeLaPruebaSangreOcultaEnMateriaFecal?: string; VAR68_ConsultaDePsicologia?: string; 
  VAR69_FechaDeTamizajeAuditivoNeonatal?: string; VAR70_SuministroDeFortificacionCasera?: string; 
  VAR71_SuministroDeVitaminaAEnLaPrimeraInfancia?: string;
  VAR72_Fecha_DeTomaLDL?: string; VAR73_FechaDeTomaPSA?: string; VAR74_PreservativosEntregadosAPacientesConITS?: string; 
  VAR75_FechaDeTamizajeVisualNeonatal?: string; VAR76_FechaDeAtencionEnSaludBucalPorProfesionalEnOdontologia?: string;
  VAR77_SuministroDeHierroEnLaPrimeraInfancia?: string; VAR78_FechaDeAntigenoDeSuperficieHepatitisB?: string; 
  VAR79_ResultadoDeAntigenoDeSuperficieHepatitisB?: string; VAR80_FechaDeTomaDePruebaTamizajeParaSifilis?: string; 
  VAR81_ResultadoDePruebaTamizajeParaSifilis?: string;
  VAR82_FechaDeTomaPruebaParaVIH?: string; VAR83_ResultadoDePruebaParaVIH?: string; 
  VAR84_FechaTSHNeonatal?: string; VAR85_ResultadoDeTSHNeonatal?: string; VAR86_TamizajeDelCancerDeCuelloUterino?: string;
  VAR87_FechaDeTamizajeCancerDeCuelloUterino?: string; VAR88_ResultadoTamizajeCancerDeCuelloUterino?: string; 
  VAR89_CalidadEnLaMuestraDeCitologiaCervicouterina?: string; VAR90_CodigoDeHabilitacionIPSDondeSeRealizaTamizajeCancerDeCuelloUterino?: string; 
  VAR91_FechaDeColposcopia?: string;
  VAR92_ResultadoDeLDL?: string; VAR93_FechaDeBiopsiaCervicouterina?: string; VAR94_ResultadoDeBiopsiaCervicouterina?: string; 
  VAR95_ResultadoDeHDL?: string; VAR96_FechaMamografia?: string;
  VAR97_ResultadoMamografia?: string; VAR98_ResultadoDeTrigliceridos?: string; 
  VAR99_FechaDeTomaBiopsiaDeMama?: string; VAR100_FechaDeResultadoBiopsiaDeMama?: string; VAR101_ResultadoDeBiopsiaDeMama?: string;
  VAR102_COPporPersona?: string; VAR103_FechaDeTomaHemoglobina?: string; VAR104_ResultadoDeHemoglobina?: string; 
  VAR105_FechaDeTomaGlicemiaBasal?: string; VAR106_FechaDeTomaCreatinina?: string;
  VAR107_ResultadoDeCreatinina?: string; VAR108_FechaHemoglobinaGlicosilada?: string; 
  VAR109_ResultadoDePSA?: string; VAR110_FechaDeTomaDeTamizajeHepatitisC?: string; VAR111_FechaDeTomaHDL?: string;
  VAR112_FechaDeTomaDeBaciloscopiaDiagnostico?: string; VAR113_ResultadoDeBaciloscopiaDiagnostico?: string; 
  VAR114_ClasificacionDelRiesgoCardiovascular?: string; VAR115_TratamientoParaSifilisGestacional?: string; 
  VAR116_TratamientoParaSifilisCongenita?: string;
  VAR117_ClasificacionDelRiesgoMetabolico?: string; VAR118_FechaDeTomaTrigliceridos?: string;

  // Metacampos internos (para ordenar/exportar)
  __entidadId?: number;
  __entidadLabel?: string;
  __cicloId?: number;
  __cicloNombre?: string;
}

interface Entidad { id: number; nombre: string; codigo?: string; }
interface CicloDeVida { id: number; nombre: string; edadMinAnios: number | null; edadMaxAnios: number | null; }

interface Reporte202Props {
  apiBaseUrl: string;
  token?: string | null;
}

/* =========================
   Orden fijo de columnas
   ========================= */
const FIELD_ORDER: (keyof ReportRow)[] = [
  "VAR0_TipoRegistro","VAR1_ConseRegistro","VAR2_IPSprimaria","VAR3_TipoDocumento","VAR4_NumeroDocumento",
  "VAR5_PrimerApellido","VAR6_SegundoApellido","VAR7_PrimerNombre","VAR8_SegundoNombre","VAR9_FechaNacimeinto",
  "VAR10_Sexo","VAR11_PerEtnica","VAR12_Ocupacion","VAR13_NivelEducativo","VAR14_Gestacion","VAR15_SifilisGestacional","VAR16_PruebaMiniMental",
  "VAR17_HipotiroidismoCongenito","VAR18_Sintomatico_Respi","VAR19_ConsumoTabaco","VAR20_Lepra","VAR21_ObesidadODesnutricion",
  "VAR22_ResultadoTactoRectal","VAR23_AcidoFolicoPreconcepcional","VAR24_SangreOcultaEnMateriaFecal","VAR25_EnfermedadMental","VAR26_CancerDeCervix",
  "VAR27_AgudezaVisualLejanaOjoIzquierdo","VAR28_AgudezaVisualLejanaOjoDerecho","VAR29_FechaDelPeso","VAR30_PesoEnKilogramos","VAR31_FechaDeLaTalla",
  "VAR32_TallaEnCentimetros","VAR33_FechaProbableDeParto","VAR34_CodigoPais","VAR35_Clasificacion_Del_RiesgoGestacional","VAR36_ResultadoDeColonoscopiaTamizaje",
  "VAR37_ResultadoDeColonoscopiaTamizaje","VAR38_ResultadoDeTamizajeVisualNeonatal","VAR39_DPTMenoresDe5Anhos","VAR40_ResultadoDeTamizajeVale","VAR41_Neumococo",
  "VAR42_ResultadoDeTamizajeParaHepatitisC","VAR43_MotricidadGruesa","VAR44_MotricidadFinoadaptativa","VAR45_EscalaAbreviadaDeDesarrolloAreaPersonalSocial","VAR46_ResultadoDeEscalaAbreviadaDesarrolloAreaDeMotricidadAudicionLenguaje",
  "VAR47_CrioterapiaOLetz","VAR48_ResultadoDeTamizacionConOximetriaPreyPostDuctal","VAR49_FechaAtencionPartoOCesarea","VAR50_FechaSalidaDeLaAtencionndelPartoOCesarea","VAR51_FechaDeAtencionEnSaludParaLaPromocionYApoyoDeLaLactanciaMaterna",
  "VAR52_FechaDeConsultaDeValoracionIntegral","VAR53_FechaDeAtencionEnSaludParaLaAsesoriaEnAnticoncepción","VAR54_SuministroDeMetodoAnticonceptivo","VAR55_FechaDeSuministroDeMetodoAnticonceptivo","VAR56_FechaDePrimeraConsultaPrenatal",
  "VAR57_ResultadoDeGlicemiaBasal","VAR58_FechaDeUltimoControlPrenatalDeSeguimiento","VAR59_SuministroDeAcidoFolicoEnElControlPrenatal","VAR60_SuministroDeSulfatoFerrosoEnElControlPrenatal","VAR61_SuministroDeCarbonatoDeCalcioEnElControlPrenatal",
  "VAR62_FechaDeValoracionAgudezaVisual","VAR63_FechaDeTamizajeVale","VAR64_FechaDelTactoRectal","VAR65_FechaDeTamizacionConOximetriaPreyPostDuctal","VAR66_FechaDeRealizacionColonoscopiaTamizaje",
  "VAR67_FechaDeLaPruebaSangreOcultaEnMateriaFecal","VAR68_ConsultaDePsicologia","VAR69_FechaDeTamizajeAuditivoNeonatal","VAR70_SuministroDeFortificacionCasera","VAR71_SuministroDeVitaminaAEnLaPrimeraInfancia",
  "VAR72_Fecha_DeTomaLDL","VAR73_FechaDeTomaPSA","VAR74_PreservativosEntregadosAPacientesConITS","VAR75_FechaDeTamizajeVisualNeonatal","VAR76_FechaDeAtencionEnSaludBucalPorProfesionalEnOdontologia",
  "VAR77_SuministroDeHierroEnLaPrimeraInfancia","VAR78_FechaDeAntigenoDeSuperficieHepatitisB","VAR79_ResultadoDeAntigenoDeSuperficieHepatitisB","VAR80_FechaDeTomaDePruebaTamizajeParaSifilis","VAR81_ResultadoDePruebaTamizajeParaSifilis",
  "VAR82_FechaDeTomaPruebaParaVIH","VAR83_ResultadoDePruebaParaVIH","VAR84_FechaTSHNeonatal","VAR85_ResultadoDeTSHNeonatal","VAR86_TamizajeDelCancerDeCuelloUterino",
  "VAR87_FechaDeTamizajeCancerDeCuelloUterino","VAR88_ResultadoTamizajeCancerDeCuelloUterino","VAR89_CalidadEnLaMuestraDeCitologiaCervicouterina","VAR90_CodigoDeHabilitacionIPSDondeSeRealizaTamizajeCancerDeCuelloUterino","VAR91_FechaDeColposcopia",
  "VAR92_ResultadoDeLDL","VAR93_FechaDeBiopsiaCervicouterina","VAR94_ResultadoDeBiopsiaCervicouterina","VAR95_ResultadoDeHDL","VAR96_FechaMamografia",
  "VAR97_ResultadoMamografia","VAR98_ResultadoDeTrigliceridos","VAR99_FechaDeTomaBiopsiaDeMama","VAR100_FechaDeResultadoBiopsiaDeMama","VAR101_ResultadoDeBiopsiaDeMama",
  "VAR102_COPporPersona","VAR103_FechaDeTomaHemoglobina","VAR104_ResultadoDeHemoglobina","VAR105_FechaDeTomaGlicemiaBasal","VAR106_FechaDeTomaCreatinina",
  "VAR107_ResultadoDeCreatinina","VAR108_FechaHemoglobinaGlicosilada","VAR109_ResultadoDePSA","VAR110_FechaDeTomaDeTamizajeHepatitisC","VAR111_FechaDeTomaHDL",
  "VAR112_FechaDeTomaDeBaciloscopiaDiagnostico","VAR113_ResultadoDeBaciloscopiaDiagnostico","VAR114_ClasificacionDelRiesgoCardiovascular","VAR115_TratamientoParaSifilisGestacional","VAR116_TratamientoParaSifilisCongenita",
  "VAR117_ClasificacionDelRiesgoMetabolico","VAR118_FechaDeTomaTrigliceridos",
];

/* =========================
   Utilidades
   ========================= */
function parseDateLike(value: any): Date | undefined {
  if (!value) return undefined;
  const isoDatetime = /^\d{4}-\d{2}-\d{2}T/;
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof value === "string" && (isoDatetime.test(value) || isoDateOnly.test(value))) {
    const d = dayjs(value);
    if (d.isValid()) return d.toDate();
  }
  if (value instanceof Date) return value;
  return undefined;
}

function prettyTitle(extendedKey: string): string {
  const parts = extendedKey.split("_");
  if (parts.length >= 2) {
    const varPart = parts[0];
    const label = parts.slice(1).join("_");
    return `${varPart} – ${label}`;
  }
  return extendedKey;
}

const EXTRA_EXPORT_COLS = ["Entidad", "CicloDeVida"] as const;

async function downloadExcelOrdered(rows: ReportRow[], filename = "reporte_202.xlsx") {
  if (!rows || rows.length === 0) {
    message.warning("No hay datos para exportar.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reporte 202");

  const headers = [
    ...EXTRA_EXPORT_COLS.map((h) => ({ header: h.toUpperCase(), key: h, width: 24 })),
    ...(FIELD_ORDER as string[]).map((extendedKey) => ({
      header: prettyTitle(extendedKey).toUpperCase(),
      key: extendedKey,
      width: 18
    }))
  ];
  sheet.columns = headers as any;

  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };

  rows.forEach((row) => {
    const excelRow: Record<string, any> = {};
    excelRow["Entidad"] = row.__entidadLabel ?? "";
    excelRow["CicloDeVida"] = row.__cicloNombre ?? "";

    (FIELD_ORDER as string[]).forEach((extendedKey) => {
      const match = extendedKey.match(/^VAR(\d+)_/);
      const n = match ? Number(match[1]) : undefined;
      const simpleKey = n ? `VAR${n}` : extendedKey;
      const raw = (row as any)?.[simpleKey];
      const maybeDate = parseDateLike(raw);
      excelRow[extendedKey] = maybeDate ? maybeDate : (raw ?? "");
    });

    sheet.addRow(excelRow);
  });

  const dateNumFmt = "yyyy-mm-dd";
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    row.eachCell((cell) => {
      if (cell.value && typeof cell.value === "object" && "getTime" in (cell.value as any)) {
        cell.numFmt = dateNumFmt;
      }
    });
  }

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };

  const buf = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* =========================
   Helpers de trimestre actual
   ========================= */
function getCurrentQuarterRange() {
  const now = dayjs();
  const m = now.month();
  const startMonth = Math.floor(m / 3) * 3;
  const start = now.month(startMonth).startOf("month");
  const end = start.add(2, "month").endOf("month");
  return { start, end };
}

/* =========================
   Parseo de payload
   ========================= */
function parseApiRows(payload: any): { rows: ReportRow[]; total: number } {
  if (!payload) return { rows: [], total: 0 };
  if (Array.isArray(payload?.data)) {
    const arr = payload.data as ReportRow[];
    return { rows: arr, total: typeof payload.total === "number" ? payload.total : arr.length };
  }
  if (Array.isArray(payload?.rows)) {
    const arr = payload.rows as ReportRow[];
    return { rows: arr, total: typeof payload.total === "number" ? payload.total : arr.length };
  }
  if (Array.isArray(payload)) {
    return { rows: payload as ReportRow[], total: payload.length };
  }
  return { rows: [], total: 0 };
}

/* =========================
   Formato visual de fechas en tabla
   ========================= */
function formatIfDate(value: any): string {
  if (!value) return "";
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T/;
  if (typeof value === "string" && isoDateRegex.test(value)) {
    return dayjs(value).format("YYYY-MM-DD");
  }
  if (value instanceof Date || dayjs.isDayjs(value)) {
    return dayjs(value as any).format("YYYY-MM-DD");
  }
  return String(value ?? "");
}

/* =========================
   Componente principal
   ========================= */
const Reporte202: React.FC<Reporte202Props> = ({ apiBaseUrl, token }) => {
  const [form] = Form.useForm();

  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [ciclos, setCiclos] = useState<CicloDeVida[]>([]);

  // múltiples selecciones
  const [entidadIds, setEntidadIds] = useState<number[]>([]);
  const [ciclosVida, setCiclosVida] = useState<number[]>([]);

  // spinner del único botón (buscar & acumular)
  const [loadingSearch, setLoadingSearch] = useState(false);

  // acumulado (fuente única de la tabla y del Excel)
  const [accumulated, setAccumulated] = useState<ReportRow[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [columns, setColumns] = useState<ColumnsType<ReportRow>>([]);

  const entidadCodigoRef = useRef<string | undefined>(undefined);
  const searchTimeout = useRef<number | null>(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const controllerRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState<{done:number,total:number} | null>(null);

  // watchers
  const watchedEntidadIds = Form.useWatch<number[] | undefined>("entidadId", form);
  const watchedCiclosVida = Form.useWatch<number[] | undefined>("cicloVida", form);

  useEffect(() => {
    setEntidadIds(Array.isArray(watchedEntidadIds) ? watchedEntidadIds.map(Number) : []);
  }, [watchedEntidadIds]);

  useEffect(() => {
    setCiclosVida(Array.isArray(watchedCiclosVida) ? watchedCiclosVida.map(Number) : []);
  }, [watchedCiclosVida]);

  /* =========================
     Carga inicial
     ========================= */
  const loadEntidades = useCallback(
    async (q?: string) => {
      try {
        const { data } = await axios.get<Entidad[]>(
          `${apiBaseUrl}/reportesms/allentidades`,
          { params: q ? { q } : undefined, headers: { ...authHeaders } }
        );
        setEntidades(data || []);
      } catch (e) {
        console.error(e);
        message.error("No se pudieron cargar las entidades.");
      }
    },
    [apiBaseUrl, authHeaders]
  );

  const loadCiclos = useCallback(async () => {
    try {
      const { data } = await axios.get<CicloDeVida[]>(
        `${apiBaseUrl}/reportes/202/getciclosvida`,
        { headers: { ...authHeaders } }
      );
      if (Array.isArray(data) && data.length > 0) setCiclos(data);
    } catch (e) {
      console.error(e);
      message.error("No se pudieron cargar los ciclos de vida.");
    }
  }, [apiBaseUrl, authHeaders]);

  useEffect(() => {
    loadEntidades();
    loadCiclos();
  }, [loadEntidades, loadCiclos]);

  /* =========================
     Etiquetas y orden
     ========================= */
  const getEntidadLabel = useCallback((id?: number) => {
    if (!id && id !== 0) return "";
    const e = entidades.find(x => Number(x.id) === Number(id));
    return e ? e.nombre : String(id);
  }, [entidades]);

  const getCicloNombre = useCallback((id?: number) => {
    if (!id && id !== 0) return "";
    const c = ciclos.find(x => Number(x.id) === Number(id));
    return c?.nombre || String(id ?? "");
  }, [ciclos]);

  const cicloOrder = useMemo(() => {
    const m = new Map<number, number>();
    ciclos.forEach(c => m.set(Number(c.id), Number(c.id))); // 1..6
    return m;
  }, [ciclos]);

/*   const makeKey = (r: ReportRow, entId?: number, cicId?: number, idx?: number) => {
    const pid = (r.consulta_id ?? r.VAR4_NumeroDocumento ?? idx ?? Math.random()).toString();
    return `${pid}__${entId ?? ""}__${cicId ?? ""}`;
  }; */

/*   const annotate = (arr: ReportRow[], entId?: number, cicId?: number) => {
    const entLabel = getEntidadLabel(entId);
    const cicNombre = getCicloNombre(cicId);
    return arr.map((r, i) => ({
      ...r,
      __entidadId: entId,
      __entidadLabel: entLabel,
      __cicloId: cicId,
      __cicloNombre: cicNombre,
      _Row: makeKey(r, entId, cicId, i),
    }));
  }; */

  const sortByEntidadYCiclo = (arr: ReportRow[]) =>
    [...arr].sort((a, b) => {
      const ea = (a.__entidadLabel || "");
      const eb = (b.__entidadLabel || "");
      const cmpEnt = ea.localeCompare(eb, "es", { sensitivity: "base" });
      if (cmpEnt !== 0) return cmpEnt;
      const oa = cicloOrder.get(Number(a.__cicloId || 0)) ?? Number(a.__cicloId || 0);
      const ob = cicloOrder.get(Number(b.__cicloId || 0)) ?? Number(b.__cicloId || 0);
      return oa - ob;
    });

  /* =========================
     Columnas (Entidad/Ciclo + VARs) — muestra NOMBRE aunque llegue solo id
     ========================= */
  const buildColumns = useCallback((): ColumnsType<ReportRow> => {
    const extras: ColumnsType<ReportRow> = [
      {
        title: "Entidad",
        key: "__entidadLabel",
        width: 220,
        ellipsis: true,
        render: (_: any, r: ReportRow) => {
          const entId =
            (r as any).__entidadId ??
            (r as any).entidad_id ??
            undefined;
          const label =
            (r as any).__entidadLabel ??
            getEntidadLabel(Number(entId));
          return label || (entId != null ? String(entId) : "");
        },
      },
      {
        title: "Ciclo de vida",
        key: "__cicloNombre",
        width: 180,
        ellipsis: true,
        render: (_: any, r: ReportRow) => {
          const cicId =
            (r as any).__cicloId ??
            (r as any).__ciclo_id ??
            (r as any).ciclo_id ??
            undefined;
          const nombre =
            (r as any).__cicloNombre ??
            getCicloNombre(Number(cicId));
          return nombre || (cicId != null ? String(cicId) : "");
        },
      },
    ];

    const varCols: ColumnsType<ReportRow> = (FIELD_ORDER as string[]).map((extendedKey) => {
      const match = extendedKey.match(/^VAR(\d+)_/);
      const n = match ? Number(match[1]) : undefined;
      const simpleKey = n ? `VAR${n}` : extendedKey;
      return {
        title: prettyTitle(extendedKey),
        dataIndex: simpleKey,
        key: simpleKey,
        ellipsis: true,
        width: 160,
        render: (value: any) => formatIfDate(value),
      };
    });

    return [...extras, ...varCols];
  }, [getEntidadLabel, getCicloNombre]);

  useEffect(() => {
    setColumns(buildColumns());
  }, [buildColumns]);

  /* =========================
     Persistencia + trimestre actual
     ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("rep202_filters");
    const { start, end } = getCurrentQuarterRange();
    if (saved) {
      const s = JSON.parse(saved);
      form.setFieldsValue({
        entidadId: Array.isArray(s.entidadId)
          ? s.entidadId.map(Number)
          : (s.entidadId != null ? [Number(s.entidadId)] : []),
        cicloVida: Array.isArray(s.cicloVida)
          ? s.cicloVida.map(Number)
          : (s.cicloVida != null ? [Number(s.cicloVida)] : []),
        fechaInicio: s.startDate ? dayjs(s.startDate) : start,
        fechaFin: s.endDate ? dayjs(s.endDate) : end
      });
      setPage(s.page ?? 1);
      setPageSize(s.pageSize ?? 20);
    } else {
      form.setFieldsValue({ fechaInicio: start, fechaFin: end, entidadId: [], cicloVida: [] });
    }
  }, [form]);

  useEffect(() => {
    const inicio = form.getFieldValue("fechaInicio") as dayjs.Dayjs | undefined;
    const fin = form.getFieldValue("fechaFin") as dayjs.Dayjs | undefined;
    localStorage.setItem(
      "rep202_filters",
      JSON.stringify({
        entidadId: entidadIds,
        cicloVida: ciclosVida,
        page,
        pageSize,
        startDate: inicio ? inicio.format("YYYY-MM-DD") : undefined,
        endDate: fin ? fin.format("YYYY-MM-DD") : undefined
      })
    );
  }, [entidadIds, ciclosVida, page, pageSize, form]);

  /* =========================
     Fetch por ciclo (conservado por si lo usas en otro flujo)
     ========================= */
/*   const fetchFromApi = useCallback(
    async (ent?: number, cic?: number, startDate?: string, endDate?: string): Promise<ReportRow[]> => {
      if (ent == null || cic == null) {
        return [];
      }
      let urlApi = "";
      switch (Number(cic)) {
        case 1: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`; break;
        case 2: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-infancia`; break;
        case 3: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-adolescencia`; break;
        case 4: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-juventud`; break;
        case 5: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-adultez`; break;
        case 6: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-vejez`; break;
        default: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`; break;
      }
      const resp = await axios.get(urlApi, {
        headers: { ...authHeaders },
        timeout: 60000,
        signal: controllerRef.current?.signal,
        params: {
          entidadId: ent,
          cicloVida: cic,
          page: 1,
          pageSize: 100000,
          startDate,
          endDate,
          fechaInicio: startDate,
          fechaFin: endDate
        }
      });
      const { rows } = parseApiRows(resp?.data);
      return rows;
    },
    [apiBaseUrl, authHeaders]
  ); */

  /* =========================
     NUEVO: Fetch batch (POST enviando arrays nativos)
     ========================= */
  const fetchBatchFromApi = useCallback(
    async (
      entIds: number[],
      cicIds: number[],
      startDate?: string,
      endDate?: string
    ): Promise<ReportRow[]> => {
      const urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-multi`;

      const payload = { entidadIds: entIds, ciclos: cicIds, startDate, endDate };

      const resp = await axios.post(urlApi, payload, {
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        timeout: 10 * 60 * 1000,
        signal: controllerRef.current?.signal,
      });

      const { rows } = parseApiRows(resp?.data);
      return rows;
    },
    [apiBaseUrl, authHeaders]
  );

  /* =========================
     Único botón: Buscar (acumula)
     ========================= */
  const handleBuscarAcumular = useCallback(async () => {
    if (loadingSearch) return;

    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    const entSel = (form.getFieldValue("entidadId") as number[] | undefined) ?? [];
    const cicSel = (form.getFieldValue("cicloVida") as number[] | undefined) ?? [];
    const inicio = form.getFieldValue("fechaInicio");
    const fin = form.getFieldValue("fechaFin");
    const startDate = inicio ? inicio.format("YYYY-MM-DD") : undefined;
    const endDate = fin ? fin.format("YYYY-MM-DD") : undefined;

    if (!entSel.length || !cicSel.length) {
      message.warning("Selecciona al menos una entidad y un ciclo de vida.");
      return;
    }

    try {
      setLoadingSearch(true);
      setProgress({ done: 0, total: 1 });

      const batchRows = await fetchBatchFromApi(entSel, cicSel, startDate, endDate);
      setProgress({ done: 1, total: 1 });

      // anotar etiquetas si faltan
      const annotated = batchRows.map((r, i) => {
        const entId = (r.__entidadId ?? (r as any).entidad_id) as number | undefined;
        const cicId = (r.__cicloId ?? (r as any).__ciclo_id ?? (r as any).ciclo_id) as number | undefined;
        const entLabel = (r as any).__entidadLabel ?? getEntidadLabel(entId);
        const cicNombre = (r as any).__cicloNombre ?? getCicloNombre(cicId);
        const key = r._Row ?? `${(r.consulta_id ?? (r as any).VAR4 ?? r.VAR4_NumeroDocumento ?? i)}__${entId ?? ""}__${cicId ?? ""}`;
        return { ...r, __entidadId: entId, __entidadLabel: entLabel, __cicloId: cicId, __cicloNombre: cicNombre, _Row: key };
      });

      // merge con acumulado
      const map = new Map<string, ReportRow>();
      accumulated.forEach(r => r._Row && map.set(r._Row, r));
      annotated.forEach(r => r._Row && map.set(r._Row, r));

      const merged = sortByEntidadYCiclo(Array.from(map.values()));
      setAccumulated(merged);
      setPage(1);

      message.success(`Acumulado actualizado (+${annotated.length}). Total: ${merged.length}.`);
    } catch (err: any) {
      if (axios.isCancel?.(err) || err?.name === "CanceledError" || err?.message?.includes("canceled")) {
        message.info("Búsqueda cancelada.");
      } else {
        console.error(err);
        message.error("No se pudo completar la búsqueda.");
      }
    } finally {
      setLoadingSearch(false);
      controllerRef.current = null;
      setProgress(null);
    }
  }, [form, fetchBatchFromApi, accumulated, loadingSearch, getEntidadLabel, getCicloNombre, sortByEntidadYCiclo]);

  /* =========================
     Paginación y opciones
     ========================= */
  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || pageSize;
      setPage(newPage);
      setPageSize(newPageSize);
    },
    [pageSize]
  );

  const handleExport = useCallback(async () => {
    if (!accumulated.length) {
      message.info("No hay datos acumulados para exportar.");
      return;
    }
    await downloadExcelOrdered(accumulated, "reporte_202.xlsx");
  }, [accumulated]);

  const handleSearchEntidad = useCallback(
    (value: string) => {
      const v = value?.trim();
      if (searchTimeout.current) (window as any).clearTimeout(searchTimeout.current);
      searchTimeout.current = window.setTimeout(() => {
        if (v.length >= 2) loadEntidades(v);
      }, 400);
    },
    [loadEntidades]
  );

  const entidadOptions = useMemo(
    () =>
      entidades.map((e) => ({
        value: Number(e.id),
        label: e.nombre, 
        codigo: e.codigo
      })),
    [entidades]
  );

  const cicloOptions = useMemo(
    () =>
      ciclos.map((c) => ({
        value: Number(c.id),
        label: c.nombre 
      })),
    [ciclos]
  );

  const resetToCurrentQuarter = useCallback(() => {
    const { start, end } = getCurrentQuarterRange();
    form.resetFields(["entidadId", "cicloVida"]);
    form.setFieldsValue({ fechaInicio: start, fechaFin: end, entidadId: [], cicloVida: [] });
    setEntidadIds([]);
    setCiclosVida([]);
    setAccumulated([]);
    setPage(1);
    setPageSize(20);
    entidadCodigoRef.current = undefined;
  }, [form]);

  /* =========================
     Derivados para la tabla (siempre acumulado)
     ========================= */
  const effectiveRows = accumulated;
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return effectiveRows.slice(start, end);
  }, [effectiveRows, page, pageSize]);

  /* =========================
     Chips de filtros activos (encima de la tabla)
     ========================= */
  const selectedEntidades = useMemo(
    () => entidadIds.map((id) => ({ id, nombre: getEntidadLabel(id) })).filter(e => !!e.nombre),
    [entidadIds, getEntidadLabel]
  );
  const selectedCiclos = useMemo(
    () => ciclosVida.map((id) => ({ id, nombre: getCicloNombre(id) })).filter(c => !!c.nombre),
    [ciclosVida, getCicloNombre]
  );

  const removeEntidad = useCallback(
    (id: number) => {
      const next = entidadIds.filter(x => x !== id);
      form.setFieldsValue({ entidadId: next });
      setEntidadIds(next);
    },
    [entidadIds, form]
  );

  const removeCiclo = useCallback(
    (id: number) => {
      const next = ciclosVida.filter(x => x !== id);
      form.setFieldsValue({ cicloVida: next });
      setCiclosVida(next);
    },
    [ciclosVida, form]
  );

  /* =========================
     Render
     ========================= */
  return (
    <div style={{ padding: 12 }}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card
            size="small"
            style={{ borderRadius: 14 }}
            title={
              <Space>
                <FileTextOutlined />
                <Title level={5} style={{ margin: 0 }}>
                  Reporte Resolución 202
                </Title>
              </Space>
            }
            extra={
              <Space>
                <Tooltip title="Limpiar filtros">
                  <Button icon={<ReloadOutlined />} onClick={resetToCurrentQuarter}>
                    Limpiar
                  </Button>
                </Tooltip>
                <Tooltip title="Exportar a Excel">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={effectiveRows.length === 0}
                  >
                    Exportar a Excel
                  </Button>
                </Tooltip>
              </Space>
            }
          >
            <Form form={form} layout="vertical">
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Entidad" name="entidadId">
                    <Select
                      mode="multiple"
                      showSearch
                      allowClear
                      placeholder="Selecciona una o varias entidades"
                      onSearch={handleSearchEntidad}
                      filterOption={false}
                      optionFilterProp="label"
                      options={entidadOptions}
                      style={{ width: "100%" }}
                      maxTagCount="responsive"
                      onSelect={(_, option) => {
                        entidadCodigoRef.current = (option as any)?.codigo;
                      }}
                      onClear={() => { entidadCodigoRef.current = undefined; }}
                      disabled={loadingSearch}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Ciclo de vida" name="cicloVida">
                    <Select
                      mode="multiple"
                      allowClear
                      placeholder="Selecciona uno o varios ciclos"
                      optionFilterProp="label"
                      options={cicloOptions}
                      style={{ width: "100%" }}
                      maxTagCount="responsive"
                      disabled={loadingSearch}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                  <Form.Item label="Fecha inicio" name="fechaInicio">
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} disabled={loadingSearch}/>
                  </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                  <Form.Item label="Fecha fin" name="fechaFin">
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                  <Form.Item label=" " colon={false}>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleBuscarAcumular}
                      loading={loadingSearch}
                      block
                    >
                      Buscar (acumula)
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {(selectedEntidades.length > 0 || selectedCiclos.length > 0) && (
          <Col span={24}>
            <Card size="small" style={{ borderRadius: 14 }}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <Space align="center">
                  <FilterOutlined />
                  <Text strong>Filtros activos</Text>
                </Space>
                <Space size={[8, 8]} wrap>
                  {selectedEntidades.map((e) => (
                    <Tag
                      key={`ent-${e.id}`}
                      color="blue"
                      closable
                      onClose={(ev) => {
                        ev.preventDefault();
                        removeEntidad(e.id);
                      }}
                    >
                      Entidad: {e.nombre}
                    </Tag>
                  ))}
                  {selectedCiclos.map((c) => (
                    <Tag
                      key={`cic-${c.id}`}
                      color="green"
                      closable
                      onClose={(ev) => {
                        ev.preventDefault();
                        removeCiclo(c.id);
                      }}
                    >
                      Ciclo: {c.nombre}
                    </Tag>
                  ))}
                </Space>
                <Divider style={{ margin: "8px 0" }} />
                <Space size="middle" wrap>
                  <Tag>
                    <Text type="secondary">Entidades:</Text>&nbsp;
                    <Text strong>{selectedEntidades.length}</Text>
                  </Tag>
                  <Tag>
                    <Text type="secondary">Ciclos:</Text>&nbsp;
                    <Text strong>{selectedCiclos.length}</Text>
                  </Tag>
                </Space>
              </Space>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card size="small" style={{ borderRadius: 14 }} styles={{ body: { padding: 0 } }}>
            {progress && (
              <div style={{ padding: 8 }}>
                <Typography.Text type="secondary">
                  Procesando {progress.done} / {progress.total} combinaciones...
                </Typography.Text>
              </div>
            )}
            <Table<ReportRow>
              size="middle"
              rowKey={"_Row"}
              columns={columns}
              dataSource={paginatedRows}
              loading={loadingSearch}
              sticky
              pagination={{
                current: page,
                pageSize,
                total: effectiveRows.length,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                onChange: (cp, ps) => handleTableChange({ current: cp, pageSize: ps }),
                showTotal: (t) => `Total acumulado: ${t} registros`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Sin datos. Usa 'Buscar (acumula)' para ir construyendo el consolidado."
                  />
                )
              }}
              // +2 por Entidad y Ciclo
              scroll={{ x: (FIELD_ORDER.length + 2) * 160, y: 520 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reporte202;
