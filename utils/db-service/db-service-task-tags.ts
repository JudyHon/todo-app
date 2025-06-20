import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import ITaskTags from "../../route/TodoApp/models/task-tags.model";
import { getDBConnection } from "./db-service-helper";

/**
 * Schema
 *
 * task_tags
 * +----+---------+--------+
 * | id | task_id | tag_id |
 * +----+---------+--------+
 * | PK | FK      | FK     |
 * +----+---------+--------+
 *
 */

const tableName = "tasks_tag";

export async function createTable(): Promise<void> {
  const db = await getDBConnection();
  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      task_id INTEGER NOT NULL,
      tag_id INTEGER,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
    );
  `;

  await db.runAsync(query);
}

export async function getAllItems(): Promise<ITaskTags[]> {
  const db = await getDBConnection();

  try {
    const items: ITaskTags[] = [];
    const results: ITaskTags[] = await db.getAllAsync(`
      SELECT
          task_id, tag_id
      FROM
          ${tableName}
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

export async function saveItems(
  task_id: number,
  tags_ids: number[]
): Promise<void> {
  const db = await getDBConnection();
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}( task_id, tag_id ) VALUES` +
    tags_ids.map((tag_id) => `('${task_id}', '${tag_id}')`).join(",");

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
