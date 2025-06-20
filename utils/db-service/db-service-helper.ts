import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export async function getDBConnection(): Promise<SQLiteDatabase> {
  const db = await openDatabaseAsync("todo-data.db", {
    useNewConnection: true,
  });

  enableForeignKeys(db);

  return db;
}

export async function enableForeignKeys(db: SQLiteDatabase): Promise<void> {
  const query = `PRAGMA foreign_keys = ON`;
  await db.runAsync(query);
}

export async function disableForeignKeys(db: SQLiteDatabase): Promise<void> {
  const query = `PRAGMA foreign_keys = OFF`;
  await db.runAsync(query);
}
