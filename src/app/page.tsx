"use client"

import { useState, useEffect, useMemo } from 'react';
import io from 'socket.io-client';
import {Card, CardBody, Avatar, Textarea, Button} from "@nextui-org/react";

function CardComponent({text}: any) {
  return (
    <Card className='max-w-[80%] overflow-visible'>
      <CardBody className='flex gap-5 text-small text-default-400 flex-row items-center'>
        <Avatar isBordered radius="full" size="md" src="/person.svg" className='object-contain min-w-12 min-h-12' />
        <p>{ text }</p>
      </CardBody>
    </Card>
  )
}

let socket: any = null;

export default function Home() {
  const [totalMensagens, setTotalMensagens] = useState<any>([]);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    if(socket == null) {
      const SOCKET_URL = process.env.SOCKET_URL || 'http://localhost:9000';
      socket = io(SOCKET_URL, {
        withCredentials: true
      })

      socket.on('connect', () => {
        console.log('connected with ID ' + socket.id)
      })
      socket.on('first-connection', (chat: any) => {
        console.log('receive chat from server')
        setTotalMensagens(chat);
      })
    
      socket.on('update-chat', (newMsg: any) => {
        setTotalMensagens((prevState: any) => [...prevState, newMsg])
      });
    }
  }, [])

  function enviarMensagem() {
    socket.emit('new-message', mensagem)
    setMensagem('');
  }

  return (
    <main className='p-4 flex flex-col gap-4 justify-between min-h-[100vh]'>
      <div className='max-h-[80vh] gap-4 flex flex-col overflow-auto'>
        {totalMensagens.map((e: any, index: any) => (
          <CardComponent text={e} key={index}/>
        ))}
        
      </div>
      <div className='max-h-[20%] min-h-[200] flex flex-row gap-4 items-center'>
        <Textarea 
          label="Mensagem"
          placeholder='Digite sua mensagem'
          value={mensagem}
          onChange={event => setMensagem(event.target.value)}
          className='max-w-[80%]'
        />
        <Button className='max-w-[20%]' onClick={enviarMensagem}>Enviar mensagem</Button>
      </div>
    </main>
  )
}
