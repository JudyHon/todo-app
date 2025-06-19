import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import ITodo from "../route/TodoApp/models/todo.model";

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
 * tags
 * +----+------+-------+
 * | id | name | color |
 * +----+------+-------+
 * | PK | text | text  |
 * +----+------+-------+
 *
 * task_tags
 * +----+---------+--------+
 * | id | task_id | tag_id |
 * +----+---------+--------+
 * | PK | FK      | FK     |
 * +----+---------+--------+
 */

const tasksTableName = "tasks";
const tagsTableName = "tags";
const taskTagsTableName = "tasks_tag";

export async function getDBConnection(): Promise<SQLiteDatabase> {
  return openDatabaseAsync("todo-data.db", { useNewConnection: true });
}

export async function createDBTable() {
  const db = await getDBConnection();

  const tasksQuery = `
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS ${tasksTableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      completed INTEGER NOT NULL,
      parent_id INTEGER,
      due_date TIMESTAMP,
      recurrence TEXT,
      FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `;

  const tagsQuery = `
    CREATE TABLE IF NOT EXISTS ${tagsTableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      completed INTEGER
    );
  `;

  const taskTagsQuery = `
    CREATE TABLE IF NOT EXISTS ${taskTagsTableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      task_id INTEGER NOT NULL,
      tag_id INTEGER,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `;

  await db.execAsync(tasksQuery);
  await db.runAsync(tagsQuery);
  await db.runAsync(taskTagsQuery);
}

export async function getDBItemByID(id: number): Promise<ITodo | null> {
  const db = await getDBConnection();

  try {
    const result: ITodo | null = await db.getFirstAsync(`
            SELECT 
                id, name, completed
            FROM
                ${tasksTableName}
            WHERE id = ${id}
        `);
    return result;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get todoItems !!!");
  }
}

export async function getDBItems(): Promise<ITodo[]> {
  const db = await getDBConnection();

  try {
    const todoItems: ITodo[] = [];
    const results: ITodo[] = await db.getAllAsync(`
            SELECT 
                id, name, completed
            FROM
                ${tasksTableName}
            ORDER BY id DESC
        `);
    for (const result of results) {
      todoItems.push(result);
    }
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get todoItems !!!");
  }
}

interface IMaxID {
  max_id: number;
}
export async function getLastInsertId(): Promise<number> {
  const db = await getDBConnection();
  const result = await db.getFirstAsync<IMaxID>(`
      SELECT MAX(id) AS max_id
      FROM ${tasksTableName}
     `);

  return result ? result?.max_id : 0;
}

export async function saveDBItems(todoItems: ITodo[]) {
  const db = await getDBConnection();
  console.log({ todoItems });
  const insertQuery =
    `INSERT OR REPLACE INTO ${tasksTableName}( id, name, completed ) VALUES` +
    todoItems
      .map((i) => `('${i.id}', '${i.name}', '${i.completed}')`)
      .join(",");

  return db.runAsync(insertQuery);
}

export async function deleteDBItem(id: number) {
  const db = await getDBConnection();
  const deleteQuery = `DELETE from ${tasksTableName} where rowid = ${id}`;
  await db.runAsync(deleteQuery);
}

export const deleteTable = async () => {
  const db = await getDBConnection();
  const query = `DROP TABLE ${tasksTableName}`;

  await db.runAsync(query);
};
