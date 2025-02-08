export type Status = 'todo' | 'in-progress' | 'done' | 'review';
export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  title: string;
  id: string;
  points?: number;
  priority : Priority;
  status: Status;
};

export const statuses : Status[] = ['todo' , 'in-progress' , 'done','review'];
export const priorities : Priority[] = ['low' , 'medium' , 'high'];


export const tasks: Task[] = [
  {
    id: "1",
    title: "Market research",
    status: "done",
    priority : 'low',
    points: 5,
  },
  {
    id: "2",
    title: "competitor analysis",
    status: "done",
    priority : 'medium',
    points: 0,
  },
  {
    id: "3",
    title: "Customer research",
    status: "in-progress",
    priority : 'medium',
    points: 2,
  },
  {
    id: "4",
    title: "Develop business strategy",
    status: "review",
    priority : 'high',
    points: 9,
  },
  {
    id: "5",
    title: "Develop marketing plans",
    status: "todo",
    priority : 'high',
    points: 8,
  },
  {
    id: "6",
    title: "Implement marketing plans",
    status: "in-progress",
    priority : 'medium',
    points: 3,
  },
  {
    id: "7",
    title: "Evaluate business performance",
    status: "review",
    priority : 'high',
    points: 3,
  },
  {
    id: "8",
    title: "Develop business strategy",
    status: "done",
    priority : 'high',
    points: 9,
  },
  {
    id: "9",
    title: "Develop marketing plans",
    status: "review",
    priority : 'high',
    points: 8,
  },
  {
    id: "10",
    title: "Implement marketing plans",
    status: "in-progress",
    priority : 'medium',
    points: 3,
  },
  {
    id: "11",
    title: "Evaluate business performance",
    status: "review",
    priority : 'high',
    points: 3,
  },
  {
    id: "12",
    title: "Evaluate business performance",
    status: "review",
    priority : 'high',
    points: 3,
  },
  {
    id: "13",
    title: "Develop business strategy",
    status: "done",
    priority : 'high',
    points: 9,
  },
  {
    id: "14",
    title: "Develop marketing plans",
    status: "review",
    priority : 'high',
    points: 8,
  },
  {
    id: "15",
    title: "Implement marketing plans",
    status: "in-progress",
    priority : 'medium',
    points: 3,
  },
  {
    id: "16",
    title: "Evaluate business performance",
    status: "review",
    priority : 'high',
    points: 3,
  },
];
