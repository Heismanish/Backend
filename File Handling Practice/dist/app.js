"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = require("fs");
const PORT = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Defining storage location for the uploaded files:
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + "-" + Date.now());
    },
});
// Middlewares:
const upload = (0, multer_1.default)({ storage }); // multer middleware initailized
// Routes
app.get("/", (req, res) => {
    res.status(200).send("Hello World I am home");
});
app.get("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield promises_1.default.readFile("data.txt", "utf-8");
        res.send(data);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
    }
}));
app.post("/data", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    try {
        const data = yield promises_1.default.writeFile("output.txt", message, "utf-8");
        res.status(200).send(data);
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.get("/files", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield promises_1.default.readdir("./");
        res.json({ files });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.post("/upload", upload.single("file"), (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            console.error("File wasn't found");
            return res.status(404).send("File wasn't found");
        }
        res.send("File uploaded successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
});
app.get("/download/:filename", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    try {
        res.download(`./${filename}`, (err) => {
            if (err) {
                console.error(err);
                res.status(400).send("File not found");
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.delete(`/file/:filename`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filename = req.params.filename;
    try {
        yield promises_1.default.unlink(`./${filename}`);
        res.status(204).send("File Deleted");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.put("/file/:filename", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filename = req.params.filename;
        const data = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            
        </body>
        </html>`;
        yield fs_1.promises.writeFile(`./${filename}`, data, { flag: "w" }); // Using type assertion here
        console.log(`File "${filename}" updated`);
        res.status(200).send("File updated");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.post("/file/move", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldFileName, newFileName } = req.body;
    try {
        yield promises_1.default.rename(`./${oldFileName}`, `./${newFileName}`);
        console.log(`File "${oldFileName}" renamed to "${newFileName}"`);
        res.status(200).send("File renamed");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server error");
    }
}));
app.listen(3000, () => {
    console.log(`Server started at port ${PORT} `);
});
