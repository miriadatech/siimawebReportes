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
  DatePicker
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import {
  FileTextOutlined,
  ReloadOutlined,
  DownloadOutlined,
  SearchOutlined
} from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import ExcelJS from "exceljs";

const { Title } = Typography;

/* =========================
   Tipos
   ========================= */
interface ReportRow {
  consulta_id: number;
  afiliados_id: number;
  VAR0_TipoRegistro: string;
  VAR1_ConseRegistro: string;
  VAR2_IPSprimaria: string;  VAR3_TipoDocumento: string;  VAR4_NumeroDocumento: string;  VAR5_PrimerApellido: string;  VAR6_SegundoApellido: string;
  VAR7_PrimerNombre: string;  VAR8_SegundoNombre: string;  VAR9_FechaNacimeinto: string;  VAR10_Sexo: string;  VAR11_PerEtnica: string;
  VAR12_Ocupacion: string; VAR13_NivelEducativo: string; VAR14_Gestacion: string; VAR15_SifilisGestacional: string; VAR16_PruebaMiniMental: string;

  VAR17_HipotiroidismoCongenito: string; VAR18_Sintomatico_Respi: string; VAR19_ConsumoTabaco: string; VAR20_Lepra: string; 
  VAR21_ObesidadODesnutricion: string;
  VAR22_ResultadoTactoRectal: string; VAR23_AcidoFolicoPreconcepcional: string; VAR24_SangreOcultaEnMateriaFecal: string; 
  VAR25_EnfermedadMental : string; VAR26_CancerDeCervix: string;
  VAR27_AgudezaVisualLejanaOjoIzquierdo: string; VAR28_AgudezaVisualLejanaOjoDerecho : string; 
  VAR29_FechaDelPeso: string; VAR30_PesoEnKilogramos: string; VAR31_FechaDeLaTalla: string;
  VAR32_TallaEnCentimetros: string; VAR33_FechaProbableDeParto : string; VAR34_CodigoPais: string; VAR35_Clasificacion_Del_RiesgoGestacional: string; 
  VAR36_ResultadoDeColonoscopiaTamizaje: string;
  VAR37_ResultadoDeColonoscopiaTamizaje: string; VAR38_ResultadoDeTamizajeVisualNeonatal: string; VAR39_DPTMenoresDe5Anhos: string; 
  VAR40_ResultadoDeTamizajeVale: string; VAR41_Neumococo: string;
  VAR42_ResultadoDeTamizajeParaHepatitisC: string; VAR43_MotricidadGruesa: string; VAR44_MotricidadFinoadaptativa: string; 
  VAR45_EscalaAbreviadaDeDesarrolloAreaPersonalSocial: string; VAR46_ResultadoDeEscalaAbreviadaDesarrolloAreaDeMotricidadAudicionLenguaje: string;
  VAR47_CrioterapiaOLetz: string; VAR48_ResultadoDeTamizacionConOximetriaPreyPostDuctal: string; 
  VAR49_FechaAtencionPartoOCesarea: string; VAR50_FechaSalidaDeLaAtencionndelPartoOCesarea: string; 
  VAR51_FechaDeAtencionEnSaludParaLaPromocionYApoyoDeLaLactanciaMaterna: string;
  VAR52_FechaDeConsultaDeValoracionIntegral: string; VAR53_FechaDeAtencionEnSaludParaLaAsesoriaEnAnticoncepción: string; 
  VAR54_SuministroDeMetodoAnticonceptivo: string; VAR55_FechaDeSuministroDeMetodoAnticonceptivo: string; 
  VAR56_FechaDePrimeraConsultaPrenatal: string;
  VAR57_ResultadoDeGlicemiaBasal: string; VAR58_FechaDeUltimoControlPrenatalDeSeguimiento: string; 
  VAR59_SuministroDeAcidoFolicoEnElControlPrenatal: string; VAR60_SuministroDeSulfatoFerrosoEnElControlPrenatal: string; 
  VAR61_SuministroDeCarbonatoDeCalcioEnElControlPrenatal: string;
  VAR62_FechaDeValoracionAgudezaVisual: string; VAR63_FechaDeTamizajeVale: string; 
  VAR64_FechaDelTactoRectal: string; VAR65_FechaDeTamizacionConOximetriaPreyPostDuctal: string; 
  VAR66_FechaDeRealizacionColonoscopiaTamizaje: string;
  VAR67_FechaDeLaPruebaSangreOcultaEnMateriaFecal: string; VAR68_ConsultaDePsicologia: string; 
  VAR69_FechaDeTamizajeAuditivoNeonatal: string; VAR70_SuministroDeFortificacionCasera: string; 
  VAR71_SuministroDeVitaminaAEnLaPrimeraInfancia: string;
  VAR72_Fecha_DeTomaLDL: string; VAR73_FechaDeTomaPSA: string; VAR74_PreservativosEntregadosAPacientesConITS: string; 
  VAR75_FechaDeTamizajeVisualNeonatal: string; VAR76_FechaDeAtencionEnSaludBucalPorProfesionalEnOdontologia: string;
  VAR77_SuministroDeHierroEnLaPrimeraInfancia: string; VAR78_FechaDeAntigenoDeSuperficieHepatitisB: string; 
  VAR79_ResultadoDeAntigenoDeSuperficieHepatitisB: string; VAR80_FechaDeTomaDePruebaTamizajeParaSifilis: string; 
  VAR81_ResultadoDePruebaTamizajeParaSifilis: string;
  VAR82_FechaDeTomaPruebaParaVIH: string; VAR83_ResultadoDePruebaParaVIH: string; 
  VAR84_FechaTSHNeonatal: string; VAR85_ResultadoDeTSHNeonatal: string; VAR86_TamizajeDelCancerDeCuelloUterino: string;
  VAR87_FechaDeTamizajeCancerDeCuelloUterino: string; VAR88_ResultadoTamizajeCancerDeCuelloUterino: string; 
  VAR89_CalidadEnLaMuestraDeCitologiaCervicouterina: string; VAR90_CodigoDeHabilitacionIPSDondeSeRealizaTamizajeCancerDeCuelloUterino: string; 
  VAR91_FechaDeColposcopia: string;
  VAR92_ResultadoDeLDL: string; VAR93_FechaDeBiopsiaCervicouterina: string; VAR94_ResultadoDeBiopsiaCervicouterina: string; 
  VAR95_ResultadoDeHDL: string; VAR96_FechaMamografia: string;
  VAR97_ResultadoMamografia: string; VAR98_ResultadoDeTrigliceridos: string; 
  VAR99_FechaDeTomaBiopsiaDeMama: string; VAR100_FechaDeResultadoBiopsiaDeMama: string; VAR101_ResultadoDeBiopsiaDeMama: string;
  VAR102_COPporPersona: string; VAR103_FechaDeTomaHemoglobina: string; VAR104_ResultadoDeHemoglobina: string; 
  VAR105_FechaDeTomaGlicemiaBasal: string; VAR106_FechaDeTomaCreatinina: string;
  VAR107_ResultadoDeCreatinina : string; VAR108_FechaHemoglobinaGlicosilada: string; 
  VAR109_ResultadoDePSA: string; VAR110_FechaDeTomaDeTamizajeHepatitisC: string; VAR111_FechaDeTomaHDL: string;
  VAR112_FechaDeTomaDeBaciloscopiaDiagnostico: string; VAR113_ResultadoDeBaciloscopiaDiagnostico: string; 
  VAR114_ClasificacionDelRiesgoCardiovascular: string; VAR115_TratamientoParaSifilisGestacional: string; 
  VAR116_TratamientoParaSifilisCongenita: string;
  VAR117_ClasificacionDelRiesgoMetabolico: string; VAR118_FechaDeTomaTrigliceridos: string;
}

interface Entidad {
  id: number;
  nombre: string;
  codigo?: string;
}

interface FetchParams {
  entidadId?: number;
  cicloVida?: number;
  page: number;
  pageSize: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
}

/* interface ApiListResponse {
  data: ReportRow[];
  total: number;
} */

interface Reporte202Props {
  apiBaseUrl: string;
  token?: string | null;
}

interface CicloDeVida {
  id: number;
  nombre: string;
  edadMinAnios: number | null;
  edadMaxAnios: number | null;
}

/* =========================
   Orden fijo de columnas/CSV
   ========================= */
const FIELD_ORDER: (keyof ReportRow)[] = [
"VAR0_TipoRegistro",
"VAR1_ConseRegistro",
"VAR2_IPSprimaria",
"VAR3_TipoDocumento",
"VAR4_NumeroDocumento",
"VAR5_PrimerApellido",
"VAR6_SegundoApellido",
"VAR7_PrimerNombre",
"VAR8_SegundoNombre",
"VAR9_FechaNacimeinto",
"VAR10_Sexo",
"VAR11_PerEtnica",
"VAR12_Ocupacion", 
"VAR13_NivelEducativo", 
"VAR14_Gestacion", 
"VAR15_SifilisGestacional", 
"VAR16_PruebaMiniMental",
"VAR17_HipotiroidismoCongenito", 
"VAR18_Sintomatico_Respi", 
"VAR19_ConsumoTabaco", 
"VAR20_Lepra", 
"VAR21_ObesidadODesnutricion",
"VAR22_ResultadoTactoRectal", 
"VAR23_AcidoFolicoPreconcepcional", 
"VAR24_SangreOcultaEnMateriaFecal", 
"VAR25_EnfermedadMental", 
"VAR26_CancerDeCervix",
"VAR27_AgudezaVisualLejanaOjoIzquierdo", 
"VAR28_AgudezaVisualLejanaOjoDerecho", 
"VAR29_FechaDelPeso", 
"VAR30_PesoEnKilogramos", 
"VAR31_FechaDeLaTalla",
"VAR32_TallaEnCentimetros", 
"VAR33_FechaProbableDeParto", 
"VAR34_CodigoPais", 
"VAR35_Clasificacion_Del_RiesgoGestacional", 
"VAR36_ResultadoDeColonoscopiaTamizaje",
"VAR37_ResultadoDeColonoscopiaTamizaje", 
"VAR38_ResultadoDeTamizajeVisualNeonatal", 
"VAR39_DPTMenoresDe5Anhos", 
"VAR40_ResultadoDeTamizajeVale", 
"VAR41_Neumococo",
"VAR42_ResultadoDeTamizajeParaHepatitisC", 
"VAR43_MotricidadGruesa", 
"VAR44_MotricidadFinoadaptativa", 
"VAR45_EscalaAbreviadaDeDesarrolloAreaPersonalSocial", 
"VAR46_ResultadoDeEscalaAbreviadaDesarrolloAreaDeMotricidadAudicionLenguaje",
"VAR47_CrioterapiaOLetz", 
"VAR48_ResultadoDeTamizacionConOximetriaPreyPostDuctal", 
"VAR49_FechaAtencionPartoOCesarea", 
"VAR50_FechaSalidaDeLaAtencionndelPartoOCesarea", 
"VAR51_FechaDeAtencionEnSaludParaLaPromocionYApoyoDeLaLactanciaMaterna",
"VAR52_FechaDeConsultaDeValoracionIntegral", 
"VAR53_FechaDeAtencionEnSaludParaLaAsesoriaEnAnticoncepción", 
"VAR54_SuministroDeMetodoAnticonceptivo", 
"VAR55_FechaDeSuministroDeMetodoAnticonceptivo", 
"VAR56_FechaDePrimeraConsultaPrenatal",
"VAR57_ResultadoDeGlicemiaBasal", 
"VAR58_FechaDeUltimoControlPrenatalDeSeguimiento", 
"VAR59_SuministroDeAcidoFolicoEnElControlPrenatal", 
"VAR60_SuministroDeSulfatoFerrosoEnElControlPrenatal", 
"VAR61_SuministroDeCarbonatoDeCalcioEnElControlPrenatal",
"VAR62_FechaDeValoracionAgudezaVisual", 
"VAR63_FechaDeTamizajeVale", 
"VAR64_FechaDelTactoRectal", 
"VAR65_FechaDeTamizacionConOximetriaPreyPostDuctal", 
"VAR66_FechaDeRealizacionColonoscopiaTamizaje",
"VAR67_FechaDeLaPruebaSangreOcultaEnMateriaFecal", 
"VAR68_ConsultaDePsicologia", 
"VAR69_FechaDeTamizajeAuditivoNeonatal", 
"VAR70_SuministroDeFortificacionCasera", 
"VAR71_SuministroDeVitaminaAEnLaPrimeraInfancia",
"VAR72_Fecha_DeTomaLDL", 
"VAR73_FechaDeTomaPSA", 
"VAR74_PreservativosEntregadosAPacientesConITS", 
"VAR75_FechaDeTamizajeVisualNeonatal", 
"VAR76_FechaDeAtencionEnSaludBucalPorProfesionalEnOdontologia",
"VAR77_SuministroDeHierroEnLaPrimeraInfancia", 
"VAR78_FechaDeAntigenoDeSuperficieHepatitisB", 
"VAR79_ResultadoDeAntigenoDeSuperficieHepatitisB", 
"VAR80_FechaDeTomaDePruebaTamizajeParaSifilis", 
"VAR81_ResultadoDePruebaTamizajeParaSifilis",
"VAR82_FechaDeTomaPruebaParaVIH", 
"VAR83_ResultadoDePruebaParaVIH", 
"VAR84_FechaTSHNeonatal", 
"VAR85_ResultadoDeTSHNeonatal", 
"VAR86_TamizajeDelCancerDeCuelloUterino",
"VAR87_FechaDeTamizajeCancerDeCuelloUterino", 
"VAR88_ResultadoTamizajeCancerDeCuelloUterino", 
"VAR89_CalidadEnLaMuestraDeCitologiaCervicouterina", 
"VAR90_CodigoDeHabilitacionIPSDondeSeRealizaTamizajeCancerDeCuelloUterino", 
"VAR91_FechaDeColposcopia",
"VAR92_ResultadoDeLDL", 
"VAR93_FechaDeBiopsiaCervicouterina", 
"VAR94_ResultadoDeBiopsiaCervicouterina", 
"VAR95_ResultadoDeHDL", 
"VAR96_FechaMamografia",
"VAR97_ResultadoMamografia", 
"VAR98_ResultadoDeTrigliceridos", 
"VAR99_FechaDeTomaBiopsiaDeMama", 
"VAR100_FechaDeResultadoBiopsiaDeMama", 
"VAR101_ResultadoDeBiopsiaDeMama",
"VAR102_COPporPersona", 
"VAR103_FechaDeTomaHemoglobina", 
"VAR104_ResultadoDeHemoglobina", 
"VAR105_FechaDeTomaGlicemiaBasal", 
"VAR106_FechaDeTomaCreatinina",
"VAR107_ResultadoDeCreatinina", 
"VAR108_FechaHemoglobinaGlicosilada", 
"VAR109_ResultadoDePSA", 
"VAR110_FechaDeTomaDeTamizajeHepatitisC", 
"VAR111_FechaDeTomaHDL",
"VAR112_FechaDeTomaDeBaciloscopiaDiagnostico", 
"VAR113_ResultadoDeBaciloscopiaDiagnostico", 
"VAR114_ClasificacionDelRiesgoCardiovascular", 
"VAR115_TratamientoParaSifilisGestacional", 
"VAR116_TratamientoParaSifilisCongenita",
"VAR117_ClasificacionDelRiesgoMetabolico", 
"VAR118_FechaDeTomaTrigliceridos",
];

/* =========================
   Utilidades
   ========================= */

function parseDateLike(value: any): Date | undefined {
  if (!value) return undefined;

  // ISO tipo "YYYY-MM-DDTHH:mm:ss" o "YYYY-MM-DD"
  const isoDatetime = /^\d{4}-\d{2}-\d{2}T/;
  const isoDateOnly = /^\d{4}-\d{2}-\d{2}$/;

  if (typeof value === "string" && (isoDatetime.test(value) || isoDateOnly.test(value))) {
    const d = dayjs(value);
    if (d.isValid()) return d.toDate(); // ExcelJS necesita Date real
  }

  // Si ya viene como Date
  if (value instanceof Date) return value;

  return undefined;
}

function prettyTitle(extendedKey: string): string {
  const parts = extendedKey.split("_");
  if (parts.length >= 2) {
    const varPart = parts[0];               // "VAR1"
    const label = parts.slice(1).join("_"); // "ConseRegistro"
    return `${varPart} – ${label}`;
  }
  return extendedKey;
}

async function downloadExcelOrdered(rows: any[], filename = "reporte_202.xlsx") {
  if (!rows || rows.length === 0) {
    message.warning("No hay datos para exportar.");
    return;
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Reporte 202");

  // Encabezados con los nombres asignados en FIELD_ORDER
  const headers = (FIELD_ORDER as string[]).map((extendedKey) => ({
    header: prettyTitle(extendedKey).toUpperCase(),
    key: extendedKey, // usamos la clave extendida como key de columna
    width: 18
  }));
  sheet.columns = headers as any;

  // Congelar encabezado y habilitar autofiltro
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length }
  };

  // Insertar filas leyendo SIEMPRE VARn del backend
  rows.forEach((row) => {
    const excelRow: Record<string, any> = {};
    (FIELD_ORDER as string[]).forEach((extendedKey) => {
      const match = extendedKey.match(/^VAR(\d+)_/);
      const n = match ? Number(match[1]) : undefined;
      const simpleKey = n ? `VAR${n}` : extendedKey;

      const raw = (row as any)?.[simpleKey];

      const maybeDate = parseDateLike(raw);
      if (maybeDate) {
        excelRow[extendedKey] = maybeDate; // valor Date
      } else {
        excelRow[extendedKey] = raw ?? ""; // texto/num
      }
    });
    sheet.addRow(excelRow);
  });

  // Aplicar formato de fecha a celdas que sean Date
  const dateNumFmt = "yyyy-mm-dd";
  // Recorremos todas las celdas (desde la 2, porque la 1 es encabezado)
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    row.eachCell((cell) => {
      if (cell.value && typeof cell.value === "object" && "getTime" in (cell.value as any)) {
        // Es un Date
        cell.numFmt = dateNumFmt;
      }
    });
  }

  // Estilos básicos de encabezado
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
  const now = dayjs(); // TZ local
  const m = now.month(); // 0..11
  const startMonth = Math.floor(m / 3) * 3; // 0,3,6,9
  const start = now.month(startMonth).startOf("month");
  const end = start.add(2, "month").endOf("month");
  return { start, end };
}

/* =========================
   Parseo robusto de payload
   ========================= */
function parseApiRows(payload: any): { rows: ReportRow[]; total: number } {
  if (!payload) return { rows: [], total: 0 };

  // Caso 1: { data: [...] , total }
  if (Array.isArray(payload?.data)) {
    return {
      rows: payload.data as ReportRow[],
      total:
        typeof payload.total === "number" ? payload.total : payload.data.length
    };
  }

  // Caso 2: { rows: [...] , total }
  if (Array.isArray(payload?.rows)) {
    return {
      rows: payload.rows as ReportRow[],
      total:
        typeof payload.total === "number" ? payload.total : payload.rows.length
    };
  }

  // Caso 3: respuesta es un array plano
  if (Array.isArray(payload)) {
    return { rows: payload as ReportRow[], total: payload.length };
  }

  // Cualquier otro caso
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
  return String(value);
}

/* =========================
   Componente principal
   ========================= */
const Reporte202: React.FC<Reporte202Props> = ({ apiBaseUrl, token }) => {
  const [form] = Form.useForm();

  const [entidades, setEntidades] = useState<Entidad[]>([]);
  const [ciclos, setCiclos] = useState<CicloDeVida[]>([]);

  const [entidadId, setEntidadId] = useState<number | undefined>(undefined);
  const [cicloVida, setCicloVida] = useState<number | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [columns, setColumns] = useState<ColumnsType<ReportRow>>([]);

  const lastQueryRef = useRef<{ entidadId?: number; cicloVida?: number }>({});
  const entidadCodigoRef = useRef<string | undefined>(undefined);
  const searchTimeout = useRef<number | null>(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  /* =========================
     Watchers del Form
     ========================= */
  const watchedEntidadId = Form.useWatch<number | undefined>("entidadId", form);
  const watchedCicloVida = Form.useWatch<number | undefined>("cicloVida", form);

  useEffect(() => {
    setEntidadId(
      typeof watchedEntidadId === "number" ? watchedEntidadId : undefined
    );
  }, [watchedEntidadId]);

  useEffect(() => {
    setCicloVida(
      typeof watchedCicloVida === "number" ? watchedCicloVida : undefined
    );
  }, [watchedCicloVida]);

  /* =========================
     Carga inicial opciones
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
     Columnas: muestran "VARn – Nombre" pero leen VARn del backend
     ========================= */
  const buildColumns = useCallback((): ColumnsType<ReportRow> => {
    return (FIELD_ORDER as string[]).map((extendedKey) => {
      const match = extendedKey.match(/^VAR(\d+)_/);
      const n = match ? Number(match[1]) : undefined;
      const simpleKey = n ? `VAR${n}` : extendedKey; // <- aquí se toma el valor del backend (VARn)
      return {
        title: prettyTitle(extendedKey),     // "VARn – NombreBonito"
        dataIndex: simpleKey,                // <- lee VARn
        key: simpleKey,
        ellipsis: true,
        width: 160,
        render: (value: any) => formatIfDate(value)
      };
    });
  }, []);

  const loadColumns = useCallback(async () => {
    setColumns(buildColumns());
  }, [buildColumns]);

  // Cargar columnas al montar
  useEffect(() => {
    loadColumns();
  }, [loadColumns]);

  /* =========================
     Persistencia + trimestre actual por defecto
     ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("rep202_filters");
    if (saved) {
      const s = JSON.parse(saved);
      const ent = s.entidadId != null ? Number(s.entidadId) : undefined;
      const cic = s.cicloVida != null ? Number(s.cicloVida) : undefined;

      const { start, end } = getCurrentQuarterRange();
      const fInicio = s.startDate ? dayjs(s.startDate) : start;
      const fFin = s.endDate ? dayjs(s.endDate) : end;

      form.setFieldsValue({
        entidadId: ent,
        cicloVida: cic,
        fechaInicio: fInicio,
        fechaFin: fFin
      });

      setPage(s.page ?? 1);
      setPageSize(s.pageSize ?? 20);
      lastQueryRef.current = { entidadId: ent, cicloVida: cic };
    } else {
      const { start, end } = getCurrentQuarterRange();
      form.setFieldsValue({ fechaInicio: start, fechaFin: end });
    }
  }, [form]);

  useEffect(() => {
    const inicio = form.getFieldValue("fechaInicio") as dayjs.Dayjs | undefined;
    const fin = form.getFieldValue("fechaFin") as dayjs.Dayjs | undefined;

    localStorage.setItem(
      "rep202_filters",
      JSON.stringify({
        entidadId,
        cicloVida,
        page,
        pageSize,
        startDate: inicio ? inicio.format("YYYY-MM-DD") : undefined,
        endDate: fin ? fin.format("YYYY-MM-DD") : undefined
      })
    );
  }, [entidadId, cicloVida, page, pageSize, form]);

  /* =========================
     Datos (Buscar)
     ========================= */
  const fetchData = useCallback(
    async (params: FetchParams) => {
      setLoading(true);

      // Limpia la tabla mientras consulta
      setRows([]);
      setTotal(0);
      setPage(1);

      const ciclo = Number(params.cicloVida);
      let urlApi = "";

      switch (ciclo) {
        case 1: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`; break;
        case 2: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-infancia`; break;
        case 3: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-adolescencia`; break;
        case 4: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-juventud`; break;
        case 5: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-adultez`; break;
        case 6: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-vejez`; break;
        default: urlApi = `${apiBaseUrl}/reportesms/202/datareport202/report-pra-infancia`; break;
      }

      try {
        const resp = await axios.get(urlApi, {
          headers: { ...authHeaders },
          params: {
            entidadId: params.entidadId,
            cicloVida: params.cicloVida,
            page: 1,
            pageSize: 100000,
            // Compatibilidad: enviar ambas convenciones
            startDate: params.startDate,
            endDate: params.endDate,
            fechaInicio: params.startDate,
            fechaFin: params.endDate
          }
        });

        const { rows: parsedRows, total: parsedTotal } = parseApiRows(resp?.data);
        setRows(parsedRows);
        setTotal(typeof parsedTotal === "number" ? parsedTotal : parsedRows.length);

        if (parsedRows.length === 0) {
          message.info("La búsqueda no arrojó resultados con los filtros seleccionados.");
        }
      } catch (e) {
        const err = e as AxiosError;
        console.error(err);
        message.error("No se pudieron cargar los datos del reporte 202.");
        setRows([]); // asegurar limpieza en error
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [apiBaseUrl, authHeaders]
  );

  const handleBuscar = useCallback(() => {
    const ent: number | undefined = form.getFieldValue("entidadId");
    const cic: number | undefined = form.getFieldValue("cicloVida");
    const inicio = form.getFieldValue("fechaInicio") as dayjs.Dayjs | undefined;
    const fin = form.getFieldValue("fechaFin") as dayjs.Dayjs | undefined;

    if (ent == null || cic == null) {
      message.warning("Selecciona una entidad y un ciclo de vida.");
      return;
    }

    const startDate = inicio ? inicio.format("YYYY-MM-DD") : undefined;
    const endDate = fin ? fin.format("YYYY-MM-DD") : undefined;

    setEntidadId(ent);
    setCicloVida(cic);
    setPage(1);
    lastQueryRef.current = { entidadId: ent, cicloVida: cic };

    fetchData({
      entidadId: ent,
      cicloVida: cic,
      page: 1,
      pageSize,
      startDate,
      endDate
    });
  }, [form, pageSize, fetchData]);

  // Paginación local
  const handleTableChange = useCallback(
    (pagination: TablePaginationConfig) => {
      const newPage = pagination.current || 1;
      const newPageSize = pagination.pageSize || pageSize;
      setPage(newPage);
      setPageSize(newPageSize);
    },
    [pageSize]
  );

  // Export local
  const handleExport = useCallback(async () => {
    if (!rows.length) {
      message.info("No hay registros para exportar con los filtros actuales.");
      return;
    }
    await downloadExcelOrdered(rows, "reporte_202.xlsx");
  }, [rows]);

  // Búsqueda remota de entidades (debounce)
  const handleSearchEntidad = useCallback(
    (value: string) => {
      const v = value?.trim();
      if (searchTimeout.current) window.clearTimeout(searchTimeout.current);
      searchTimeout.current = window.setTimeout(() => {
        if (v.length >= 2) loadEntidades(v);
      }, 400);
    },
    [loadEntidades]
  );

  // Columnas y paginado local
  const tableColumns = useMemo(() => columns, [columns]);
  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return rows.slice(start, end);
  }, [rows, page, pageSize]);

  // Opciones combos
  const entidadOptions = useMemo(
    () =>
      entidades.map((e) => ({
        value: Number(e.id),
        label: e.codigo ? `${e.nombre} (${e.codigo})` : e.nombre,
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

  // Reset a trimestre actual
  const resetToCurrentQuarter = useCallback(() => {
    const { start, end } = getCurrentQuarterRange();
    form.resetFields(["entidadId", "cicloVida"]);
    form.setFieldsValue({ fechaInicio: start, fechaFin: end });
    setEntidadId(undefined);
    setCicloVida(undefined);
    setRows([]);
    setTotal(0);
    setPage(1);
    setPageSize(20);
    lastQueryRef.current = {};
    entidadCodigoRef.current = undefined;
  }, [form]);

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
                <Tooltip title="Limpiar filtros (Trimestre actual)">
                  <Button icon={<ReloadOutlined />} onClick={resetToCurrentQuarter} />
                </Tooltip>
                <Tooltip title="Exportar CSV">
                  <Button
                    icon={<DownloadOutlined />}
                    onClick={handleExport}
                    disabled={rows.length === 0}
                  >
                    Exportar
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
                      showSearch
                      allowClear
                      placeholder="Selecciona una entidad"
                      onSearch={handleSearchEntidad}
                      filterOption={false}
                      optionFilterProp="label"
                      options={entidadOptions}
                      style={{ width: "100%" }}
                      onSelect={(option) => {
                        entidadCodigoRef.current = (option as any)?.codigo;
                      }}
                      onClear={() => {
                        entidadCodigoRef.current = undefined;
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <Form.Item label="Ciclo de vida" name="cicloVida">
                    <Select
                      allowClear
                      placeholder="Selecciona un ciclo de vida"
                      optionFilterProp="label"
                      options={cicloOptions}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                  <Form.Item label="Fecha inicio" name="fechaInicio">
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={3}>
                  <Form.Item label="Fecha fin" name="fechaFin">
                    <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
                  </Form.Item>
                </Col>

                <Col xs={24} md={2}>
                  <Form.Item label=" " colon={false}>
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={handleBuscar}
                      block
                      style={{ maxWidth: "100%" }}
                    >
                      Buscar
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        <Col span={24}>
          <Card size="small" style={{ borderRadius: 14 }} styles={{ body: { padding: 0 } }}>
            <Table<ReportRow>
              size="middle"
              rowKey={(r, idx) => String(r?.consulta_id ?? `row-${idx}`)}
              columns={tableColumns}
              dataSource={paginatedRows}
              loading={loading}
              sticky
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50, 100],
                onChange: (cp, ps) => handleTableChange({ current: cp, pageSize: ps }),
                showTotal: (t) => `Total: ${t} registros`
              }}
              locale={{
                emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Sin datos. Aplica filtros y presiona Buscar."
                    />
                )
              }}
              scroll={{ x: (FIELD_ORDER.length) * 160, y: 520 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reporte202;
