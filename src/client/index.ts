import { connectSocket } from "./socketConnection"
import {addSocketHandler} from "./socketHandler"

const socket = connectSocket("http://127.0.0.1:8080/");
addSocketHandler(socket);