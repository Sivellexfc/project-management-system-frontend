import { Column, Task } from "./types";

export const columns: Column[] = [
    {
        id: 1,
        title: "New Request"
    },
    {
        id: 2,
        title: "In Progress"
    },
    {
        id: 3,
        title: "Review"
    },
    {
        id: 4,
        title: "Completed"
    }
];

export const tasks: Task[] = [
    {
        id: 1,
        columnId:1,
        content: "New Request"
    },
    {
        id: 2,
        columnId:2,
        content: "In Progress"
    },
    {
        id: 3,
        columnId:3,
        content: "Review"
    },
    {
        id: 4,
        columnId:4,
        content: "Completed"
    },
    {
        id: 5,
        columnId:1,
        content: "New Request"
    },
    {
        id: 6,
        columnId:2,
        content: "In Progress"
    },
    {
        id: 7,
        columnId:3,
        content: "Review"
    },
    {
        id: 8,
        columnId:4,
        content: "Completed"
    }
];