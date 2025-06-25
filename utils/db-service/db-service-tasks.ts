import ITask from "../../route/TodoApp/models/task.model";
import ITag from "../../route/TodoApp/models/tag.model";
import { getDBConnection } from "./db-service-helper";

/**
 * Schema
 *
 * tasks
 * +----+------+-----------+-----------+-----------+------------+
 * | id | name | completed | parent_id | due_date  | recurrence |
 * +----+------+-----------+-----------+-----------+------------+
 * | PK | text | integer   | FK/null   | timestamp | text       |
 * +----+------+-----------+-----------+-----------+------------+
 *
 *
 */

const tableName = "tasks";

export async function createTable(): Promise<void> {
  const db = await getDBConnection();
  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0,
      parent_id INTEGER,
      due_date TEXT,
      recurrence TEXT,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `;

  await db.execAsync(query);
}

export async function getItemByID(id: number): Promise<ITask | null> {
  const db = await getDBConnection();

  try {
    const result: ITask | null = await db.getFirstAsync(`
      SELECT 
          id, name, completed
      FROM
          ${tableName}
      WHERE id = ${id}
    `);
    return result;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get todoItems !!!");
  }
}

export async function getAllItems(): Promise<ITask[]> {
  const db = await getDBConnection();

  try {
    const mainTasksQuery = `
      SELECT id, name, completed, due_date
      FROM tasks
      WHERE parent_id IS NULL
      ORDER BY id DESC
    `;
    const subtasksQuery = `
      SELECT id, name, completed, parent_id
      FROM tasks
      WHERE parent_id IS NOT NULL
    `;
    const taskTagsQuery = `
      SELECT
       tasks_tag.task_id,
       tags.id AS tag_id,
       tags.name,
       tags.color
      FROM tasks_tag
      JOIN tags ON tasks_tag.tag_id = tags.id
    `;

    interface IMainTask {
      id: number;
      name: string;
      completed: number;
      parent_id: number;
    }

    interface ITaskTags {
      task_id: number;
      tag_id: number;
      name: string;
      color: string;
    }

    const mainTasks: IMainTask[] = await db.getAllAsync(mainTasksQuery);
    const subtasks: ITask[] = await db.getAllAsync(subtasksQuery);
    const taskTags: ITaskTags[] = await db.getAllAsync(taskTagsQuery);

    // === Build subtask Map
    interface ISubtaskMap {
      [key: string]: ITask[];
    }

    const subtaskMap: ISubtaskMap = {};
    subtasks.forEach((subtask) => {
      if (!subtaskMap[subtask.parent_id!]) {
        subtaskMap[subtask.parent_id!] = [];
      }
      subtaskMap[subtask.parent_id!].push(subtask);
      // }
    });

    // === Build tag Map ===

    interface ITagMap {
      [key: string]: ITag[];
    }

    const tagMap: ITagMap = {};
    taskTags.forEach((tag) => {
      if (!tagMap[tag.task_id]) {
        tagMap[tag.task_id] = [];
      }
      tagMap[tag.task_id].push({
        id: tag.tag_id,
        name: tag.name,
        color: tag.color,
      });
    });

    // === Group all main tasks ===
    const allTasks = mainTasks.map((task) => ({
      ...task,
      subtasks: subtaskMap[task.id] || [],
      tags: tagMap[task.id] || [],
    }));

    return allTasks;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get items !!!");
  }
}

interface IMaxID {
  max_id: number;
}
export async function getLastInsertId(): Promise<number> {
  const db = await getDBConnection();
  const result = await db.getFirstAsync<IMaxID>(`
    SELECT MAX(id) AS max_id
    FROM ${tableName}
  `);

  return result ? result?.max_id : 0;
}

export async function updateItem(id: number): Promise<void> {
  const db = await getDBConnection();
  const query = `
    UPDATE tasks
    SET completed = NOT completed
    WHERE id = ${id}
  `;
  await db.execAsync(query);
}

export async function saveItem(
  todoItem: ITask,
  subtasks?: ITask[]
): Promise<void> {
  const db = await getDBConnection();
console.log(todoItem);

  const insertQuery =
    `
    INSERT INTO ${tableName}( id, name, completed, due_date ) VALUES` +
    `('${todoItem.id}', '${todoItem.name}', '${todoItem.completed}', '${todoItem.due_date}')`;

  await db.execAsync(insertQuery);

  const parent_id = todoItem.id;

  if (subtasks && subtasks.length > 0) {
    const query =
      `
      INSERT INTO ${tableName}( id, name, completed, parent_id ) VALUES` +
      subtasks
        .map(
          (i) => `('${i.id}', '${i.name}', '${i.completed}', '${parent_id}')`
        )
        .join(",");
    await db.execAsync(query);
  }
}

export async function deleteItem(id: number): Promise<void> {
  const db = await getDBConnection();
  const deleteQuery = `
    DELETE FROM ${tableName}
    WHERE id = ${id}
  `;
  await db.runAsync(deleteQuery);
}

export async function deleteTable(): Promise<void> {
  const db = await getDBConnection();
  const query = `DROP TABLE ${tableName}`;
  await db.runAsync(query);
}
