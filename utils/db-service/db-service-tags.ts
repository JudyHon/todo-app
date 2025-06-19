import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
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

export async function getConnection(): Promise<SQLiteDatabase> {
  return openDatabaseAsync("todo-data.db", { useNewConnection: true });
}

export async function createTable() {
  const db = await getConnection();

  const tagsQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL
    );
  `;

  await db.runAsync(tagsQuery);
}

export async function getItems(): Promise<ITag[]> {
  const db = await getConnection();

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
  const db = await getConnection();
  const result = await db.getFirstAsync<IMaxID>(`
      SELECT MAX(id) AS max_id
      FROM ${tableName}
     `);

  return result ? result?.max_id : 0;
}

export async function saveItems(todoItems: ITag[]) {
  const db = await getConnection();
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}( id, name, color ) VALUES` +
    todoItems.map((i) => `('${i.id}', '${i.name}', '${i.color}')`).join(",");

  return db.runAsync(insertQuery);
}

export async function deleteDBItem(id: number) {
  const db = await getConnection();
  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  await db.runAsync(deleteQuery);
}

export const deleteTable = async () => {
  const db = await getConnection();
  const query = `DROP TABLE ${tableName}`;

  await db.runAsync(query);
};
