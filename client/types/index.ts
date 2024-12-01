import 'next-auth';

// export type Task = {
//     _id:string,
//     title: string;
//     priority: 1 | 2 | 3 | 4 | 5;
//     status: 'Pending' | 'Finished';
//     start: Date;
//     end: Date;
// };
export type Task =  {
    _id?: string
    title: string
    priority: number
    status: string
    end: string | Date | null
    start: string | Date | null
}

export interface TaskManagerProps {
    currPage: string;
}

export interface UserData {
    email: string;
    id:string
}

export type User = {
    email:string,
    password:string
  }

export type currUser = {
    email:string,
    _id?:string,
    id?:string
}
  

  
export  type token ={
    UserData : {
      email:string,
      _id:string
    }
  }

export type SortOption = 'Start time: ASC' | 'Start time: DESC' | 'End time: ASC' | 'End time: DESC';


declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }

    interface User {
        id: string;
        email: string;
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email: string;
        accessToken: string;
    }
}