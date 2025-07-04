import ITag from "./tag.model";

interface ITask {
  id: number;
  name: string;
  completed: number;
  due_date?: Date | null;
  parent_id: number | null;
  tags?: ITag[];
  subtasks?: ITask[];
  category?: string;
}

export default ITask;
