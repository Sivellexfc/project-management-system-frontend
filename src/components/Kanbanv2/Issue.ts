export interface IssueResponse {
    time: string;
    code: string;
    isSuccess: boolean;
    result: Issue[];
  }
  
  export interface Issue {
    id: number;
    name: string;
    explanation: string;
    startDate: string;
    deadLineDate: string;
    stageId: number;
    projectId: number;
    priorityId: number;
    labelId: number;
  }
  
  export const PRIORITY_COLORS = {
    1: "green",  // Düşük
    2: "yellow", // Orta
    3: "red"     // Yüksek
  };
  
  export const LABEL_INFO = {
    1: { name: "Acil", color: "red" },
    2: { name: "Hata Düzeltme", color: "orange" },
    3: { name: "Geliştirme", color: "blue" },
    4: { name: "İyileştirme", color: "green" }
  };