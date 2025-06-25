import ITag from "./tag.model";

interface ITask {
  id: number;
  name: string;
  completed: number;
  tags?: ITag[];
  subtasks?: ITask[];
  parent_id: number | null;
}

export default ITask;
