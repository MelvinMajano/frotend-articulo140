import * as XLSX from "xlsx";

interface AttendanceStudent {
  name: string;
  accountNumber: string | number;
  entryTime: string | Date;
  exitTime: string | Date;
  hoursAwarded: number | null;
  Scope: string;
  attendanceId: string;
}

const UNAH_BLUE_HEX  = "1E3A8A";
const HEADER_TEXT    = "FFFFFF";
const ALT_ROW        = "EFF6FF";
const BORDER_COLOR   = "BFDBFE";
const ACCENT_BLUE    = "DBEAFE";

const border = (color = BORDER_COLOR) => ({
  top:    { style: "thin" as const, color: { rgb: color } },
  bottom: { style: "thin" as const, color: { rgb: color } },
  left:   { style: "thin" as const, color: { rgb: color } },
  right:  { style: "thin" as const, color: { rgb: color } },
});

const headerCell = (value: string): XLSX.CellObject => ({
  v: value,
  t: "s",
  s: {
    font:      { bold: true, color: { rgb: HEADER_TEXT }, name: "Arial", sz: 11 },
    fill:      { fgColor: { rgb: UNAH_BLUE_HEX }, patternType: "solid" },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    border:    border("FFFFFF"),
  },
});

const dataCell = (
  value: string | number,
  type: XLSX.ExcelDataType,
  isAlt: boolean,
  align: "left" | "center" | "right" = "left"
): XLSX.CellObject => ({
  v: value,
  t: type,
  s: {
    font:      { name: "Arial", sz: 10, color: { rgb: "1E293B" } },
    fill:      { fgColor: { rgb: isAlt ? ALT_ROW : "FFFFFF" }, patternType: "solid" },
    alignment: { horizontal: align, vertical: "center" },
    border:    border(),
  },
});

const formatDate = (isoString: string | Date): string => {
  try {
    return new Date(isoString).toLocaleString("es-HN", {
      day:    "2-digit",
      month:  "2-digit",
      year:   "numeric",
      hour:   "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(isoString);
  }
};

export const exportAttendanceToExcel = (
  students: AttendanceStudent[],
  activityTitle: string,
  maxHours: number
): void => {
  const wb = XLSX.utils.book_new();
  const ws: XLSX.WorkSheet = {};

  // ── Título del reporte ──────────────────────────────────────────────────────
  ws["A1"] = {
    v: `Reporte de Asistencia — ${activityTitle}`,
    t: "s",
    s: {
      font:      { bold: true, name: "Arial", sz: 14, color: { rgb: UNAH_BLUE_HEX } },
      fill:      { fgColor: { rgb: ACCENT_BLUE }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center" },
      border:    border(UNAH_BLUE_HEX),
    },
  };

  ws["A2"] = {
    v: `Fecha de exportación: ${new Date().toLocaleString("es-HN")}   |   Horas máximas por estudiante: ${maxHours}h   |   Total estudiantes: ${students.length}`,
    t: "s",
    s: {
      font:      { italic: true, name: "Arial", sz: 9, color: { rgb: "64748B" } },
      fill:      { fgColor: { rgb: "F8FAFC" }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center" },
    },
  };

  // Fila vacía de separación
  ws["A3"] = { v: "", t: "s" };

  // ── Encabezados (fila 4) ────────────────────────────────────────────────────
  const HEADERS = [
    "N°",
    "Nombre completo",
    "N° de Cuenta",
    "Hora de entrada",
    "Hora de salida",
    "Horas otorgadas",
    "Ámbito",
  ];

  HEADERS.forEach((h, col) => {
    const cellRef = XLSX.utils.encode_cell({ r: 3, c: col });
    ws[cellRef] = headerCell(h);
  });

  // ── Filas de datos (desde fila 5) ──────────────────────────────────────────
  students.forEach((student, idx) => {
    const row    = idx + 4; // 0-indexed: fila 5 de Excel = índice 4
    const isAlt  = idx % 2 === 1;
    const rowNum = idx + 1;

    ws[XLSX.utils.encode_cell({ r: row, c: 0 })] = dataCell(rowNum,                              "n", isAlt, "center");
    ws[XLSX.utils.encode_cell({ r: row, c: 1 })] = dataCell(student.name,                        "s", isAlt, "left");
    ws[XLSX.utils.encode_cell({ r: row, c: 2 })] = dataCell(String(student.accountNumber),       "s", isAlt, "center");
    ws[XLSX.utils.encode_cell({ r: row, c: 3 })] = dataCell(formatDate(student.entryTime),       "s", isAlt, "center");
    ws[XLSX.utils.encode_cell({ r: row, c: 4 })] = dataCell(formatDate(student.exitTime),        "s", isAlt, "center");
    ws[XLSX.utils.encode_cell({ r: row, c: 5 })] = dataCell(student.hoursAwarded ?? 0,           "n", isAlt, "center");
    ws[XLSX.utils.encode_cell({ r: row, c: 6 })] = dataCell(student.Scope ?? "—",                "s", isAlt, "left");
  });

  // ── Fila de totales ─────────────────────────────────────────────────────────
  const totalRow = students.length + 4;
  const totalStyle = {
    font:      { bold: true, name: "Arial", sz: 10, color: { rgb: UNAH_BLUE_HEX } },
    fill:      { fgColor: { rgb: ACCENT_BLUE }, patternType: "solid" },
    alignment: { horizontal: "center", vertical: "center" },
    border:    border(UNAH_BLUE_HEX),
  };

  ws[XLSX.utils.encode_cell({ r: totalRow, c: 0 })] = { v: "",              t: "s", s: totalStyle };
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 2 })] = { v: "",              t: "s", s: totalStyle };
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 3 })] = { v: "",              t: "s", s: totalStyle };
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 4 })] = { v: "",              t: "s", s: totalStyle };
  ws[XLSX.utils.encode_cell({ r: totalRow, c: 6 })] = { v: "",              t: "s", s: totalStyle };

  // ── Merges: título y subtítulo abarcan todas las columnas ──────────────────
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Título
    { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Subtítulo
    { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // Fila vacía
  ];

  // ── Anchos de columna ───────────────────────────────────────────────────────
  ws["!cols"] = [
    { wch: 5  }, // N°
    { wch: 32 }, // Nombre
    { wch: 16 }, // N° Cuenta
    { wch: 20 }, // Hora entrada
    { wch: 20 }, // Hora salida
    { wch: 16 }, // Horas otorgadas
    { wch: 22 }, // Ámbito
  ];

  // ── Alto de filas especiales ────────────────────────────────────────────────
  ws["!rows"] = [
    { hpt: 30 }, // Título
    { hpt: 18 }, // Subtítulo
    { hpt: 8  }, // Separador
    { hpt: 24 }, // Encabezados
  ];

  // ── Rango de la hoja ────────────────────────────────────────────────────────
  ws["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: totalRow, c: 6 },
  });

  // ── Nombre del archivo: sanitizar caracteres no válidos ────────────────────
  const safeTitle = activityTitle
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // quitar tildes
    .replace(/[^a-zA-Z0-9\s\-_]/g, "") // solo alfanumérico
    .trim()
    .replace(/\s+/g, "_")
    .substring(0, 60);

  XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
  XLSX.writeFile(wb, `${safeTitle}_asistencia.xlsx`);
};