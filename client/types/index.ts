
export type Task = {
    id: string;
    title: string;
    priority: 1 | 2 | 3 | 4 | 5;
    status: 'Pending' | 'Finished';
    startTime: Date;
    endTime: Date;
};

export type SortOption = 'Start time: ASC' | 'Start time: DESC' | 'End time: ASC' | 'End time: DESC';


export const generateId = () => "hello"