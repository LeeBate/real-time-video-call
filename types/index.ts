import { User } from "@clerk/nextjs/server"
import Peer from "simple-peer";

export type SocketUser = {
    userId: string,
    socketId: string,
    profile: User
}

export type OnCall = {
    participants: Participants;
    isRinging: boolean;
}

export type Participants = {
    caller: SocketUser,
    receiver: SocketUser
}

export type PeerData = {
    peerConnecction: Peer.Instance,
    stream: MediaStream | null,
    partipanUser: SocketUser
}