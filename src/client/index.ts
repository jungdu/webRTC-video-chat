import { connectSocket } from "./socketConnection"
import {addSocketHandler} from "./socketHandler"

console.log("Hello World")
const socket = connectSocket("http://127.0.0.1:8080/");
addSocketHandler(socket);