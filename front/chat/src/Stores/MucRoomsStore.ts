import { get, writable } from "svelte/store";
import type { MucRoom } from "../Xmpp/MucRoom";
import { JID } from "@xmpp/jid";

/**
 * True if the connection between the pusher and the XMPP server is established, false otherwise.
 */
export const xmppServerConnectionStatusStore = writable(false);
export const numberPresenceUserStore = writable(0);

function createMucRoomsStore() {
    const { subscribe, update, set } = writable<Set<MucRoom>>(new Set<MucRoom>());

    return {
        subscribe,
        addMucRoom(mucRoom: MucRoom) {
            update((set) => {
                set.add(mucRoom);
                return set;
            });
        },
        removeMucRoom(mucRoom: MucRoom) {
            update((set) => {
                set.delete(mucRoom);
                return set;
            });
        },
        reset() {
            set(new Set<MucRoom>());
        },
        getDefaultRoom(): MucRoom | undefined {
            return [...get(this).values()].find((mucRoom) => mucRoom.type === "default");
        },
        getLiveRoom(): MucRoom | undefined {
            return [...get(this).values()].find((mucRoom) => mucRoom.type === "live");
        },
        get(url: string): MucRoom | undefined {
            return [...get(this)].find((mucRoom) => mucRoom.getRawUrl() === url);
        },
        sendPresences() {
            [...get(this).values()].forEach((mucRoom) => mucRoom.sendPresence());
        },
    };
}
export const mucRoomsStore = createMucRoomsStore();
