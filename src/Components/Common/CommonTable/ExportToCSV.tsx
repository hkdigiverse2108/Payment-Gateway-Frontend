import * as XLSX from "xlsx";

/** Generic Excel Export */
export const exportToExcel = (
  data: any[],
  fileName = "data.xlsx"
) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, fileName);
};

/** Generic CSV Export */
export const exportToCSV = (
  data: any[],
  fileName = "data.csv"
) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);

  const rows = data.map((row) =>
    headers.map((key) => row[key])
  );

  const csvContent =
    [headers, ...rows]
      .map((r) => r.join(","))
      .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};