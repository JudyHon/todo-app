import ITag from "./tag.model";

interface ITodo {
  id: number;
  name: string;
  completed: number;
  tags?: ITag[];
  subTask?: [];
}

export default ITodo;
