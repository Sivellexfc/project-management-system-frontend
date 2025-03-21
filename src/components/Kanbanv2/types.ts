export type Id = string | number;

export type Column = {
    id: Id;
    title: string;
    color: string;
};

export type Task = {
    id: Id;
    name:string;
    content: string;
    explanation: string;
    startDate: string;
    deadLineDate: string;
    projectId: Id;
    priorityId: Id;
    labelId: Id;
    stageId: Id;
};