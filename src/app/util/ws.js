import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

var stompClient = null;
const handlers = []

export function connect() {
  const socket = new SockJS('http://localhost:8080/socket')
  stompClient = Stomp.over(socket)
  stompClient.debug = () => {}
  stompClient.connect({}, frame => {
    stompClient.subscribe('/topic/activity', message => {
      handlers.forEach(handler => handler(JSON.parse(message.body)))
    })
  })
}

export function addHandler(handler) {
  handlers.push(handler)
}

export function disconnect() {
  if (stompClient !== null) {
    stompClient.disconnect()
  }
  console.log("Disconnected")
}

export function sendMessage(message) {
  stompClient.send("/topic/activity", {}, JSON.stringify(message))
}
