if (typeof CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
        constructor(type, params = {}) {
            super(type, params);
            this.detail = params.detail || null;
        }
    };
}

import { createHelia } from 'helia';
import { FsDatastore } from 'datastore-fs';
import { FsBlockstore } from 'blockstore-fs';
import { unixfs } from '@helia/unixfs';

export const startNode = async (client, listenAddresses) => {
    const datastore = new FsDatastore(`./ipfs/${client}/datastore`);
    const blockstore = new FsBlockstore(`./ipfs/${client}/blockstore`);
    const libp2p = {
        addresses: {
            listen: listenAddresses,
        },
    };
    const heliaNode = await createHelia({
        datastore: datastore,
        blockstore: blockstore,
        libp2p: libp2p,
    });

    return heliaNode;
}

export const stopNode = async (heliaNode) => {
    await heliaNode.stop();
}

export const uploadFile = async (heliaNode, data) => {
    const fs = unixfs(heliaNode);
    const encoder = new TextEncoder();
    let cid = "";

    try {
        cid = await fs.addBytes(encoder.encode(data));
    } catch (error) {
        console.error("Error uploading file:", error);
    }

    return cid;
}

export const obtainFile = async (heliaNode, cid) => {
    const fs = unixfs(heliaNode);
    const decoder = new TextDecoder();
    let text = "";

    try {
        for await (const chunk of fs.cat(cid)) {
            text += decoder.decode(chunk, { stream: true });
        }
    } catch (error) {
        console.error("Error retrieving file:", error);
        return "";
    }

    return text;
}

export const getPeerId = async (helia) => {
    const peerId = await helia.libp2p.peerId.toString();
    return peerId;
}