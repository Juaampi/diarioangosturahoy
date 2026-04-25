"use client";

import { Pause, Play, Radio } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { DEFAULT_RADIO_STREAM_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function RadioPlayButton({
  streamUrl = DEFAULT_RADIO_STREAM_URL,
  className,
  label = "Escuchar radio",
}: {
  streamUrl?: string;
  className?: string;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(streamUrl);
    audio.preload = "none";
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [streamUrl]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      window.open(streamUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <button
      type="button"
      onClick={togglePlayback}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--forest-green)] px-5 py-3 text-sm font-semibold text-white",
        className,
      )}
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      <Radio className="h-4 w-4" />
      {isPlaying ? "Pausar radio" : label}
    </button>
  );
}
