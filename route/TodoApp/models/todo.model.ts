import ISubtask from "./sub-task.model";
import ITag from "./tag.model";

interface ITodo {
  id: number;
  name: string;
  completed: number;
  tags?: ITag[];
  subtasks?: ISubtask[];
}

export default ITodo;
