# SIF Generator

A simple desktop application built using React, Vite, and Electron for generating SIF (Salary Information File) files for employees.

## Features

- Add employee details through a clean form UI
- Field validation for all inputs
- Generate `.sif` files directly from the desktop app
- Electron-based desktop application
- Real-time error handling and validation messages
- Production build support using Electron Builder

---

## Tech Stack

- React
- Vite
- Electron
- Electron Builder

---

## Employee Fields

The application collects the following employee information:

- QID
- Employee Name
- Bank Name
- Account Number
- Working Days
- Salary

---

## Validation Implemented

- QID must contain exactly 11 digits
- Name accepts only alphabets and spaces
- Bank name accepts only alphabets and spaces
- Account number must be numeric
- Working days must be numeric
- Salary must be numeric

---

## Project Structure


sif-generator/
│
├── electron/
│   ├── main.cjs
│   └── preload.js
│
├── src/
│   ├── components/
│   │   └── EmployeeForm.jsx
│   │
│   ├── utils/
│   │   └── sifGenerator.js
│   │
│   └── App.jsx
│
├── dist/
├── package.json
└── vite.config.js



## Installation

Clone the repository and install dependencies.

npm install


## Run Development Server
npm run dev

This starts:

Vite development server
Electron desktop window
Production Build

Build the React application:

npm run build


## Output

The generated SIF file is saved using Electron's native save dialog.

## Notes

Electron preload is used for secure IPC communication.
React renderer cannot directly access Node.js APIs.
Electron Builder is used for creating distributable desktop applications.


## Future Improvements
Employee table preview
Edit/Delete employee records
Import employees from CSV
Better UI styling
Toast notifications

## Author

Abinsaj PS