const express = require('express');
const router = express.Router();
const StorageManager = require('../modules/StorageManager.js'); // Ajusta la ruta si es necesario

// Usamos la misma instancia de StorageManager
const taskStorage = new StorageManager('store.json', './data', true);
const taskTypes = ["overlay", "minecraft", "keypress", "timer"];

// Middleware para validar el tipo de tarea
const validateTaskType = (req, res, next) => {
    const type = req.params.type;
    if (!taskTypes.includes(type)) {
        return res.status(400).send({ error: "Invalid task type" });
    }
    next();
};

// Middleware para validar taskId (opcional, pero buena práctica)
const validateTaskId = (req, res, next) => {
    if (!req.params.taskId) {
        return res.status(400).send({ error: "Task ID is required" });
    }
    next();
};

// Guardar nueva tarea (AÑADIR a la lista)
router.post('/save/:type', validateTaskType, async (req, res) => {
    const type = req.params.type;
    const taskData = req.body;

    if (Object.keys(taskData).length === 0) {
        return res.status(400).send({ error: "Task data cannot be empty" });
    }

    const newTask = taskStorage.addTask(type, taskData);
    res.status(201).send({ message: "Task added successfully", task: newTask });
});

// Obtener TODAS las tareas de un tipo
router.get('/get/:type', validateTaskType, async (req, res) => {
    const type = req.params.type;
    const tasks = taskStorage.getTasksByType(type);
    res.status(200).send(tasks); // Devuelve un array, puede estar vacío
});

// Obtener una tarea específica por ID
router.get('/get/:type/:taskId', validateTaskType, validateTaskId, async (req, res) => {
    const { type, taskId } = req.params;
    const task = taskStorage.getTaskById(type, taskId);
    if (task) {
        res.status(200).send(task);
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});

// Eliminar una tarea
router.delete('/remove/:type/:taskId', validateTaskType, validateTaskId, async (req, res) => {
    const { type, taskId } = req.params;
    const removed = taskStorage.removeTask(type, taskId);
    if (removed) {
        res.status(200).send({ message: "Task removed successfully" });
    } else {
        res.status(404).send({ error: "Task not found or already removed" });
    }
});

// Marcar una tarea como completada
router.patch('/complete/:type/:taskId', validateTaskType, validateTaskId, async (req, res) => {
    const { type, taskId } = req.params;
    const updatedTask = taskStorage.updateTaskCompletion(type, taskId, true);
    if (updatedTask) {
        res.status(200).send({ message: "Task marked as complete", task: updatedTask });
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});

// Marcar una tarea como incompleta
router.patch('/uncomplete/:type/:taskId', validateTaskType, validateTaskId, async (req, res) => {
    const { type, taskId } = req.params;
    const updatedTask = taskStorage.updateTaskCompletion(type, taskId, false);
    if (updatedTask) {
        res.status(200).send({ message: "Task marked as incomplete", task: updatedTask });
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});

// Actualizar datos de una tarea (ejemplo, podrías querer ser más específico con los campos)
router.put('/update/:type/:taskId', validateTaskType, validateTaskId, async (req, res) => {
    const { type, taskId } = req.params;
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        return res.status(400).send({ error: "Update data cannot be empty" });
    }
     // Prevenir que se modifiquen campos protegidos si se envían en el body
    delete updates.id;
    delete updates.completed; // La completitud se maneja con otros endpoints
    delete updates.createdAt;
    delete updates.updatedAt;


    const updatedTask = taskStorage.updateTaskData(type, taskId, updates);
    if (updatedTask) {
        res.status(200).send({ message: "Task data updated successfully", task: updatedTask });
    } else {
        res.status(404).send({ error: "Task not found" });
    }
});


module.exports = router;