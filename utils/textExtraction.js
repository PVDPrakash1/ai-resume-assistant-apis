const pdfJs = require('pdfjs-dist/legacy/build/pdf.mjs');
const mammoth = require('mammoth');

const getExtractFromPdf = async (buffer) => {
    const uint8Array = new Uint8Array(buffer);
    const pdf = await pdfJs.getDocument({data: uint8Array}).promise;
    let text = ''
    for(let i = 1; i<=pdf.numPages; i++){
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item) => item.str).join(" ") + "\n";
    }
    return text;
}

const getExtractFromDOCX = async (buffer) => {
    const result = await mammoth.extractRawText({buffer})
    return result.value;
}

const extractTextFromFile = (file) => {
        const fileBuffer = file.buffer;
        if(file.mimetype == 'application/pdf'){
            return getExtractFromPdf(fileBuffer);
        }

        if(file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
            return getExtractFromDOCX(fileBuffer);
        }
}

module.exports = { extractTextFromFile };
