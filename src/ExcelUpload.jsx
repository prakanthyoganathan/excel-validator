import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import './App.css'

const ExcelUpload = () => {
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
      validateData(sheetData);
    };
    reader.readAsBinaryString(file);
  };

  const validateData = (sheetData) => {
    const errors = [];
    
    // Skip the header row by using slice(1)
    const validatedData = sheetData.slice(1).map((row, index) => {
      const rowErrors = [];
      
      // Example Validation: Check if first column is a string and second column is a number
      if (typeof row[0] !== 'string') {
        rowErrors.push(`Row ${index + 2}: First column should be a string`);
      }
      if (typeof row[1] !== 'number') {
        rowErrors.push(`Row ${index + 2}: Second column should be a number`);
      }

      if (rowErrors.length > 0) {
        errors.push(...rowErrors);
      }

      return row;
    });

    setErrors(errors);
    setData(sheetData);  // Keep original data including headers
  };

  return (
    <div>
      <Dropzone onDrop={(acceptedFiles) => handleFile(acceptedFiles[0])}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center' }}>
            <input {...getInputProps()} />
            <p>Drag & drop an Excel file here, or click to select one</p>
          </div>
        )}
      </Dropzone>

      {errors.length > 0 && (
        <div>
          <h4>Validation Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {data.length > 0 && (
        <div>
          <h4>Data:</h4>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
