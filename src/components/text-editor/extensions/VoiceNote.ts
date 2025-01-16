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

declare global {
  interface Window {
    [key: string]: any;
  }
}

const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
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
        parseHTML: (element: HTMLElement) => {
          const duration = element.getAttribute('data-duration');
          return duration ? parseFloat(duration) : 0;
        },
        renderHTML: (attributes: VoiceNoteAttributes) => ({
          'data-duration': attributes.duration,
        }),
      },
    };
  },

  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-type="voice-note"]' }];
  },

  renderHTML({ HTMLAttributes }) {
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
              if (node.type.name === 'voiceNote' && node.attrs.audioUrl) {
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
                progressFill.className = 'h-full bg-blue-500 rounded transition-all duration-100';
                progressFill.style.width = '0%';

                const timeDisplay = document.createElement('span');
                timeDisplay.className = 'text-xs text-neutral-400 min-w-[80px] text-right';
                timeDisplay.textContent = formatDuration(node.attrs.duration);

                // Create and configure audio element with proper settings
                const audio = new Audio();
                audio.preload = 'metadata';
                audio.src = node.attrs.audioUrl;

                // Set initial volume
                audio.volume = 0.7;

                // Prevent memory leaks by storing audio instance
                const audioKey = `voice-note-${pos}`;
                if (window[audioKey]) {
                  window[audioKey].pause();
                  window[audioKey].src = '';
                }
                window[audioKey] = audio;

                let isPlaying = false;

                const updatePlayButton = (playing: boolean) => {
                  playButton.innerHTML = playing
                    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`
                    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
                };

                playButton.onclick = () => {
                  if (isPlaying) {
                    audio.pause();
                  } else {
                    // Pause all other playing audio elements
                    document.querySelectorAll('audio').forEach((otherAudio) => {
                      if (otherAudio !== audio) otherAudio.pause();
                    });
                    
                    // Start playback
                    audio.play().catch(console.error);
                  }
                  isPlaying = !isPlaying;
                  updatePlayButton(isPlaying);
                };

                audio.ontimeupdate = () => {
                  if (audio.duration) {
                    const progress = (audio.currentTime / audio.duration) * 100;
                    progressFill.style.width = `${progress}%`;
                    timeDisplay.textContent = `${formatDuration(audio.currentTime)} / ${formatDuration(audio.duration)}`;
                  }
                };

                audio.onloadedmetadata = () => {
                  timeDisplay.textContent = `0:00 / ${formatDuration(audio.duration)}`;
                };

                progressBar.onclick = (e) => {
                  const rect = progressBar.getBoundingClientRect();
                  const clickPosition = (e.clientX - rect.left) / rect.width;
                  if (audio.duration) {
                    audio.currentTime = clickPosition * audio.duration;
                  }
                };

                audio.onended = () => {
                  isPlaying = false;
                  updatePlayButton(false);
                  progressFill.style.width = '0%';
                  timeDisplay.textContent = `0:00 / ${formatDuration(audio.duration)}`;
                };

                // Volume control
                const volumeContainer = document.createElement('div');
                volumeContainer.className = 'flex items-center gap-2 ml-4';

                const volumeSlider = document.createElement('input');
                volumeSlider.type = 'range';
                volumeSlider.min = '0';
                volumeSlider.max = '1';
                volumeSlider.step = '0.05';
                volumeSlider.value = '0.7';
                volumeSlider.className = 'w-20 h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer';

                volumeSlider.oninput = (e) => {
                  const target = e.target as HTMLInputElement;
                  audio.volume = parseFloat(target.value);
                };

                progressBar.appendChild(progressFill);
                progressContainer.appendChild(progressBar);
                playbackContainer.appendChild(playButton);
                playbackContainer.appendChild(progressContainer);
                playbackContainer.appendChild(timeDisplay);
                volumeContainer.appendChild(volumeSlider);
                playbackContainer.appendChild(volumeContainer);
                dom.appendChild(playbackContainer);

                decorations.push(Decoration.widget(pos, dom, { side: -1 }));
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default VoiceNote;