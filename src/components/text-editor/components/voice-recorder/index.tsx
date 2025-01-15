import { useState, useRef } from 'react';

import { VoiceRecorderProps } from './types';
import { Square, Mic } from 'lucide-react'


const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [duration, setDuration] = useState(0);
    const [progress] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number>(0);
  
    // audio processing
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null); 
  
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            sampleRate: 44100,
            sampleSize: 16,
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: false,
          }
        });
  
        audioContextRef.current = new AudioContext({
          sampleRate: 44100,
          latencyHint: 'interactive',
        });
  
        sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
        gainNodeRef.current = audioContextRef.current.createGain();
        analyserRef.current = audioContextRef.current.createAnalyser();
  
        gainNodeRef.current.gain.value = 2;
        analyserRef.current.fftSize = 1024;
        analyserRef.current.smoothingTimeConstant = 0.6;
  
        sourceNodeRef.current
          .connect(gainNodeRef.current)
          .connect(analyserRef.current);
  
  
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 256000
        });
  
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];
        setDuration(0);
  
        mediaRecorder.ondataavailable = (e: BlobEvent) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };
  
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, {
            type: 'audio/webm;codecs=opus'
          });
  
          if (audioContextRef.current) {
            audioContextRef.current.close();
          }
  
          onRecordingComplete(audioBlob, duration);
          stream.getTracks().forEach(track => track.stop());
        };
  
        // Request data every 100ms to update progress
        mediaRecorder.start(10);
        setIsRecording(true);
        startTimeRef.current = Date.now();
  
        intervalRef.current = setInterval(() => {
          const currentDuration = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setDuration(currentDuration);
        }, 100);
  
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
  
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };
  
    return (
      <div className="flex items-center gap-2">
        <button
          className={`p-2 rounded ${isRecording ? 'bg-red-500' : 'bg-neutral-700'} text-white`}
          onClick={isRecording ? stopRecording : startRecording}
          title={isRecording ? 'Stop Recording' : 'Start Recording'}
        >
          {isRecording ? <Square size={16} /> : <Mic size={16} />}
        </button>
        
        {isRecording && (
          <div className="flex items-center gap-2 flex-1">
            <div className="w-24 h-1 bg-neutral-600 rounded overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-neutral-400">
              {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}
      </div>
    );
  };
  
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  