import { COLORS } from "../../../utils/theme";
import ITag from "../models/tag.model";

export const COLORS_COMBINATION = [
  { name: "blue", backgroundColor: COLORS.blueLight, color: COLORS.blue },
  { name: "green", backgroundColor: COLORS.greenLight, color: COLORS.green },
  { name: "purple", backgroundColor: COLORS.purpleLight, color: COLORS.purple },
  { name: "grey", backgroundColor: COLORS.greyUltraLight, color: COLORS.grey },
];

export const DEFAULT_TAGS: ITag[] = [
  { id: 1, name: "Health", color: "blue" },
  { id: 2, name: "Work", color: "green" },
  { id: 3, name: "Mental Health", color: "purple" },
  { id: 4, name: "Others", color: "grey" },
];

export const DEFAULT_TASKS = [
  {
    id: 1,
    name: "Doctor Appointment",
    completed: 1,
    tags: [],
    parent_id: null,
  },
  {
    id: 3,
    name: "Meeting at School",
    completed: 0,
    tags: [DEFAULT_TAGS[1]],
    parent_id: null,
  },
];
