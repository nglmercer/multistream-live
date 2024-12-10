# Node + Express Service Starter

This is a simple API sample in Node.js with express.js 

## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```

## demo in livesocket.onrender.com
i hosted this with onrender deploy


## alert api 
este es un ejemplo de alerta que recibe para poder crear los elementos
```json5
{
    "template": "multi-grid",
    "content": "John Doe donated $50! Thank you!",
    "duration": 5000,
    "src": [
        {
            "nombre": "imagen1.png",
            "path": "https://picsum.photos/200/200",
            "mediaType": "image/png",
        },
        {
            "nombre": "imagen2.jpg",
            "path": "c:/user/example/imagen2.jpg",
            "mediaType": "image/jpg",
        },
        {
            "nombre": "video.mp4",
            "path": "c:/user/example/video.mp4",
            "mediaType": "video/mp4",
        },
        {
            "nombre": "audio.mp3",
            "path": "c:/user/example/audio.mp3",
            "mediaType": "audio/mp3",
        },
        
        ]
}
// si el template es texto ignoramos el src, si es que en el template no se usa
```json5
{
    "template": "text",
    "content": "John Doe donated $50! Thank you!",
    "duration": 5000,
    "src": [{"example": "el contenido sera ignorado"}]
}
```
