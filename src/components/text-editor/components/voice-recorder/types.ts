export interface VoiceRecorderProps {
    onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  }