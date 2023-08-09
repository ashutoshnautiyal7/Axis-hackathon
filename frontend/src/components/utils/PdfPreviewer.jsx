import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up the worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfPreviewer = ({ pdfBase64 }) => {
  const [pdfData, setPdfData] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    if (pdfBase64) {
      // Convert the Base64 data to a blob and create an object URL
      const byteCharacters = atob(pdfBase64);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      setPdfData(pdfUrl);
    }
  }, [pdfBase64]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className=''>
      {pdfData && (
        <div>
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page renderTextLayer={false}
              renderAnnotationLayer={false}
              customTextRenderer={false} className='w-fit' pageNumber={pageNumber} />
          </Document>
        </div>
      )}
      {!pdfData && <p>No PDF to preview</p>}
    </div>
  );
};

export default PdfPreviewer;
