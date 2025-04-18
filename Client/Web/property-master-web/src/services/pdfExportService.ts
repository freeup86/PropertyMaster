import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TaxReport, TaxCategory } from './taxReportService';

export const exportTaxReportToPdf = (taxReport: TaxReport): void => {
  // Create a new document
  const doc = new jsPDF();
  
  // We need to properly type and cast the doc to use autoTable
  // This is a TypeScript issue with the jspdf-autotable plugin
  const autoTable = require('jspdf-autotable').default;
  
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(18);
  doc.text(`Tax Report - ${taxReport.propertyName}`, pageWidth / 2, 15, { align: 'center' });
  
  // Add subtitle with year
  doc.setFontSize(14);
  doc.text(`Tax Year: ${taxReport.taxYear}`, pageWidth / 2, 25, { align: 'center' });
  
  // Add summary section
  doc.setFontSize(12);
  doc.text('Summary', 14, 35);
  
  doc.setFontSize(10);
  doc.text(`Total Income: $${taxReport.totalIncome.toFixed(2)}`, 20, 45);
  doc.text(`Total Deductible Expenses: $${taxReport.totalDeductibleExpenses.toFixed(2)}`, 20, 52);
  doc.text(`Taxable Income: $${taxReport.taxableIncome.toFixed(2)}`, 20, 59);
  
  // Add income details table
  doc.setFontSize(12);
  doc.text('Income Details', 14, 70);
  
  const incomeColumns = ['Category', 'Amount', 'Tax Deductible'];
  const incomeRows = taxReport.incomeCategories.map((category: TaxCategory) => [
    category.categoryName,
    `$${category.amount.toFixed(2)}`,
    category.isTaxDeductible ? 'Yes' : 'No'
  ]);
  
  // Add total row
  incomeRows.push([
    'Total Income',
    `$${taxReport.totalIncome.toFixed(2)}`,
    ''
  ]);
  
  // Use autoTable as a function instead of a method on doc
  autoTable(doc, {
    startY: 75,
    head: [incomeColumns],
    body: incomeRows,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // Get the final Y position after the income table
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  
  // Add expense details table
  doc.setFontSize(12);
  doc.text('Expense Details', 14, finalY);
  
  const expenseColumns = ['Category', 'Amount', 'Tax Deductible'];
  const expenseRows = taxReport.expenseCategories.map((category: TaxCategory) => [
    category.categoryName,
    `$${category.amount.toFixed(2)}`,
    category.isTaxDeductible ? 'Yes' : 'No'
  ]);
  
  // Add total rows
  const totalExpenses = taxReport.expenseCategories.reduce((sum, cat) => sum + cat.amount, 0);
  expenseRows.push([
    'Total Expenses',
    `$${totalExpenses.toFixed(2)}`,
    ''
  ]);
  expenseRows.push([
    'Total Deductible Expenses',
    `$${taxReport.totalDeductibleExpenses.toFixed(2)}`,
    ''
  ]);
  
  // Use autoTable as a function again
  autoTable(doc, {
    startY: finalY + 5,
    head: [expenseColumns],
    body: expenseRows,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // Add footer with date
  const currentDate = new Date().toLocaleDateString();
  doc.setFontSize(8);
  doc.text(`Generated on ${currentDate}`, pageWidth - 15, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  
  // Save the PDF
  doc.save(`Tax_Report_${taxReport.propertyName}_${taxReport.taxYear}.pdf`);
};