import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");

  useEffect(()=>{
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      console.log("connected");
      setSocket(socket)
    }
    socket.onmessage = (message) => {
      console.log("Received message: ", message.data);
      setMessages([...messages, message.data])
    }
    return () => {
      socket.close();
    }
  }, [])

  if(!socket){
    return <div>
      Connecting to socket server...
    </div>
  }

  function onclickHandler(){
    setTimeout(() => {
      setInputVal("")
    }, 100);
  }


  return (
    <>
      <input type="text" id='inputbox' value={inputVal} onChange={(e)=>setInputVal(e.target.value)}/>
      <button onClick={()=>{
        socket.send(inputVal);
        onclickHandler();
      }}>send</button> <br />
      { messages } <br />
    </>
  )
}

export default App
