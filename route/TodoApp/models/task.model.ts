import ITag from "./tag.model";

interface ITask {
  id: number;
  name: string;
  completed: number;
  due_date?: string | null;
  parent_id: number | null;
  tags?: ITag[];
  subtasks?: ITask[];
}

export default ITask;
