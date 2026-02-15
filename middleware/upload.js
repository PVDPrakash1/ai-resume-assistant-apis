const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)

    } else{
        cb(new Error("Only PDF and Docx types are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize : 5 * 1024 * 1024 //5 MB limit
    }
})

module.exports = upload;
