import ITodo from "../../route/TodoApp/models/todo.model";
import ITag from "../../route/TodoApp/models/tag.model";
import {
  disableForeignKeys,
  enableForeignKeys,
  getDBConnection,
} from "./db-service-helper";

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
    const items: ITodo[] = [];
    const results: Array<any> = await db.getAllAsync(`
      SELECT 
        tasks.id,
        tasks.name,
        tasks.completed,
        tasks.due_date,
        json_group_array(
          CASE
            WHEN tags.id IS NOT NULL
            THEN json_object('id', tags.id, 'name', tags.name, 'color', tags.color)
          END
          ) AS tags
      FROM
          ${tableName}
      LEFT JOIN tasks_tag ON tasks.id = tasks_tag.task_id
      LEFT JOIN tags ON tags.id = tasks_tag.tag_id
      GROUP BY tasks.id
      ORDER BY task_id DESC
    `);

    for (const result of results) {
      const rawTags = JSON.parse(result.tags);
      const tags = rawTags.filter((tag: ITag | null) => tag !== null);
      const parsedResult = { ...result, tags };
      items.push(parsedResult);
    }
    items.sort((a, b) => b.id - a.id);
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
  await disableForeignKeys(db);
  const insertQuery =
    `
    INSERT OR REPLACE INTO ${tableName}( id, name, completed ) VALUES` +
    todoItems
      .map((i) => `('${i.id}', '${i.name}', '${i.completed}')`)
      .join(",");

  await db.execAsync(insertQuery);

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
