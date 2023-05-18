import { RequestHandler } from "express";
import TaskModel from "../models/task"
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getTasks: RequestHandler = async (req, res, next) => {
    try {
        const tasks = await TaskModel.find().exec();
        res.status(200).json(tasks)

    } catch (error) {
        next(error);
    }
};

interface CreateNoteBody {
    taskName?: string,
    isImportant?: boolean
}

export const createTask: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const taskName = req.body.taskName;
    const isImportant = req.body.isImportant

    try {

        //check if taskName is defined
        if (!taskName) {
            throw createHttpError(400, "Task must have a name")
        }

        const newTask = await TaskModel.create({
            name: taskName,
            isImportant: isImportant
        });
        res.status(201).json(newTask);
    } catch (error) {
        next(error)
    }
};

export const getTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId;

    try {
        // check if valid id signature
        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }

        const task = await TaskModel.findById(taskId).exec();

        // check if task null or undefined
        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

// if taskId is not specified we would not get to required endpoint anyway
// so it can remain not nullable
interface UpdateTaskParams {
    taskId: string,
}

interface UpdateTaskBody {
    taskName?: string,
    isCompleted?: boolean,
    isImportant?: boolean,
}

export const updateTask: RequestHandler<UpdateTaskParams, unknown, UpdateTaskBody, unknown> = async (req, res, next) => {
    const taskId = req.params.taskId;
    const newTask = req.body.taskName
    const isCompleted = req.body.isCompleted
    const isImportant = req.body.isImportant


    try {
        // check if valid id signature
        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }
        //check if taskName is defined
        if (!newTask) {
            throw createHttpError(400, "Task must have a name")
        }

        const task = await TaskModel.findById(taskId).exec()

        // check if task null or undefined
        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        task.name = newTask;
        task.isCompleted = (isCompleted === true) ? true : false
        task.isImportant = (isImportant === true) ? true : false

        const updatedTask = await task.save();

        res.status(200).json(updatedTask)
    } catch (error) {
        next(error);
    }
};


export const deleteTask: RequestHandler = async (req, res, next) => {
    const taskId = req.params.taskId

    try {
        // check if valid id signature
        if (!mongoose.isValidObjectId(taskId)) {
            throw createHttpError(400, "Invalid task id");
        }

        const task = await TaskModel.findById(taskId).exec()

        // check if task null or undefined
        if (!task) {
            throw createHttpError(404, "Task not found");
        }

        await task.deleteOne();

        // using sendstatus because we dont need to return anything except status
        res.sendStatus(204);

    } catch (error) {
        next(error);
    }
}