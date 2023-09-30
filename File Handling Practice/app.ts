import express, { Request, Response } from "express";
import fs from "fs/promises";
import multer from "multer";
import { promises as fsPromises } from "fs";

const PORT = 3000;

const app = express();
app.use(express.json());

// Defining storage location for the uploaded files:
const storage = multer.diskStorage({
	destination: (req: Request, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req: Request, file, cb) => {
		cb(null, file.filename + "-" + Date.now());
	},
});

// Middlewares:
const upload = multer({ storage }); // multer middleware initailized

// Routes
app.get("/", (req: Request, res: Response) => {
	res.status(200).send("Hello World I am home");
});

app.get("/data", async (req: Request, res: Response) => {
	try {
		const data = await fs.readFile("data.txt", "utf-8");
		res.send(data);
	} catch (error) {
		console.log(error);
		res.status(500).send("Internal server error");
	}
});

app.post("/data", async (req: Request, res: Response) => {
	const { message } = req.body;
	try {
		const data = await fs.writeFile("output.txt", message, "utf-8");
		res.status(200).send(data);
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.get("/files", async (req: Request, res: Response) => {
	try {
		const files = await fs.readdir("./");
		res.json({ files });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
	try {
		const file = req.file;
		if (!file) {
			console.error("File wasn't found");
			return res.status(404).send("File wasn't found");
		}
		res.send("File uploaded successfully");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.get("/download/:filename", async (req: Request, res: Response) => {
	const filename = req.params.filename;
	try {
		res.download(`./${filename}`, (err) => {
			if (err) {
				console.error(err);
				res.status(400).send("File not found");
			}
		});
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.delete(`/file/:filename`, async (req: Request, res: Response) => {
	const filename = req.params.filename;
	try {
		await fs.unlink(`./${filename}`);
		res.status(204).send("File Deleted");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.put("/file/:filename", async (req: Request, res: Response) => {
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

		await (fsPromises as any).writeFile(`./${filename}`, data, { flag: "w" }); // Using type assertion here
		console.log(`File "${filename}" updated`);
		res.status(200).send("File updated");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.post("/file/move", async (req: Request, res: Response) => {
	const { oldFileName, newFileName } = req.body;
	try {
		await fs.rename(`./${oldFileName}`, `./${newFileName}`);
		console.log(`File "${oldFileName}" renamed to "${newFileName}"`);
		res.status(200).send("File renamed");
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server error");
	}
});

app.listen(3000, () => {
	console.log(`Server started at port ${PORT} `);
});
