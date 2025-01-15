import { Node } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

interface VoiceNoteOptions {
    HTMLAttributes: Record<string, any>;
  }
  
  interface VoiceNoteAttributes {
    audioUrl: string | null;
    duration: number;
  }
  
  declare module '@tiptap/core' {
    interface Commands<ReturnType> {
      voiceNote: {
        setVoiceNote: (attributes: VoiceNoteAttributes) => ReturnType;
      };
    }
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const VoiceNote = Node.create<VoiceNoteOptions>({
    name: 'voiceNote',
  
    addOptions() {
      return {
        HTMLAttributes: {
          class: 'voice-note',
        },
      };
    },
  
    addAttributes() {
      return {
        audioUrl: {
          default: null,
          parseHTML: (element: HTMLElement) => element.getAttribute('data-audio-url'),
          renderHTML: (attributes: VoiceNoteAttributes) => ({
            'data-audio-url': attributes.audioUrl,
          }),
        },
        duration: {
          default: 0,
          parseHTML: (element: HTMLElement) => parseInt(element.getAttribute('data-duration') ?? '0'),
          renderHTML: (attributes: VoiceNoteAttributes) => ({
            'data-duration': attributes.duration,
          }),
        },
      };
    },
  
    group: 'block',
  
    content: 'inline*',
  
    parseHTML() {
      return [
        {
          tag: 'div[data-type="voice-note"]',
        },
      ];
    },
  
    renderHTML({ HTMLAttributes } : { HTMLAttributes: Record<string, any> }) {
      return [
        'div',
        {
          ...this.options.HTMLAttributes,
          ...HTMLAttributes,
          'data-type': 'voice-note',
          'data-audio-url': HTMLAttributes.audioUrl || '',
          'data-duration': HTMLAttributes.duration || 0,
        },
        0,
      ];
    },
  
    addCommands() {
      return {
        setVoiceNote:
          (attributes: VoiceNoteAttributes) =>
          ({ commands }) => {
            return commands.setNode(this.name, attributes);
          },
      };
    },
  
    addProseMirrorPlugins() {
      return [
        new Plugin({
          key: new PluginKey('voiceNote'),
          props: {
            decorations: (state) => {
              const { doc } = state;
              const decorations: Decoration[] = [];
  
              doc.descendants((node, pos) => {
                if (node.type.name === 'voiceNote') {
                  const dom = document.createElement('div');
                  dom.className = 'voice-note my-2';
  
                  const playbackContainer = document.createElement('div');
                  playbackContainer.className = 'flex items-center gap-2 p-2 bg-neutral-700 rounded';
  
                  const playButton = document.createElement('button');
                  playButton.className = 'play-button text-neutral-200 hover:text-neutral-100';
                  playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
  
                  const progressContainer = document.createElement('div');
                  progressContainer.className = 'flex-1';
  
                  const progressBar = document.createElement('div');
                  progressBar.className = 'h-1 bg-neutral-600 rounded cursor-pointer';
  
                  const progressFill = document.createElement('div');
                  progressFill.className = 'h-full bg-blue-500 rounded';
                  progressFill.style.width = '0%';
  
                  const timeDisplay = document.createElement('span');
                  timeDisplay.className = 'text-xs text-neutral-400';
                  timeDisplay.textContent = formatDuration(node.attrs.duration);
  
                  const audio = new Audio(node.attrs.audioUrl);
                  let isPlaying = false;
                  
                  console.log(node.attrs);
  
                  playButton.onclick = () => {
                    if (isPlaying) {
                      audio.pause();
                      playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                    } else {
                      audio.play();
                      playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
                    }
                    isPlaying = !isPlaying;
                  };
  
                  audio.ontimeupdate = () => {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    progressFill.style.width = `${progress}%`;
                    timeDisplay.textContent = `${formatDuration(Math.floor(audio.currentTime))} / ${formatDuration(Math.floor(audio.duration))}`;
                  };
  
                  progressBar.onclick = (e) => {
                    const rect = progressBar.getBoundingClientRect();
                    const clickPosition = (e.clientX - rect.left) / rect.width;
                    audio.currentTime = clickPosition * audio.duration;
                  };
  
                  audio.onended = () => {
                    isPlaying = false;
                    playButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                    progressFill.style.width = '0%';
                    timeDisplay.textContent = formatDuration(node.attrs.duration);
                  };
  
                  // volume slider
                  const volumeContainer = document.createElement('div');
                  volumeContainer.className = 'flex items-cemter gap-2 bg-neutral-700';
  
                  const volumeLabel = document.createElement('span');
                  volumeLabel.className = 'text-xs text-neutral-400';
                  volumeLabel.textContent = 'Volume';
  
                  const volumeSlider = document.createElement('input');
                  volumeSlider.type = 'range';
                  volumeSlider.min = '0';
                  volumeSlider.max = '1';
                  volumeSlider.step = '0.1';
                  volumeSlider.value = '0.7';
                  volumeSlider.className = 'volume-slider w-24';
  
                  volumeSlider.oninput = (e) => {
                    const target = e.target as HTMLInputElement;
                    audio.volume = parseFloat(target.value);
                  }
  
                  volumeContainer.appendChild(volumeLabel);
                  volumeContainer.appendChild(volumeSlider);
  
                  progressBar.appendChild(progressFill);
                  progressContainer.appendChild(progressBar);
                  playbackContainer.appendChild(playButton);
                  playbackContainer.appendChild(progressContainer);
                  playbackContainer.appendChild(timeDisplay);
                  playbackContainer.append(volumeContainer);
                  dom.appendChild(playbackContainer);
  
                  decorations.push(
                    Decoration.widget(pos, dom, { side: -1 })
                  );
                }
              });
  
              return DecorationSet.create(doc, decorations);
            }
          }
        })
      ];
    }
  });

  export default VoiceNote;
  
  