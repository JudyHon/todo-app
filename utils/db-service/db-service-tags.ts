import { getDBConnection } from "./db-service-helper";
import ITag from "../../route/TodoApp/models/tag.model";

/**
 * Schema

 * tags
 * +----+------+-------+
 * | id | name | color |
 * +----+------+-------+
 * | PK | text | text  |
 * +----+------+-------+
 *
 */

const tableName = "tags";

export async function createTable(): Promise<void> {
  const db = await getDBConnection();

  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `;

  await db.runAsync(query);
}

export async function getAllItems(): Promise<ITag[]> {
  const db = await getDBConnection();

  try {
    const items: ITag[] = [];
    const results: ITag[] = await db.getAllAsync(`
      SELECT 
          id, name, color
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

export async function saveItems(todoItems: ITag[]): Promise<void> {
  const db = await getDBConnection();
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}( id, name, color ) VALUES` +
    todoItems.map((i) => `('${i.id}', '${i.name}', '${i.color}')`).join(",");

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
