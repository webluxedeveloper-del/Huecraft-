import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const downloadCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Escape quotes and wrap in quotes if contains comma
        return `"${cell.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadPDF = (data: any, type: 'quote' | 'lead', filename: string) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text(`Huecraft - ${type === 'quote' ? 'Quote' : 'Lead'} Details`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

  const tableData = Object.entries(data).map(([key, value]) => [
    key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
    String(value || 'N/A')
  ]);

  autoTable(doc, {
    startY: 40,
    head: [['Field', 'Value']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [20, 20, 20] },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: 'auto' }
    }
  });

  doc.save(`${filename}.pdf`);
};
