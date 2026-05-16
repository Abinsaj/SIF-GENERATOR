import { useState } from "react"
import { generateSIFContent } from "../utils/sifGenerator"

const initialFormData = {
  employerEid: "",
  payerEid: "",
  payerQid: "",
  payerBankShortName: "",
  payerIban: "",
  qid: "",
  visaId: "",
  name: "",
  bank: "",
  accountNumber: "",
  salaryFrequency: "M",
  workingDays: "",
  netSalary: "",
  basicSalary: "",
  extraHours: "",
  extraIncome: "",
  deductions: "",
  paymentType: "Normal Payment",
  notes: "",
  salary: "",
}

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-xs text-rose-400 flex items-center gap-1">
        <span className="inline-block w-1 h-1 rounded-full bg-rose-400" />
        {error}
      </p>
    )}
  </div>
)

const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`
      h-10 w-full rounded-lg px-3.5 text-sm bg-slate-800/80 text-white
      border transition-all duration-200 outline-none
      placeholder:text-slate-500
      focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
      ${error ? "border-rose-500/60 bg-rose-950/20" : "border-slate-700 hover:border-slate-500"}
    `}
  />
)

const SectionCard = ({ title, subtitle, icon, children }) => (
  <div className="rounded-2xl bg-slate-800/50 border border-slate-700/60 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/60 bg-slate-800/80">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 text-base">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-white tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6 flex flex-col gap-4">{children}</div>
  </div>
)

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})
  const [employees, setEmployees] = useState([])

  const validateField = (name, value) => {
    const val = value === undefined || value === null ? "" : String(value).trim()
    switch (name) {
      case "employerEid":
        if (!val) return "Employer EID is required."
        if (!/^\d+$/.test(val)) return "Employer EID must contain digits only."
        return ""
      case "payerEid":
        if (!val) return ""
        if (!/^\d+$/.test(val)) return "Payer EID must contain digits only."
        return ""
      case "payerQid":
        if (!val) return ""
        if (!/^\d{11}$/.test(val)) return "Payer QID must be exactly 11 digits."
        return ""
      case "payerBankShortName":
        if (!val) return "Payer bank short name is required."
        return ""
      case "payerIban":
        if (!val) return ""
        if (!/^[A-Z0-9]+$/.test(val)) return "IBAN should be uppercase alphanumeric without spaces."
        return ""
      case "qid":
        if (!val) return "Employee QID is required."
        if (!/^\d{11}$/.test(val)) return "Employee QID must be exactly 11 digits."
        return ""
      case "name":
        if (!val) return "Employee name is required."
        if (!/^[A-Za-z\s\-']+$/.test(val)) return "Name may contain letters, spaces, hyphens or apostrophes."
        return ""
      case "bank":
        if (!val) return "Employee bank is required."
        return ""
      case "accountNumber":
        if (!val) return "Account number is required."
        if (!/^[A-Za-z0-9]+$/.test(val)) return "Account number must be alphanumeric."
        return ""
      case "workingDays":
        if (!val) return "Number of working days is required."
        if (!/^\d+$/.test(val)) return "Working days must be an integer."
        if (Number(val) < 0 || Number(val) > 31) return "Working days must be between 0 and 31."
        return ""
      case "salary":
        if (val === undefined) return "Salary is required."
        if (isNaN(Number(val))) return "Salary must be a valid number."
        if (Number(val) < 0) return "Salary cannot be negative."
        return ""
      case "netSalary":
      case "basicSalary":
      case "extraHours":
      case "extraIncome":
      case "deductions":
        if (!val) return ""
        if (isNaN(Number(val))) return `${name} must be a valid number.`
        return ""
      case "salaryFrequency":
        if (!val) return ""
        if (!/^[A-Za-z]$/.test(val)) return "Salary Frequency should be a single letter."
        return ""
      default:
        return ""
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    const fieldError = validateField(name, value)
    setErrors(prev => {
      const next = { ...prev }
      if (fieldError) next[name] = fieldError
      else delete next[name]
      return next
    })
  }

  const validate = () => {
    const newErrors = {}
    Object.keys(formData).forEach(key => {
      const err = validateField(key, formData[key])
      if (err) newErrors[key] = err
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddEmployee = () => {
    if (!validate()) return
    setEmployees(prev => [...prev, formData])
    setFormData(prev => ({
      ...prev,
      qid: "", visaId: "", name: "", bank: "", accountNumber: "",
      workingDays: "", netSalary: "", basicSalary: "", extraHours: "",
      extraIncome: "", deductions: "", notes: "",
    }))
  }

  const handleGenerate = async () => {
    if (employees.length === 0) {
      alert("Please add at least one employee")
      return
    }
    const options = {
      employerEid: formData.employerEid,
      payerEid: formData.payerEid,
      payerQid: formData.payerQid,
      payerBankShortName: formData.payerBankShortName,
      payerIban: formData.payerIban,
      employees,
    }


    const sifContent = generateSIFContent(formData, options)
    const payload = {
      employer: {
        employerEid: formData.employerEid,
        payerEid: formData.payerEid,
        payerBankShortName: formData.payerBankShortName,
      },
      employees,
      generatedContent: sifContent.generateSif,
    }

    console.log(sifContent.generateSif,'this is the generated content')
    const result = await window.electronAPI.saveSIFFile(payload, formData.payerEid, formData.payerBankShortName,sifContent.fileCreationDate,sifContent.fileCreationTime)
    if (result.success) {
      alert("SIF File Generated Successfully")
      setEmployees([])
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-start justify-center py-10 px-4">
      <div className="relative w-full max-w-3xl flex flex-col gap-6">

        <div className="text-center pt-2 pb-1">
          <h1 className="text-4xl font-black text-white tracking-tight">
            SIF Generator
          </h1>
        </div>

        {employees.length > 0 && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {employees.length} employee{employees.length !== 1 ? "s" : ""} queued
            </div>
          </div>
        )}

        <SectionCard
          title="Employer Details"
          icon="🏢"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employer EID" error={errors.employerEid}>
              <Input name="employerEid" placeholder="e.g. 12345678" inputMode="numeric"
                value={formData.employerEid} onChange={handleChange} error={errors.employerEid} />
            </Field>
            <Field label="Payer EID (optional)" error={errors.payerEid}>
              <Input name="payerEid" placeholder="e.g. 98765432" inputMode="numeric"
                value={formData.payerEid} onChange={handleChange} error={errors.payerEid} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Payer Bank Short Name" error={errors.payerBankShortName}>
              <Input name="payerBankShortName" placeholder="e.g. QNBA"
                value={formData.payerBankShortName} onChange={handleChange} error={errors.payerBankShortName} />
            </Field>
            <Field label="Payer QID (optional)" error={errors.payerQid}>
              <Input name="payerQid" placeholder="11-digit QID"
                value={formData.payerQid} onChange={handleChange} error={errors.payerQid} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Payer IBAN (optional)" error={errors.payerIban}>
              <Input name="payerIban" placeholder="e.g. QA57QNBA..."
                value={formData.payerIban} onChange={handleChange} error={errors.payerIban} />
            </Field>
            <div /> 
          </div>
        </SectionCard>

        <SectionCard
          title="Employee Details"
          icon="👤"
        >
          <div className="grid grid-cols-2 gap-4">
            <Field label="Employee QID" error={errors.qid}>
              <Input name="qid" placeholder="11-digit QID"
                value={formData.qid} onChange={handleChange} error={errors.qid} />
            </Field>
            <Field label="Visa ID (optional)">
              <Input name="visaId" placeholder="Visa ID"
                value={formData.visaId} onChange={handleChange} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" error={errors.name}>
              <Input name="name" placeholder="Employee full name"
                value={formData.name} onChange={handleChange} error={errors.name} />
            </Field>
            <Field label="Bank" error={errors.bank}>
              <Input name="bank" placeholder="Employee bank name"
                value={formData.bank} onChange={handleChange} error={errors.bank} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Account Number" error={errors.accountNumber}>
              <Input name="accountNumber" placeholder="Bank account number"
                value={formData.accountNumber} onChange={handleChange} error={errors.accountNumber} />
            </Field>
            <Field label="Salary Frequency" error={errors.salaryFrequency}>
              <Input name="salaryFrequency" placeholder="M = Monthly"
                value={formData.salaryFrequency} onChange={handleChange} error={errors.salaryFrequency} />
            </Field>
          </div>

          <div className="relative flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 font-semibold tracking-widest uppercase">Salary Breakdown</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Working Days" error={errors.workingDays}>
              <Input name="workingDays" placeholder="e.g. 26" inputMode="numeric"
                value={formData.workingDays} onChange={handleChange} error={errors.workingDays} />
            </Field>
            <Field label="Net Salary" error={errors.netSalary}>
              <Input name="netSalary" placeholder="e.g. 5000.00" inputMode="numeric"
                value={formData.netSalary} onChange={handleChange} error={errors.netSalary} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Basic Salary" error={errors.basicSalary}>
              <Input name="basicSalary" placeholder="e.g. 4000.00" inputMode="numeric"
                value={formData.basicSalary} onChange={handleChange} error={errors.basicSalary} />
            </Field>
            <Field label="Extra Hours Pay" error={errors.extraHours}>
              <Input name="extraHours" placeholder="e.g. 200" inputMode="numeric"
                value={formData.extraHours} onChange={handleChange} error={errors.extraHours} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Extra Income" error={errors.extraIncome}>
              <Input name="extraIncome" placeholder="e.g. 500.00" inputMode="numeric"
                value={formData.extraIncome} onChange={handleChange} error={errors.extraIncome} />
            </Field>
            <Field label="Deductions" error={errors.deductions}>
              <Input name="deductions" placeholder="e.g. 100.00" inputMode="numeric"
                value={formData.deductions} onChange={handleChange} error={errors.deductions} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Payment Type">
              <Input name="paymentType" placeholder="Normal Payment"
                value={formData.paymentType} onChange={handleChange} />
            </Field>
            <Field label="Notes / Comments">
              <Input name="notes" placeholder="Optional notes"
                value={formData.notes} onChange={handleChange} />
            </Field>
          </div>
        </SectionCard>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleAddEmployee}
            className="
              h-12 rounded-xl font-bold text-sm tracking-wide
              bg-slate-700 hover:bg-slate-600 text-white
              border border-slate-600 hover:border-slate-500
              transition-all duration-200 active:scale-[0.98]
              flex items-center justify-center gap-2
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Employee
          </button>

          <button
            onClick={handleGenerate}
            className="
              h-12 rounded-xl font-bold text-sm tracking-wide
              bg-blue-600 hover:bg-blue-500 text-white
              border border-blue-500 hover:border-blue-400
              transition-all duration-200 active:scale-[0.98]
              flex items-center justify-center gap-2
              disabled:opacity-40 disabled:cursor-not-allowed
            "
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Generate SIF
          </button>
        </div>

        {employees.length > 0 && (
          <div className="rounded-2xl bg-slate-800/50 border border-slate-700/60 overflow-hidden">
            <div className="px-6 py-3.5 border-b border-slate-700/60 bg-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Queued Employees</span>
              <span className="text-xs text-slate-500">{employees.length} record{employees.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="divide-y divide-slate-700/40">
              {employees.map((emp, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{emp.name || "—"}</p>
                    <p className="text-xs text-slate-400">{emp.bank} · {emp.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400">
                      {emp.netSalary ? ` ${Number(emp.netSalary).toLocaleString()}` : "—"}
                    </p>
                    <p className="text-xs text-slate-500">{emp.workingDays} days</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeForm