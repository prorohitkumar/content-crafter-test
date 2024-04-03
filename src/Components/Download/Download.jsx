import React from 'react'
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Download = () => {
        // Sample data (you can replace this with your own data)
        const data = [
          ['Name', 'Age'],
          ['John Doe', 30],
          ['Jane Smith', 25],
          ['Bob Johnson', 35],
        ];
    
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        saveAs(excelBlob, 'data.xlsx');
        return (
            <div>
              <button onClick={this.downloadExcel}>Download Excel</button>
            </div>
          );
}

export default Download