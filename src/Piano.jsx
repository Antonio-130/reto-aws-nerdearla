import { useReducer, useEffect, useRef } from 'react';

const initialState = {
  recording: false,
  currentRecording: [],
  savedRecordings: [],
  activeKeys: new Set()
};

const pianoReducer = (state, action) => {
  switch (action.type) {
    case 'START_RECORDING':
      return { ...state, recording: true, currentRecording: [] };
    case 'STOP_RECORDING':
      return { ...state, recording: false };
    case 'ADD_NOTE':
      return { 
        ...state, 
        currentRecording: [...state.currentRecording, action.payload] 
      };
    case 'SAVE_RECORDING':
      return { 
        ...state, 
        savedRecordings: [...state.savedRecordings, action.payload] 
      };
    case 'DELETE_RECORDING':
      return { 
        ...state, 
        savedRecordings: state.savedRecordings.filter(rec => rec.id !== action.payload) 
      };
    case 'LOAD_RECORDINGS':
      return { ...state, savedRecordings: action.payload };
    case 'KEY_DOWN':
      return { ...state, activeKeys: new Set([...state.activeKeys, action.payload]) };
    case 'KEY_UP':
      const newActiveKeys = new Set(state.activeKeys);
      newActiveKeys.delete(action.payload);
      return { ...state, activeKeys: newActiveKeys };
    default:
      return state;
  }
};

const Piano = () => {
  const [state, dispatch] = useReducer(pianoReducer, initialState);
  const audioContextRef = useRef(null);
  const recordingStartTime = useRef(null);

  const notes = [
    { note: 'C4', freq: 261.63, type: 'white', key: 'a' },
    { note: 'C#4', freq: 277.18, type: 'black', key: 'w' },
    { note: 'D4', freq: 293.66, type: 'white', key: 's' },
    { note: 'D#4', freq: 311.13, type: 'black', key: 'e' },
    { note: 'E4', freq: 329.63, type: 'white', key: 'd' },
    { note: 'F4', freq: 349.23, type: 'white', key: 'f' },
    { note: 'F#4', freq: 369.99, type: 'black', key: 't' },
    { note: 'G4', freq: 392.00, type: 'white', key: 'g' },
    { note: 'G#4', freq: 415.30, type: 'black', key: 'y' },
    { note: 'A4', freq: 440.00, type: 'white', key: 'h' },
    { note: 'A#4', freq: 466.16, type: 'black', key: 'u' },
    { note: 'B4', freq: 493.88, type: 'white', key: 'j' },
  ];

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const saved = localStorage.getItem('pianoRecordings');
    if (saved) dispatch({ type: 'LOAD_RECORDINGS', payload: JSON.parse(saved) });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === ' ') {
        e.preventDefault();
        state.recording ? stopRecording() : startRecording();
        return;
      }
      
      const note = notes.find(n => n.key === key);
      if (note && !state.activeKeys.has(key)) {
        dispatch({ type: 'KEY_DOWN', payload: key });
        playNote(note.freq);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      dispatch({ type: 'KEY_UP', payload: key });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.recording, state.activeKeys]);

  const playNote = (frequency) => {
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);

    if (state.recording) {
      const timestamp = Date.now() - recordingStartTime.current;
      dispatch({ type: 'ADD_NOTE', payload: { frequency, timestamp } });
    }
  };

  const startRecording = () => {
    dispatch({ type: 'START_RECORDING' });
    recordingStartTime.current = Date.now();
  };

  const stopRecording = () => {
    dispatch({ type: 'STOP_RECORDING' });
    if (state.currentRecording.length > 0) {
      const newRecording = {
        id: Date.now(),
        notes: state.currentRecording,
        date: new Date().toLocaleString()
      };
      dispatch({ type: 'SAVE_RECORDING', payload: newRecording });
      const updated = [...state.savedRecordings, newRecording];
      localStorage.setItem('pianoRecordings', JSON.stringify(updated));
    }
  };

  const playRecording = (recordingNotes) => {
    recordingNotes.forEach(({ frequency, timestamp }) => {
      setTimeout(() => {
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      }, timestamp);
    });
  };

  const deleteRecording = (id) => {
    dispatch({ type: 'DELETE_RECORDING', payload: id });
    const updated = state.savedRecordings.filter(rec => rec.id !== id);
    localStorage.setItem('pianoRecordings', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Piano Virtual</h1>
        
        <div className="mb-8">
          <button 
            onClick={state.recording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              state.recording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {state.recording ? 'Detener Grabación' : 'Iniciar Grabación'}
          </button>
        </div>

        <div className="flex justify-center mb-8 relative">
          {notes.map((note) => (
            <button
              key={note.note}
              className={`border transition-all active:scale-95 flex flex-col justify-end items-center pb-2 ${
                note.type === 'white'
                  ? `w-12 h-48 border-gray-300 text-black z-10 ${
                      state.activeKeys.has(note.key) ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'
                    }`
                  : `w-8 h-32 border-gray-600 text-white -mx-4 z-20 relative ${
                      state.activeKeys.has(note.key) ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`
              }`}
              onClick={() => playNote(note.freq)}
            >
              <span className="text-xs font-bold">{note.note}</span>
              <span className="text-xs opacity-70">{note.key.toUpperCase()}</span>
            </button>
          ))}
        </div>
        
        <div className="mb-6 text-sm text-gray-600">
          <p>Usa las teclas: A S D F G H J (teclas blancas) y W E T Y U (teclas negras)</p>
          <p>Presiona ESPACIO para iniciar/detener grabación</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Grabaciones ({state.savedRecordings.length})
          </h3>
          <div className="space-y-3">
            {state.savedRecordings.map((rec) => (
              <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">
                  {rec.date} - {rec.notes.length} notas
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => playRecording(rec.notes)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    ▶
                  </button>
                  <button 
                    onClick={() => deleteRecording(rec.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piano;