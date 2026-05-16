export const generateSIFContent = ( data,options = {}) => {

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

  const fileCreationDate =`${yyyy}${mm}${dd}`

  const fileCreationTime =`${pad(now.getHours())}${pad(now.getMinutes())}`

  const salaryYearMonth = `${yyyy}${mm}`
  const employees = Array.isArray(options.employees) ? options.employees : [data]


  const totalSalaries = employees.reduce((sum, emp) => {
      const salary = Number(emp.netSalary || emp.salary || 0)

      return sum + salary

    }, 0)

  const totalRecords = employees.length

  const employerRow = [
    options.employerEid || "",
    fileCreationDate,
    fileCreationTime,
    options.payerEid || "",
    options.payerQid || "",
    options.payerBankShortName || "",
    options.payerIban || "",
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

  const employeeRows = employees.map(
    (emp, index) => [
      index + 1,
      emp.qid || "",
      emp.visaId || "",
      emp.name || "",
      emp.bank || "",
      emp.accountNumber || "",
      emp.salaryFrequency || "",
      emp.workingDays || "",
      emp.netSalary || emp.salary || "",
      emp.basicSalary || "",
      emp.extraHours || "",
      emp.extraIncome || "",
      emp.deductions || "",
      emp.paymentType || "",
      emp.notes || ""
    ]
  )

  const lines = [ employerHeader.join(","), employerRow.join(","), "", employeeHeaders.join(","), ...employeeRows.map(row =>row.join(",")) ]

  const generateSif = lines.join("\n")

  return {generateSif ,fileCreationDate , fileCreationTime}
}