import { PDFParse } from "pdf-parse";
import { extractRawText } from 'mammoth';

async function parsePDF(file) {
  const parser = new PDFParse(file);
  const data = await parser.getText();
  const info = await parser.getInfo({ parsePageInfo: true });
  return { text: data?.text || "", info, numpages: info?.pages || 0 };
}

const getExtractFromDOCX = async (buffer) => {
    const result = await extractRawText({ buffer })
    return result.value;
}

const extractTextFromFile = async (file) => {
    const fileBuffer = file.buffer;
    const pdfContent = "";
    if (file.mimetype == 'application/pdf') {
        const unit8ArrayData = new Uint8Array(fileBuffer);
        const {text, numpages, info } = await parsePDF(unit8ArrayData);
        // for (let pageNo = 1; pageNo <= numpages; pageNo += 1) {
        //     const content = text.pages[pageNo].text;
        //     pdfContent += content;
        // }
        // console.log(pdfContent);
        return text;
    }

    if (file.mimetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        return getExtractFromDOCX(fileBuffer);
    }
}

export  { extractTextFromFile };
