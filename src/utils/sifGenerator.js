export const generateSIFContent = (data) => {
  return `
Record Sequence, Employee QID, Employee Name, Employee Bank Short Name,Employee Account,Number of Working Days,Net Salary
${1},${data.qid},${data.name},${data.bank},${data.accountNumber},${data.workingDays},${data.salary}
  `.trim()
}