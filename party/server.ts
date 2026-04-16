import type * as Party from "partykit/server";

type Vec3 = [number, number, number];
type Quat = [number, number, number, number];

type SyncPayload = {
  type: "sync";
  id: string;
  p: Vec3;
  q: Quat;
  speed: number;
};

type WelcomePayload = {
  type: "welcome";
  id: string;
  players: { id: string; p: Vec3; q: Quat; speed: number }[];
};

type JoinPayload = { type: "join"; id: string };
type LeavePayload = { type: "leave"; id: string };

type ServerMessage = WelcomePayload | JoinPayload | LeavePayload | SyncPayload;

const defaultSpawn = (): Vec3 => [
  (Math.random() - 0.5) * 24,
  0.35,
  (Math.random() - 0.5) * 24,
];

const defaultQuat = (): Quat => [0, 0, 0, 1];

export default class RaceRoom implements Party.Server {
  private last = new Map<
    string,
    { p: Vec3; q: Quat; speed: number }
  >();

  constructor(readonly room: Party.Room) {}

  onConnect(connection: Party.Connection): void | Promise<void> {
    const id = connection.id;
    if (!this.last.has(id)) {
      this.last.set(id, {
        p: defaultSpawn(),
        q: defaultQuat(),
        speed: 0,
      });
    }

    const players = [...this.last.entries()]
      .filter(([pid]) => pid !== id)
      .map(([pid, s]) => ({ id: pid, ...s }));

    const welcome: WelcomePayload = {
      type: "welcome",
      id,
      players,
    };
    connection.send(JSON.stringify(welcome));

    const join: JoinPayload = { type: "join", id };
    this.room.broadcast(JSON.stringify(join), [id]);
  }

  onMessage(message: string | ArrayBuffer, sender: Party.Connection): void {
    if (typeof message !== "string") return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(message);
    } catch {
      return;
    }

    if (!parsed || typeof parsed !== "object") return;
    const body = parsed as Partial<SyncPayload>;
    if (body.type !== "sync" || !body.id || !body.p || !body.q) return;

    const sync: SyncPayload = {
      type: "sync",
      id: body.id,
      p: body.p,
      q: body.q,
      speed: typeof body.speed === "number" ? body.speed : 0,
    };

    this.last.set(sync.id, {
      p: sync.p,
      q: sync.q,
      speed: sync.speed,
    });

    this.room.broadcast(JSON.stringify(sync), [sender.id]);
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    this.last.delete(connection.id);
    const leave: LeavePayload = { type: "leave", id: connection.id };
    this.room.broadcast(JSON.stringify(leave));
  }
}
