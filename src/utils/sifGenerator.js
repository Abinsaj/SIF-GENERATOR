export const generateSIFContent = (data, options = {}) => {

  console.log('hlooooo')
  const employerHeader = [
    "Employer EID",
    "File Creation Date",
    "File Creation Time",
    "Payer EID",
    "Payer QID",
    "Payer Bank Short Name",
    "Payer IBAN",
    "Salary Year and Month",
    "Total Salaries",
    "Total records",
    "",
    "",
    "",
    ""
  ]

  const now = new Date()
  const pad = (n, len = 2) => String(n).padStart(len, "0")
  const yyyy = now.getFullYear()
  const mm = pad(now.getMonth() + 1)
  const dd = pad(now.getDate())
  const fileCreationDate = `${yyyy}${mm}${dd}`
  const fileCreationTime = `${pad(now.getHours())}${pad(now.getMinutes())}`

  const salaryYearMonth = `${yyyy}${mm}`

  const employees = Array.isArray(options.employees) ? options.employees : (Array.isArray(data) ? data : [data])
  const totalSalaries = employees.reduce((sum, emp) => {
    const n = Number(emp.netSalary ?? emp.salary) || 0
    return sum + n
  }, 0)
  const totalRecords = employees.length

  const employerRow = [
    options.employerEid ?? data.employerEid ?? "",
    fileCreationDate,
    fileCreationTime,
    options.payerEid ?? data.payerEid ?? options.employerEid ?? data.employerEid ?? "",
    options.payerQid ?? data.payerQid ?? "",
    options.payerBankShortName ?? data.payerBankShortName ?? "",
    options.payerIban ?? data.payerIban ?? "",
    salaryYearMonth,
    totalSalaries,
    totalRecords,
    "",
    "",
    "",
    ""
  ]

  const employeeHeaders = [
    "Record Sequence",
    "Employee QID",
    "Employee Visa ID",
    "Employee Name",
    "Employee Bank Short Name",
    "Employee Account",
    "Salary Frequency",
    "Number of Working Days",
    "Net Salary",
    "Basic Salary",
    "Extra hours",
    "Extra Income",
    "Deductions",
    "Payment Type",
    "Notes / Comments"
  ]

  const employeeRow = [
    1,
    data.qid ?? "",
    data.visaId ?? "",
    data.name ?? "",
    data.bank ?? "",
    data.accountNumber ?? "",
    data.salaryFrequency ?? "",
    data.workingDays ?? "",
    data.netSalary ?? data.salary ?? "",
    data.basicSalary ?? "",
    data.extraHours ?? "",
    data.extraIncome ?? "",
    data.deductions ?? "",
    data.paymentType ?? "",
    data.notes ?? ""
  ]

  const lines = [
    employerHeader.join(","),
    employerRow.join(","),
    "", 
    employeeHeaders.join(","),
    employeeRow.join(",")
  ]

  console.log('first',lines)

  return lines.join("\n")
}