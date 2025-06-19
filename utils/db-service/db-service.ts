import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import * as TaskDBService from "./db-service-tasks";
import * as TagDBService from "./db-service-tags";
import * as TaskTagsDBService from "./db-service-task-tags";
import ITodo from "../../route/TodoApp/models/todo.model";

export async function getDBConnection(): Promise<SQLiteDatabase> {
  return openDatabaseAsync("todo-data.db", { useNewConnection: true });
}

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
  const db = await getDBConnection();
  await TaskDBService.deleteItem(id);
}
