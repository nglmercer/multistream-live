// tasks.js
const StorageManager = require('../modules/StorageManager.js');

const taskStorage = new StorageManager('tasks.json', './data', true);
const taskTypes = ["overlay", "minecraft", "keypress", "timer"];

// Un plugin de Fastify es una función asíncrona que recibe la instancia de fastify
async function tasksRoutes(fastify, options) {

    // Middleware convertido a un hook 'preHandler' de Fastify
    const validateTaskType = async (request, reply) => {
        const { type } = request.params;
        if (!taskTypes.includes(type)) {
            // En los hooks, se detiene la ejecución enviando una respuesta
            reply.code(400).send({ error: "Invalid task type" });
        }
    };
    
    // Middleware convertido a un hook 'preHandler' de Fastify
    const validateTaskId = async (request, reply) => {
        if (!request.params.taskId) {
            reply.code(400).send({ error: "Task ID is required" });
        }
    };
    
    // Añadimos hooks a rutas específicas usando un objeto de configuración
    const routeOptionsWithValidation = (handler) => ({
        preHandler: [validateTaskType, validateTaskId],
        handler
    });

    const routeOptionsWithTypeValidation = (handler) => ({
        preHandler: [validateTaskType],
        handler
    });

    // Guardar nueva tarea
    fastify.post('/save/:type', routeOptionsWithTypeValidation(async (request, reply) => {
        const { type } = request.params;
        const taskData = request.body;
        if (!taskData || Object.keys(taskData).length === 0) {
            return reply.code(400).send({ error: "Task data cannot be empty" });
        }
        const newTask = taskStorage.addTask(type, taskData);
        reply.code(201).send({ message: "Task added successfully", task: newTask });
    }));

    // Obtener TODAS las tareas de un tipo
    fastify.get('/get/:type', routeOptionsWithTypeValidation(async (request, reply) => {
        const { type } = request.params;
        const tasks = taskStorage.getTasksByType(type);
        reply.code(200).send(tasks);
    }));

    // Obtener una tarea específica por ID
    fastify.get('/get/:type/:taskId', routeOptionsWithValidation(async (request, reply) => {
        const { type, taskId } = request.params;
        const task = taskStorage.getTaskById(type, taskId);
        if (task) {
            reply.code(200).send(task);
        } else {
            reply.code(404).send({ error: "Task not found" });
        }
    }));

    // Eliminar una tarea
    fastify.delete('/remove/:type/:taskId', routeOptionsWithValidation(async (request, reply) => {
        const { type, taskId } = request.params;
        const removed = taskStorage.removeTask(type, taskId);
        if (removed) {
            reply.code(200).send({ message: "Task removed successfully" });
        } else {
            reply.code(404).send({ error: "Task not found or already removed" });
        }
    }));

    // Marcar una tarea como completada
    fastify.put('/complete/:type/:taskId', routeOptionsWithValidation(async (request, reply) => {
        const { type, taskId } = request.params;
        const updatedTask = taskStorage.updateTaskCompletion(type, taskId, true);
        if (updatedTask) {
            reply.code(200).send({ message: "Task marked as complete", task: updatedTask });
        } else {
            reply.code(404).send({ error: "Task not found" });
        }
    }));

    // Marcar una tarea como incompleta
    fastify.put('/uncomplete/:type/:taskId', routeOptionsWithValidation(async (request, reply) => {
        const { type, taskId } = request.params;
        const updatedTask = taskStorage.updateTaskCompletion(type, taskId, false);
        if (updatedTask) {
            reply.code(200).send({ message: "Task marked as incomplete", task: updatedTask });
        } else {
            reply.code(404).send({ error: "Task not found" });
        }
    }));

    // Actualizar datos de una tarea
    fastify.put('/update/:type/:taskId', routeOptionsWithValidation(async (request, reply) => {
        const { type, taskId } = request.params;
        const updates = request.body;
        if (Object.keys(updates).length === 0) {
            return reply.code(400).send({ error: "Update data cannot be empty" });
        }
        delete updates.id;
        delete updates.completed;
        delete updates.createdAt;
        delete updates.updatedAt;
        const updatedTask = taskStorage.updateTaskData(type, taskId, updates);
        if (updatedTask) {
            reply.code(200).send({ message: "Task data updated successfully", task: updatedTask });
        } else {
            reply.code(404).send({ error: "Task not found" });
        }
    }));
}

module.exports = tasksRoutes;