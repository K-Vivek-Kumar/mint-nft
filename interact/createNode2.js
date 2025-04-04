import { startNode, uploadFile, obtainFile, stopNode, getPeerId } from '../interact/createNode.js';

const node1Addresses = [
    "/ip4/127.0.0.1/tcp/4001",
    "/ip4/127.0.0.1/udp/9001/webrtc-direct"
];

const node2Addresses = [
    "/ip4/127.0.0.1/tcp/4002",
    "/ip4/127.0.0.1/udp/9002/webrtc-direct"
];

(async () => {
    try {
        const node1 = await startNode('node1', node1Addresses);
        console.log("Node 1 started with Peer ID: ", await getPeerId(node1));

        const fileData = "K Vivek Kumar";
        const cid = await uploadFile(node1, fileData);
        console.log("File uploaded to Node 1. CID:", cid);

        const node1AddressesList = node1.libp2p.getMultiaddrs();
        console.log("Node 1 Multiaddresses:");
        node1AddressesList.forEach(ma => console.log(ma.toString()));

        const node2 = await startNode('node2', node2Addresses);
        console.log("Node 2 started with Peer ID: ", await getPeerId(node2));

        const node2AddressesList = node2.libp2p.getMultiaddrs();
        console.log("Node 2 Multiaddresses:");
        node2AddressesList.forEach(ma => console.log(ma.toString()));

        const fileContent = await obtainFile(node2, cid);
        console.log("File retrieved from Node 1: ", fileContent);

        if (fileContent === fileData) {
            console.log("File successfully shared between nodes! Content matches.");
        } else {
            console.log("File content mismatch between nodes.");
        }

        await stopNode(node1);
        console.log("Node 1 stopped.");

        await stopNode(node2);
        console.log("Node 2 stopped.");
    } catch (error) {
        console.error("Error during the file sharing process:", error);
    }
})();
