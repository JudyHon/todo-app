import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";
import ITodo from "../route/TodoApp/models/todo.model";

const tableName = "todoData";

export async function getDBConnection() {
  return openDatabaseAsync("todo-data.db", { useNewConnection: true });
}

export const createDBTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        text TEXT NOT NULL,
        completed INTEGER
    );`;

  await db.runAsync(query);
};

export async function getDBItems(db: SQLiteDatabase): Promise<ITodo[]> {
  try {
    const todoItems: ITodo[] = [];
    const results: ITodo[] = await db.getAllAsync(`
            SELECT 
                rowid as id, text, completed
            FROM
                ${tableName}
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

export async function saveDBItems(db: SQLiteDatabase, todoItems: ITodo[]) {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(rowid, text, completed) values` +
    todoItems.map((i) => `(${i.id}, '${i.text}', '${i.completed}')`).join(",");

  return db.runAsync(insertQuery);
}

export async function deleteDBItem(db: SQLiteDatabase, id: number) {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.runAsync(deleteQuery);
}

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP TABLE ${tableName}`;

  await db.runAsync(query);
};
