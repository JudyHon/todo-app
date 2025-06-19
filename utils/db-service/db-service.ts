import * as TaskDBService from "./db-service-tasks";
import * as TagDBService from "./db-service-tags";
import * as TaskTagsDBService from "./db-service-task-tags";
import ITodo from "../../route/TodoApp/models/todo.model";
import ITag from "../../route/TodoApp/models/tag.model";

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

export async function saveTasks(tasks: ITodo[]): Promise<void> {
  await TaskDBService.saveItems(tasks);
}

export async function getAllTasks(): Promise<ITodo[]> {
  const results = await TaskDBService.getAllItems();
  return results;
}

export async function getTaskById(id: number): Promise<ITodo | null> {
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

export async function deleteTag(id: number): Promise<void> {
  await TagDBService.deleteItem(id);
}
