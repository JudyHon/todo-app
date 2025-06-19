import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import ITodo from "../../route/TodoApp/models/todo.model";
// import { getDBConnection } from "./db-service";

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

export async function getDBConnection(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync("todo-data.db", {
    useNewConnection: true,
  });
  return db;
}

export async function createTable(): Promise<void> {
  const db = await getDBConnection();
  const query = `
    PRAGMA foreign_keys = ON;
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
    const items: ITodo[] = [];
    const results: ITodo[] = await db.getAllAsync(`
            SELECT 
                id, name, completed
            FROM
                ${tableName}
            ORDER BY id DESC
        `);

    for (const result of results) {
      items.push(result);
    }
    return items;
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

export async function saveItems(todoItems: ITodo[]): Promise<void> {
  const db = await getDBConnection();
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}( id, name, completed ) VALUES` +
    todoItems
      .map((i) => `('${i.id}', '${i.name}', '${i.completed}')`)
      .join(",");

  await db.runAsync(insertQuery);
}

export async function deleteItem(id: number): Promise<void> {
  const db = await getDBConnection();
  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  await db.runAsync(deleteQuery);
}

export async function deleteTable(): Promise<void> {
  const db = await getDBConnection();
  const query = `DROP TABLE ${tableName}`;
  await db.runAsync(query);
}
