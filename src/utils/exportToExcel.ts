import * as XLSX from 'xlsx';

/**
 * Xuất mảng JSON object thành file Excel (.xlsx)
 * @param data Mảng các object chứa dữ liệu (ví dụ: [{ Name: "A", Score: 10 }])
 * @param fileName Tên file (không cần đuôi .xlsx)
 * @param sheetName Tên của Sheet bên trong file Excel
 */

export function exportToExcel(data: any[], fileName: string, sheetName: string = 'Sheet1') {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const objectMaxLength: number[] = []; 
    for (let i = 0; i < data.length; i++) {
        const value = Object.values(data[i]);
        for (let j = 0; j < value.length; j++) {
            const valStr = value[j] !== null && value[j] !== undefined ? String(value[j]) : "";
            objectMaxLength[j] = Math.max(objectMaxLength[j] || 0, valStr.length);
        }
    }
    worksheet['!cols'] = objectMaxLength.map(w => ({ width: w + 2 }));

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
}