const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const essapp = express();
essapp.use(cors());
const uri = path.join(__dirname, '../public');
console.log(uri);
const httpServer = http.createServer(essapp);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
const port = parseInt(process.env.PORT) || 9001;
essapp.use(express.static(uri));
essapp.get('/media/*', (req, res) => {
    const requestedPath = decodeURIComponent(req.params[0]);
    const filePath = path.resolve(requestedPath);
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
      if (err || !stats.isFile()) {
        return res.status(404).send('File not found');
      }
  
      if (extname === '.mp3' || extname === '.wav') {
        res.setHeader('Content-Type', 'audio/' + extname.slice(1));
      } else if (extname === '.mp4' || extname === '.webm') {
        // Para videos, verificar que estén en formato compatible
        res.setHeader('Content-Type', 'video/' + extname.slice(1));
      } else if (imageobj[extname]) {
        res.setHeader('Content-Type', 'image/' + imageobj[extname]);
      } else {
        return res.status(415).send('Unsupported file type');
      }
  
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    });
  });
module.exports = { io, essapp, httpServer,port };