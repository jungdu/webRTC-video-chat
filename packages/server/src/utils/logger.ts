export function devLog(message: string){
  if(process.env.NODE_ENV === "development"){
    console.log(message);
  }
}

export const logger = {
  devLog,
  log: console.log
}