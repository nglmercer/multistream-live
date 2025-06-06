const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const essapp = express();
const tasksRouter = require('./tasks.js');
const networkRouter = require('./networkRouter.js');

essapp.use(cors());
essapp.use(express.json());

// Esta URI es para express.static, que sirve archivos desde './public'
const publicUri = path.join(__dirname, '../public');
console.log('Serving static files from:', publicUri);
essapp.use(express.static(publicUri)); // Esto debe ir ANTES de tu ruta /media/* si quieres que tenga prioridad para rutas que no coincidan con /media/*

const httpServer = http.createServer(essapp);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = parseInt(process.env.PORT) || 9001;

essapp.get('/media/*', (req, res) => {
    const relativePathFromUrl = decodeURIComponent(req.params[0]);
    // Construye la ruta absoluta en el servidor Linux
    // Anteponemos '/' para que path.resolve entienda que es desde la raíz del sistema de archivos.
    const filePath = path.resolve('/', relativePathFromUrl);

    console.log(`Request for: ${req.url}`);
    console.log(`Attempting to serve file from absolute path: ${filePath}`); // Log para depuración

    const extname = path.extname(filePath).toLowerCase();
    const imageobj = {
      '.jpg': 'jpeg',
      '.jpeg': 'jpeg',
      '.png': 'png',
      '.gif': 'gif',
      '.webp': 'webp',
      '.svg': 'svg+xml',
      '.bmp': 'bmp',
      '.ico': 'x-icon',
      '.tiff': 'tiff',
      '.avif': 'avif',
      '.apng': 'apng'
    };

    fs.stat(filePath, (err, stats) => {
      if (err) { // Si hay error, puede ser que no exista o no haya permisos
        console.error(`Error accessing file ${filePath}:`, err);
        if (err.code === 'ENOENT') {
          return res.status(404).send('File not found');
        }
        return res.status(500).send('Error accessing file');
      }

      if (!stats.isFile()) {
        console.warn(`Path ${filePath} is not a file.`);
        return res.status(404).send('Path is not a file');
      }

      if (extname === '.mp3' || extname === '.wav') {
        res.setHeader('Content-Type', 'audio/' + extname.slice(1));
      } else if (extname === '.mp4' || extname === '.webm') {
        res.setHeader('Content-Type', 'video/' + extname.slice(1));
      } else if (imageobj[extname]) {
        res.setHeader('Content-Type', 'image/' + imageobj[extname]);
      } else {
        console.warn(`Unsupported file type: ${extname} for file ${filePath}`);
        return res.status(415).send('Unsupported file type');
      }

      const fileStream = fs.createReadStream(filePath);
      fileStream.on('error', (streamErr) => {
        console.error(`Error streaming file ${filePath}:`, streamErr);
        res.status(500).send('Error streaming file');
      });
      fileStream.pipe(res);
    });
  });

essapp.use('/tasks', tasksRouter);
essapp.use('/api/network', networkRouter);
// Asegúrate de que httpServer.listen se llama aquí si este es tu archivo principal
// Si este archivo es importado por otro, el listen estará en el archivo principal.
// Ejemplo (si este es el archivo principal):
/*
httpServer.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
*/

module.exports = { io, essapp, httpServer, port };