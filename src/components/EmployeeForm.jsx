import { useState } from "react"
import { generateSIFContent } from "../utils/sifGenerator"

const initialFormData = {
  qid: "",
  name: "",
  bank: "",
  accountNumber: "",
  workingDays: "",
  salary: "",
}

const EmployeeForm = () => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState({})

  const validateField = (name, value) => {
    switch (name) {
      case "qid":
        if (!value) return "QID is required"
        if (!/^\d{11}$/.test(value)) return "QID must be exactly 11 digits"
        return ""
      case "name":
        if (!value.trim()) return "Name is required"
        if (!/^[A-Za-z\s]+$/.test(value)) return "Employee name must contain letters only"
        return ""
      case "bank":
        if (!value.trim()) return "Bank is required"
        return ""
      case "accountNumber":
        if (!value.trim()) return "Account number required"
      
        if (!/^[A-Za-z0-9]+$/.test(value)) return "Account number must be numeric or alphanumeric"
        return ""
      case "workingDays":
        if (!value) return "Working days is required"
        if (isNaN(value)) return "Working days must be numeric"
        return ""
      case "salary":
        if (!value) return "Salary is required"
        if (isNaN(value)) return "Salary must be numeric"
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

  const handleGenerate = async () => {
    if (!validate()) return

    const sifContent = generateSIFContent(formData)
    console.log(sifContent,'this is the data')
    const result =
      await window.electronAPI.saveSIFFile(sifContent)
    

    if (result.success) {
      // clear form and errors after successful generation
      setFormData(initialFormData)
      setErrors({})
      alert("SIF File Generated Successfully")
    } else {
      alert(result.error || "Failed to save SIF file")
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>SIF Generator</h1>

      <div style={styles.form}>
        <input
          type="text"
          name="qid"
          style={styles.input}
          placeholder="Employee QID"
          value={formData.qid}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.qid}</p>

        <input
          type="text"
          name="name"
          style={styles.input}
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.name}</p>

        <input
          type="text"
          name="bank"
          style={styles.input}
          placeholder="Employee Bank"
          value={formData.bank}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.bank}</p>

        <input
          type="text"
          name="accountNumber"
          style={styles.input}
          placeholder="Account Number"
          inputMode="numeric"
          pattern="\d*"
          value={formData.accountNumber}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.accountNumber}</p>

        <input
          type="text"
          name="workingDays"
          style={styles.input}
          placeholder="Working Days"
          inputMode="numeric"
          pattern="\d*"
          value={formData.workingDays}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.workingDays}</p>

        <input
          type="text"
          name="salary"
          style={styles.input}
          placeholder="Salary"
          inputMode="decimal"
          value={formData.salary}
          onChange={handleChange}
        />
        <p style={styles.error}>{errors.salary}</p>

        <button onClick={handleGenerate}
        style={styles.button}
        >
          GENERATE SIF
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "Arial",
},

input:{
  height: "35px",
  padding: "2px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginBottom: "2px",
},

button:{
  height: "40px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginTop: "6px",
},

error:{
color: "red",
fontsize: "8px"
},

  form: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  width: "400px",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
},
}

export default EmployeeForm