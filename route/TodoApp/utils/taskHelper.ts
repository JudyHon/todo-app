import * as dbService from "../../../utils/db-service/db-service";
import { DEFAULT_TAGS, DEFAULT_TASKS } from "../constants/constants";

// === Control Tasks ===
export async function addTask(
  name: string,
  tags: number[],
  subtasks: string[],
  due_date: Date | null,
  callback?: () => void
): Promise<void> {
  try {
    const newId = (await dbService.getLastInsertTaskId()) + 1;
    const newDate = due_date ? due_date.toISOString().split("T")[0] : due_date;
    const newTask = {
      id: newId,
      name,
      completed: 0,
      parent_id: null,
      due_date: newDate,
    };
    const newSubtasks = subtasks.map((value, index) => ({
      id: newId + index + 1,
      name: value,
      completed: 0,
      parent_id: newId,
    }));

    await dbService.saveTask(newTask, newSubtasks);
    await dbService.saveTaskTags(newId, tags);

    if (callback) callback();
  } catch (error) {
    console.error(error);
  }
}

export async function toggleTask(
  id: number,
  callback?: () => void
): Promise<void> {
  try {
    await dbService.updateTask(id);
    if (callback) callback();
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTask(
  id: number,
  callback?: () => void
): Promise<void> {
  try {
    await dbService.deleteTask(id);
    if (callback) callback();
  } catch (error) {
    console.error(error);
  }
}

// === Init Data ===
export async function initData(): Promise<void> {
  // await dbService.deleteTables();
  await dbService.createTables(); // Create all database

  await dbService.saveTags(DEFAULT_TAGS);

  await initTasks();
}

async function initTasks(): Promise<void> {
  for (const task of DEFAULT_TASKS) {
    await dbService.saveTask(task); // Save the default tasks
    if (task.tags.length > 0) {
      const tagsIds = task.tags.map((value) => value.id);
      await dbService.saveTaskTags(task.id, tagsIds);
    }
  }
}
