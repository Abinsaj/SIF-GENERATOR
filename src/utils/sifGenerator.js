// export const generateSIFContent = (data) => {
//   return `
// Record Sequence, Employee QID, Employee Name, Employee Bank Short Name,Employee Account, Number of Working Days, Net Salary
// ${1},${data.qid},${data.name},${data.bank},${data.accountNumber},${data.workingDays},${data.salary}
//   `.trim()
// }

export const generateSIFContent = (data) => {

  const headers = [
    
    "Record Sequence",
    "Company Name",
    "Employee QID",
    "Employee Name",
    "Employee Bank Short Name",
    "Employee Account Number",
    "Number of Working Days",
    "Net Salary"
  ]

  const row = [
    1,
    data.companyName,
    data.qid,
    data.name,
    data.bank,
    data.accountNumber,
    data.workingDays,
    data.salary
  ]

  return [
    headers.join(","),
    row.join(",")
  ].join("\n")
}