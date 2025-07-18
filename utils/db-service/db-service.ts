import * as TaskDBService from "./db-service-tasks";
import * as TagDBService from "./db-service-tags";
import * as TaskTagsDBService from "./db-service-task-tags";
import ITask from "../../route/TodoApp/models/task.model";
import ITag from "../../route/TodoApp/models/tag.model";
import ITaskTags from "../../route/TodoApp/models/task-tags.model";

export async function createTables(): Promise<void> {
  await TaskDBService.createTable();
  await TagDBService.createTable();
  await TaskTagsDBService.createTable();
}

export async function deleteTables(): Promise<void> {
  await TaskDBService.deleteTable();
  await TagDBService.deleteTable();
  await TaskTagsDBService.deleteTable();
}

// === TASK RELATED ===

export async function updateTask(id: number) {
  await TaskDBService.updateItem(id);
}

export async function saveTask(task: ITask, subtask?: ITask[]): Promise<void> {
  await TaskDBService.saveItem(task, subtask);
}

export async function getAllTasks(): Promise<ITask[]> {
  const results = await TaskDBService.getAllItems();
  return results;
}

export async function getAllTasksByDate(): Promise<Record<string, ITask[]>> {
  const tasks = await TaskDBService.getAllItems();
  const results: Record<string, ITask[]> = {};

  tasks.forEach((task) => {
    const category = task.category!;
    if (!results[category]) {
      results[category] = [];
    }
    results[category].push(task);
  });

  return results;
}

export async function getTaskById(id: number): Promise<ITask | null> {
  const result = await TaskDBService.getItemByID(id);
  return result;
}

export async function getLastInsertTaskId(): Promise<number> {
  const id = await TaskDBService.getLastInsertId();
  return id;
}

export async function deleteTask(id: number): Promise<void> {
  await TaskDBService.deleteItem(id);
}

// === TAG RELATED ===

export async function saveTags(tasks: ITag[]): Promise<void> {
  await TagDBService.saveItems(tasks);
}

export async function getAllTags(): Promise<ITag[]> {
  const results = await TagDBService.getAllItems();
  return results;
}

export async function getLastInsertTagId(): Promise<number> {
  const id = await TagDBService.getLastInsertId();
  return id;
}

export async function deleteTag(id: number): Promise<void> {
  await TagDBService.deleteItem(id);
}

// === TASK-TAGS RELATED ===

export async function saveTaskTags(
  task_id: number,
  tags_ids: number[]
): Promise<void> {
  if (tags_ids.length > 0) {
    await TaskTagsDBService.saveItems(task_id, tags_ids);
  }
}

// Debug Purpose
export async function getAllTaskTags(): Promise<ITaskTags[]> {
  const results = await TaskTagsDBService.getAllItems();
  return results;
}
