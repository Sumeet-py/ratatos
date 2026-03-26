'use client';
import { useEffect, useState } from 'react';
import { pusherClient } from '@/lib/pusher';
import { supabase } from '@/lib/supabase';

export default function Radar() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(15);
      
      if (data) {
        setMessages(data.map(m => ({
          id: m.id, // Store the ID so we can delete it later
          message: m.text,
          timestamp: new Date(m.created_at).toLocaleTimeString()
        })));
      }
    };
    fetchHistory();

    const channel = pusherClient.subscribe('world-tree');
    channel.bind('new-pulse', (data: any) => {
      setMessages((prev) => [data, ...prev]);
    });

    return () => pusherClient.unsubscribe('world-tree');
  }, []);

  const sendPulse = async () => {
    if (!input) return;
    const currentInput = input;
    setInput('');
    await fetch('/api/pulse', {
      method: 'POST',
      body: JSON.stringify({ message: currentInput }),
    });
  };

  const deleteSignal = async (id: number) => {
    // 1. Optimistic Update: Remove from UI immediately
    setMessages((prev) => prev.filter(m => m.id !== id));

    // 2. Delete from Database
    await fetch('/api/pulse/delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
  };

  return (
    <div className="bg-black text-green-500 min-h-screen p-6 font-mono">
      <div className="max-w-3xl mx-auto border border-green-900 h-[90vh] flex flex-col bg-black/50 backdrop-blur-sm">
        
        <div className="border-b border-green-900 p-4 flex justify-between items-center bg-green-900/10">
          <h1 className="text-xl font-bold tracking-tighter italic">Ratatos_Protocol_v2.1</h1>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={m.id || i} className="group border-l-2 border-green-800 pl-4 py-1 flex justify-between items-start hover:border-red-900 transition-colors">
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-green-900 mb-1">
                  <span>SIGNAL_NODE_{m.id || 'NEW'}</span>
                  <span>{m.timestamp}</span>
                </div>
                <p className="text-lg leading-tight break-words">{m.message}</p>
              </div>
              
              {/* DELETE BUTTON */}
              <button 
                onClick={() => deleteSignal(m.id)}
                className="ml-4 text-green-900 hover:text-red-500 transition-colors text-xs"
              >
                [WIPE]
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-green-900 p-4 bg-black">
          <div className="flex gap-3 items-center">
            <span className="text-green-500 animate-pulse font-bold">{'>'}</span>
            <input 
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendPulse()}
              placeholder="SEND SIGNAL..."
              className="bg-transparent outline-none flex-1 placeholder:text-green-900 uppercase"
            />
          </div>
        </div>
      </div>
    </div>
  );
}