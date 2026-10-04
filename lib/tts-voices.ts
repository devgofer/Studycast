export const ttsVoices = [
  { id: "cedar", label: "Cedar" },
  { id: "marin", label: "Marin" },
  { id: "coral", label: "Coral" },
  { id: "sage", label: "Sage" },
] as const;

export type TtsVoice = (typeof ttsVoices)[number]["id"];

export function isTtsVoice(value: unknown): value is TtsVoice {
  return ttsVoices.some((voice) => voice.id === value);
}
