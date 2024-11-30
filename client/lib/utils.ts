import { Value } from "@radix-ui/react-select"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from "js-cookie";
import {jwtDecode} from 'jwt-decode';
import { useUser } from "@/context/UserContext";
import { Task } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export const login =  async(values:any,setUser:any)=>{

  try {
    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"/auth/login",{
        method:"POST",
        body:JSON.stringify(values),
        credentials:'include',
        headers :{
            "Content-Type": "application/json",
        }
      })

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
    }
    const accessToken = await res.json(); 
    if (accessToken) {
       
        const decoded: any =  await jwtDecode(accessToken.accessToken);
        // console.log(decoded);
        await setUser(decoded.UserData); 
    } else {
        throw new Error("Access token not found in cookies");
    }
    
} catch (error) {
    console.log(error)
}

}


export const register = async(values:any)=>{
  try {
    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"/users/register",{
        method:"POST",
        body:JSON.stringify(values),
        headers :{
            "Content-Type": "application/json",
        }
      })
} catch (error) {
    console.log(error)
}
}

export const logout = async()=>{
  try {
    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"/auth/logout",{
      method:"POST",
      headers :{
          "Content-Type": "application/json",
      },
      credentials:'include'
    })
    const status = res.status;
    return status
  } catch (error) {
    console.log(error)
  }
}

export const createTask = async(task:Task)=>{
  try {


    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"/tasks/create",{
        method:"POST",
        body:JSON.stringify(task),
        headers :{
            "Content-Type": "application/json",
        },
        credentials:'include'
      })

    const status = res.status
    return status
} catch (error) {
    console.log(error)
}

}

export const deleteTask = async(tasks:string[])=>{
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL+"/tasks/delete",{
        method:"DELETE",
        body:JSON.stringify(tasks),
        headers :{
            "Content-Type": "application/json",
        },
        credentials:'include'
      })

    const status = res.status
    return status
} catch (error) {
    console.log(error)
}

}

export const editTask = async(task:Task)=>{
  try {
    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+`/tasks/update`,{
        method:"POST",
        body:JSON.stringify(task),
        headers :{
            "Content-Type": "application/json",
        },
        credentials:"include"
      })
    const data =  res.status
    return data
} catch (error) {
    console.log(error)
}

}

export const getUserTasks = async()=>{
  try {
    const res = await fetch( process.env.NEXT_PUBLIC_BACKEND_URL+"/tasks/getUserTasks",{
        method:"GET",
        headers :{
            "Content-Type": "application/json",
        },
        credentials:'include'
      })
      const data = await res.json()
      return data;
  } catch (error) {
    console.log(error)
  }
}
