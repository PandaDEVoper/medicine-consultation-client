declare class Peer {
    prototype: RTCIceServer;

    /**
     * A peer can connect to other peers and listen for connections.
     * @param id Other peers can connect to this peer using the provided ID.
     *     If no ID is given, one will be generated by the brokering server.
     * @param options for specifying details about PeerServer
     */
    constructor(id?: string, options?: Peer.PeerJSOption);

    /**
     * A peer can connect to other peers and listen for connections.
     * @param options for specifying details about PeerServer
     */
    constructor(options: Peer.PeerJSOption);

    /**
     * Connects to the remote peer specified by id and returns a data connection.
     * @param id The brokering ID of the remote peer (their peer.id).
     * @param options for specifying details about Peer Connection
     */
    connect(id: string, options?: Peer.PeerConnectOption): Peer.DataConnection;
    /**
     * Calls the remote peer specified by id and returns a media connection.
     * @param id The brokering ID of the remote peer (their peer.id).
     * @param stream The caller's media stream
     * @param options Metadata associated with the connection, passed in by whoever initiated the connection.
     */
    call(id: string, stream: MediaStream, options?: Peer.CallOption): Peer.MediaConnection;
    /**
     * Set listeners for peer events.
     * @param event Event name
     * @param cb Callback Function
     */
    on(event: string, cb: () => void): void;
    /**
     * Emitted when a connection to the PeerServer is established.
     * @param event Event name
     * @param cb id is the brokering ID of the peer
     */
    on(event: "open", cb: (id: string) => void): void;
    /**
     * Emitted when a new data connection is established from a remote peer.
     * @param event Event name
     * @param cb Callback Function
     */
    on(
        event: "connection",
        cb: (dataConnection: Peer.DataConnection) => void
    ): void;
    /**
     * Emitted when a remote peer attempts to call you.
     * @param event Event name
     * @param cb Callback Function
     */
    on(event: "call", cb: (mediaConnection: Peer.MediaConnection) => void): void;
    /**
     * Emitted when the peer is destroyed and can no longer accept or create any new connections.
     * @param event Event name
     * @param cb Callback Function
     */
    on(event: "close", cb: () => void): void;
    /**
     * Emitted when the peer is disconnected from the signalling server
     * @param event Event name
     * @param cb Callback Function
     */
    on(event: "disconnected", cb: () => void): void;
    /**
     * Errors on the peer are almost always fatal and will destroy the peer.
     * @param event Event name
     * @param cb Callback Function
     */
    on(event: "error", cb: (err: any) => void): void;
    /**
     * Remove event listeners.(EventEmitter3)
     * @param {String} event The event we want to remove.
     * @param {Function} fn The listener that we need to find.
     * @param {Boolean} once Only remove once listeners.
     */
    off(event: string, fn: Function, once?: boolean): void;
    /**
     * Close the connection to the server, leaving all existing data and media connections intact.
     */
    disconnect(): void;
    /**
     * Attempt to reconnect to the server with the peer's old ID
     */
    reconnect(): void;
    /**
     * Close the connection to the server and terminate all existing connections.
     */
    destroy(): void;

    /**
     * Retrieve a data/media connection for this peer.
     * @param peerId
     * @param connectionId
     */
    getConnection(peerId: string, connectionId: string): Peer.MediaConnection | Peer.DataConnection | null;

    /**
     * Get a list of available peer IDs
     * @param callback
     */
    listAllPeers(callback: (peerIds: Array<string>) => void): void;
    /**
     * The brokering ID of this peer
     */
    id: string;
    /**
     * A hash of all connections associated with this peer, keyed by the remote peer's ID.
     */
    connections: any;
    /**
     * false if there is an active connection to the PeerServer.
     */
    disconnected: boolean;
    /**
     * true if this peer and all of its connections can no longer be used.
     */
    destroyed: boolean;
}

declare namespace Peer {
    interface PeerJSOption {
        key?: string;
        host?: string;
        port?: number;
        path?: string;
        secure?: boolean;
        config?: RTCConfiguration;
        debug?: number;
    }

    interface PeerConnectOption {
        label?: string;
        metadata?: any;
        serialization?: string;
        reliable?: boolean;
    }

    interface CallOption {
        metadata?: any;
        sdpTransform?: Function;
    }

    interface AnswerOption {
        sdpTransform?: Function;
    }

    interface DataConnection {
        send(data: any): void;
        close(): void;
        on(event: string, cb: () => void): void;
        on(event: "data", cb: (data: any) => void): void;
        on(event: "open", cb: () => void): void;
        on(event: "close", cb: () => void): void;
        on(event: "error", cb: (err: any) => void): void;
        off(event: string, fn: Function, once?: boolean): void;
        dataChannel: RTCDataChannel;
        label: string;
        metadata: any;
        open: boolean;
        peerConnection: RTCPeerConnection;
        peer: string;
        reliable: boolean;
        serialization: string;
        type: string;
        bufferSize: number;
        stringify: (data: any) => string;
        parse: (data: string) => any;
    }

    interface MediaConnection {
        answer(stream?: MediaStream, options?: AnswerOption): void;
        close(): void;
        on(event: string, cb: () => void): void;
        on(event: "stream", cb: (stream: MediaStream) => void): void;
        on(event: "close", cb: () => void): void;
        on(event: "error", cb: (err: any) => void): void;
        off(event: string, fn: Function, once?: boolean): void;
        open: boolean;
        metadata: any;
        peerConnection: RTCPeerConnection;
        peer: string;
        type: string;
    }

    interface UtilSupportsObj {
        browser: boolean,
        webRTC: boolean;
        audioVideo: boolean;
        data: boolean;
        binaryBlob: boolean;
        reliable: boolean;
    }

    interface util {
        browser: string;
        supports: UtilSupportsObj;
    }
}