import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PartySocket from "partysocket";

export type Vec3 = [number, number, number];
export type Quat = [number, number, number, number];

export type RemoteTarget = {
  p: Vec3;
  q: Quat;
  speed: number;
  t: number;
};

export type RaceNetwork = {
  status: "idle" | "connecting" | "open" | "error";
  playerId: string | null;
  error: string | null;
  remoteIds: string[];
  getRemote: (id: string) => RemoteTarget | undefined;
  sendLocal: (sample: { p: Vec3; q: Quat; speed: number }) => void;
};

type Welcome = { type: "welcome"; id: string; players: { id: string; p: Vec3; q: Quat; speed: number }[] };
type Join = { type: "join"; id: string };
type Leave = { type: "leave"; id: string };
type Sync = { type: "sync"; id: string; p: Vec3; q: Quat; speed: number };

function partyHost(): string {
  const raw = import.meta.env.VITE_PARTYKIT_HOST?.trim();
  if (raw) return raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return "127.0.0.1:1999";
}

function partyProtocol(): "ws" | "wss" {
  if (import.meta.env.DEV) return "ws";
  return "wss";
}

export function useRaceNetwork(): RaceNetwork {
  const [status, setStatus] = useState<RaceNetwork["status"]>("idle");
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remoteIds, setRemoteIds] = useState<string[]>([]);

  const remotes = useRef(new Map<string, RemoteTarget>());
  const socketRef = useRef<PartySocket | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const latestLocal = useRef<{ p: Vec3; q: Quat; speed: number } | null>(null);

  const getRemote = useCallback((id: string) => remotes.current.get(id), []);

  useEffect(() => {
    setStatus("connecting");
    setError(null);

    const socket = new PartySocket({
      host: partyHost(),
      room: "main-track",
      protocol: partyProtocol(),
    });
    socketRef.current = socket;

    const onOpen = () => setStatus("open");
    const onError = () => {
      setStatus("error");
      setError("WebSocket error (is PartyKit running on 1999?)");
    };

    const applyRemote = (id: string, p: Vec3, q: Quat, speed: number) => {
      remotes.current.set(id, { p, q, speed, t: performance.now() });
    };

    const onMessage = (ev: MessageEvent) => {
      if (typeof ev.data !== "string") return;
      let msg: unknown;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      if (!msg || typeof msg !== "object") return;
      const m = msg as { type?: string };

      if (m.type === "welcome") {
        const w = msg as Welcome;
        playerIdRef.current = w.id;
        setPlayerId(w.id);
        const ids: string[] = [];
        for (const pl of w.players) {
          applyRemote(pl.id, pl.p, pl.q, pl.speed);
          ids.push(pl.id);
        }
        setRemoteIds(ids);
        return;
      }

      if (m.type === "join") {
        const j = msg as Join;
        setRemoteIds((prev) => (prev.includes(j.id) ? prev : [...prev, j.id]));
        return;
      }

      if (m.type === "leave") {
        const l = msg as Leave;
        remotes.current.delete(l.id);
        setRemoteIds((prev) => prev.filter((x) => x !== l.id));
        return;
      }

      if (m.type === "sync") {
        const s = msg as Sync;
        applyRemote(s.id, s.p, s.q, s.speed);
      }
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("error", onError);
    socket.addEventListener("message", onMessage);

    const tick = window.setInterval(() => {
      const selfId = playerIdRef.current ?? socket.id;
      const sample = latestLocal.current;
      if (!sample) return;
      if (socket.readyState !== WebSocket.OPEN) return;
      socket.send(
        JSON.stringify({
          type: "sync",
          id: selfId,
          p: sample.p,
          q: sample.q,
          speed: sample.speed,
        }),
      );
    }, 50);

    return () => {
      window.clearInterval(tick);
      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("message", onMessage);
      socket.close();
      socketRef.current = null;
      remotes.current.clear();
      playerIdRef.current = null;
      setRemoteIds([]);
      setPlayerId(null);
      setStatus("idle");
    };
  }, []);

  const sendLocal = useCallback((sample: { p: Vec3; q: Quat; speed: number }) => {
    latestLocal.current = sample;
  }, []);

  return useMemo(
    () => ({
      status,
      playerId,
      error,
      remoteIds,
      getRemote,
      sendLocal,
    }),
    [status, playerId, error, remoteIds, getRemote, sendLocal],
  );
}
