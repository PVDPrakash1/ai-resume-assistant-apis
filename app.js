const express = require('express');
const app = express(); 
const cors = require("cors");
const upload = require('./middleware/upload.js');
const { extractTextFromFile } = require('./utils/textExtraction.js');
const { getResumeImprovements } = require("./utils/aiService.js")

app.use(cors({ origin : 'https://pvdprakash.com'}));

app.get("/", (req, res) => {
    res.send('<h3>Welcome to AI Resume Assistant</h3>');
})

app.post("/analyze-resume", upload.single("file"), async (req, res) => {
    const file = req.file;
    const jobDescription  = req.body.job_description;
    
    if (!file || !jobDescription) {
        res.status(400).json({'message' : 'Resume and Job Description both are required'})
    } else {
        const resumeText = await extractTextFromFile(file);
        const cleanResumeText = resumeText.replace(/[^a-z0-9\s]/g, " ");
        const resumekeywords = cleanResumeText.split(" ");
        const keywords = jobDescription.split(" ");
        const stopWords = [
  "the","and","to","in","of","for","with","on","at",
  "a","an","is","are","as","by","from","this","that",
  "years","year","experience","worked","working",
  "company","role","position","education","degree",
  "university","college","school","bachelor","master",
  "name","email","phone","address"
];
        let matchedSkills = [];
        let missedSkills = [];
        keywords.forEach((keyword) => {
            if(keyword && !stopWords.includes(keyword) && keyword.length > 3){
                if(resumekeywords.includes(keyword)){
                    matchedSkills.push(keyword);  
                }else{
                    missedSkills.push(keyword);
                }
            }
        })
        const matchedScore = (matchedSkills.length/keywords.length) * 100;
        getResumeImprovements(resumeText, jobDescription, missedSkills).then((aiResponse) => {
            res.send({
            'success': true,
            'aiSuggestions': aiResponse,
            'fileName': file.originalname, 
            'score': Math.round(matchedScore * 10) / 10,
            'matchedSkills': matchedSkills,
            'missedSkills': missedSkills, 
            'resumeLength': resumeText.length, 
            'jobDescriptionLength': jobDescription.length,
        });
        });
        
    }
})


app.listen(8000, () =>{
    console.log('Server Started');
})