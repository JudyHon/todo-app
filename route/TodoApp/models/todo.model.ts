import ITag from "./tag.model";

interface ITodo {
  id: number;
  name: string;
  completed: number;
  tags?: ITag[];
}

export default ITodo;
