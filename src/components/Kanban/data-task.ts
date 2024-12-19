export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  title: String;
  id: String;
  point?: number;
  priority : Priority;
  status: Status;
};

export const statuses : Status[] = ['todo' , 'in-progress' , 'done'];
export const priorities : Priority[] = ['low' , 'medium' , 'high'];

export const tasks: Task[] = [
  {
    id: "BUS-1",
    title: "Market research",
    status: "done",
    priority : 'low',
    point: 5,
  },
  {
    id: "BUS-2",
    title: "competitor analysis",
    status: "done",
    priority : 'medium',
    point: 0,
  },
  {
    id: "BUS-3",
    title: "Customer research",
    status: "in-progress",
    priority : 'medium',
    point: 2,
  },
  {
    id: "BUS-4",
    title: "Develop business strategy",
    status: "done",
    priority : 'high',
    point: 9,
  },
  {
    id: "BUS-5",
    title: "Develop marketing plans",
    status: "todo",
    priority : 'high',
    point: 8,
  },
  {
    id: "BUS-6",
    title: "Implement marketing plans",
    status: "in-progress",
    priority : 'medium',
    point: 3,
  },
  {
    id: "BUS-7",
    title: "Evaluate business performance",
    status: "done",
    priority : 'high',
    point: 3,
  },
];
