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

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    console.log(name,value,'validatingfield')
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

      case "qid": {
        if (!val) return "Employee QID is required."
        if (!/^\d{11}$/.test(val)) return "Employee QID must be exactly 11 digits."
        return ""
      }
      case "name": {
        if (!val) return "Employee name is required."
        if (!/^[A-Za-z\s\-']+$/.test(val)) return "Employee name may contain letters, spaces, hyphens or apostrophes."
        return ""
      }
      case "bank":
        if (!val) return "Employee bank is required."
        return ""
      case "accountNumber":
        if (!val) return "Account number is required."
        if (!/^[A-Za-z0-9]+$/.test(val)) return "Account number must be numeric or alphanumeric (no special chars)."
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
        if (!/^[A-Za-z]$/.test(val)) return "Salary Frequency should be a single letter (e.g. M)."
        return ""

      case "visaId":
      case "paymentType":
      case "notes":
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

    console.log(errors,'this is errors')

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGenerate = async () => {
    console.log('hihihiiihihh')
    if (!validate()) return

    const options = {
      employerEid: formData.employerEid,
      payerEid: formData.payerEid,
      payerQid: formData.payerQid,
      payerBankShortName: formData.payerBankShortName,
      payerIban: formData.payerIban,
    }
    const sifContent = generateSIFContent(formData, options)
    console.log(sifContent,'this is the sif content')
    const filenameHint = formData.employerEid || formData.payerBankShortName || "sif"
    const result = await window.electronAPI.saveSIFFile(sifContent, filenameHint)
    
    if (result.success) {
      setFormData(initialFormData)
      setErrors({})
      alert("SIF File Generated Successfully")
    } else {
      alert(result.error || "Failed to save SIF file")
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h1 style={styles.header}>SIF Generator</h1>

        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Employer Data (static)</h3>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="employerEid"
                style={styles.input}
                placeholder="Employer EID"
                inputMode="numeric"
                value={formData.employerEid}
                onChange={handleChange}
              />
              {errors.employerEid && <p style={styles.error}>{errors.employerEid}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="payerEid"
                style={styles.input}
                placeholder="Payer EID (optional)"
                inputMode="numeric"
                value={formData.payerEid}
                onChange={handleChange}
              />
              {errors.payerEid && <p style={styles.error}>{errors.payerEid}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="payerBankShortName"
                style={styles.input}
                placeholder="Payer Bank Short Name"
                value={formData.payerBankShortName}
                onChange={handleChange}
              />
              {errors.payerBankShortName && <p style={styles.error}>{errors.payerBankShortName}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="payerQid"
                style={styles.input}
                placeholder="Payer QID (optional)"
                value={formData.payerQid}
                onChange={handleChange}
              />
              {errors.payerQid && <p style={styles.error}>{errors.payerQid}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="payerIban"
                style={styles.input}
                placeholder="Payer IBAN (optional)"
                value={formData.payerIban}
                onChange={handleChange}
              />
              {errors.payerIban && <p style={styles.error}>{errors.payerIban}</p>}
            </div>
            <div style={styles.rowItem}></div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionHeader}>Employee Data (monthly)</h3>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="qid"
                style={styles.input}
                placeholder="Employee QID"
                value={formData.qid}
                onChange={handleChange}
              />
              {errors.qid && <p style={styles.error}>{errors.qid}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="visaId"
                style={styles.input}
                placeholder="Employee Visa ID (optional)"
                value={formData.visaId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="name"
                style={styles.input}
                placeholder="Employee Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p style={styles.error}>{errors.name}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="bank"
                style={styles.input}
                placeholder="Employee Bank"
                value={formData.bank}
                onChange={handleChange}
              />
              {errors.bank && <p style={styles.error}>{errors.bank}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="accountNumber"
                style={styles.input}
                placeholder="Employee Account"
                value={formData.accountNumber}
                onChange={handleChange}
              />
              {errors.accountNumber && <p style={styles.error}>{errors.accountNumber}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="salaryFrequency"
                style={styles.input}
                placeholder="Salary Frequency (M)"
                value={formData.salaryFrequency}
                onChange={handleChange}
              />
              {errors.salaryFrequency && <p style={styles.error}>{errors.salaryFrequency}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="workingDays"
                style={styles.input}
                placeholder="Number of Working Days"
                inputMode="numeric"
                value={formData.workingDays}
                onChange={handleChange}
              />
              {errors.workingDays && <p style={styles.error}>{errors.workingDays}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="netSalary"
                style={styles.input}
                placeholder="Net Salary"
                inputMode="numeric"
                value={formData.netSalary}
                onChange={handleChange}
              />
              {errors.netSalary && <p style={styles.error}>{errors.netSalary}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="basicSalary"
                style={styles.input}
                placeholder="Basic Salary"
                inputMode="numeric"
                value={formData.basicSalary}
                onChange={handleChange}
              />
              {errors.basicSalary && <p style={styles.error}>{errors.basicSalary}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="extraHours"
                style={styles.input}
                placeholder="Extra hours"
                inputMode="numeric"
                value={formData.extraHours}
                onChange={handleChange}
              />
              {errors.extraHours && <p style={styles.error}>{errors.extraHours}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="extraIncome"
                style={styles.input}
                placeholder="Extra Income"
                inputMode="numeric"
                value={formData.extraIncome}
                onChange={handleChange}
              />
              {errors.extraIncome && <p style={styles.error}>{errors.extraIncome}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="deductions"
                style={styles.input}
                placeholder="Deductions"
                inputMode="numeric"
                value={formData.deductions}
                onChange={handleChange}
              />
              {errors.deductions && <p style={styles.error}>{errors.deductions}</p>}
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="paymentType"
                style={styles.input}
                placeholder="Payment Type"
                value={formData.paymentType}
                onChange={handleChange}
              />
              {errors.paymentType && <p style={styles.error}>{errors.paymentType}</p>}
            </div>
            <div style={styles.rowItem}>
              <input
                type="text"
                name="notes"
                style={styles.input}
                placeholder="Notes / Comments"
                value={formData.notes}
                onChange={handleChange}
              />
              {errors.notes && <p style={styles.error}>{errors.notes}</p>}
            </div>
          </div>
        </div>

        <button onClick={handleGenerate} style={styles.button}>
          GENERATE SIF
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height:"80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1f1f1f",
    padding: "20px",
  },

  header: {
    margin: "0 0 28px 0",
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: "1.5px",
  },

  input: {
    height: "40px",
    padding: "10px 14px",
    width: "100%",
    border: "1.5px solid #ddd",
    borderRadius: "6px",
    boxShadow: "0 3px 8px rgba(0, 0, 0, 0.12)",
    fontSize: "14px",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },

  button: {
    height: "48px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "24px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s, transform 0.2s",
  },

  error: {
    color: "#e74c3c",
    fontSize: "12px",
    margin: "5px 0 0 0",
    fontWeight: "500",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "60%",
    maxWidth: "900px",
    padding: "45px",
    borderRadius: "14px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
    backgroundColor: "rgba(90, 90, 90, 0.98)",
    maxHeight: "95vh",
    overflowY: "auto",
  },

  section: {
    padding: "18px 0",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  sectionHeader: {
    margin: "0 0 12px 0",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
    borderBottom: "2.5px solid #007bff",
    paddingBottom: "10px",
  },

  row: {
    display: "flex",
    flexDirection: "row",
    gap: "18px",
    width: "100%",
  },

  rowItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
}

export default EmployeeForm
