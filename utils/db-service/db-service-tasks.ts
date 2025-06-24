import ITodo from "../../route/TodoApp/models/todo.model";
import ITag from "../../route/TodoApp/models/tag.model";
import {
  disableForeignKeys,
  enableForeignKeys,
  getDBConnection,
} from "./db-service-helper";
import ISubTask from "../../route/TodoApp/models/sub-task.model";

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
      completed INTEGER NOT NULL,
      parent_id INTEGER,
      due_date TIMESTAMP,
      recurrence TEXT,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `;

  await db.execAsync(query);
}

export async function getItemByID(id: number): Promise<ITodo | null> {
  const db = await getDBConnection();

  try {
    const result: ITodo | null = await db.getFirstAsync(`
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

export async function getAllItems(): Promise<ITodo[]> {
  const db = await getDBConnection();

  try {
    const mainTasksQuery = `
      SELECT id, name, completed
      FROM tasks
      WHERE parent_id IS NULL
      ORDER BY id DESC
    `;
    const subTasksQuery = `
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
    }

    interface ITaskTags {
      task_id: number;
      tag_id: number;
      name: string;
      color: string;
    }

    const mainTasks: IMainTask[] = await db.getAllAsync(mainTasksQuery);
    const subTasks: ISubTask[] = await db.getAllAsync(subTasksQuery);
    const taskTags: ITaskTags[] = await db.getAllAsync(taskTagsQuery);

    // === Build subTask Map
    interface ISubTaskMap {
      [key: string]: ISubTask[];
    }

    const subTaskMap: ISubTaskMap = {};
    subTasks.forEach((subTask) => {
      if (!subTaskMap[subTask.parent_id]) {
        subTaskMap[subTask.parent_id] = [];
      }
      subTaskMap[subTask.parent_id].push(subTask);
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
      subtasks: subTaskMap[task.id] || [],
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

export async function saveItems(
  todoItems: ITodo[],
  subTasks?: ISubTask[]
): Promise<void> {
  const db = await getDBConnection();
  await disableForeignKeys(db);
  const insertQuery =
    `
    INSERT OR REPLACE INTO ${tableName}( id, name, completed ) VALUES` +
    todoItems
      .map((i) => `('${i.id}', '${i.name}', '${i.completed}')`)
      .join(",");

  await db.execAsync(insertQuery);

  const parent_id = todoItems[0].id;

  if (subTasks && subTasks?.length > 0) {
    const query =
      `
      INSERT OR REPLACE INTO ${tableName}( id, name, completed, parent_id ) VALUES` +
      subTasks
        .map(
          (i) => `('${i.id}', '${i.name}', '${i.completed}', '${parent_id}')`
        )
        .join(",");
    await db.execAsync(query);
  }

  await enableForeignKeys(db);
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
