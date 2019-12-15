
class NodeType {
    parse(nodeData) {
        // Returns node.
    }

    supportsVariableInputs() {
        
    }

    supportsVariableOutputs() {
        
    }
}

class PinType {

}

class ConnectionType {
    isCompatible(inputPin, outputPin) {
        return false;
    }
}

class Schema {
    constructor() {
        this.nodeTypes = [];
        this.connectionTypes = [];
    }
}

class Graph {
    constructor() {
        this.name = null;
        this.nodes = [];
        this.schema = null;
        this.data = null;
    }

    parse(json) {
        graph = JSON.parse(json)
        
        this.name = graph['name']

        var nodes = graph['nodes']
        for (var i = 0; i < nodes.length; ++i) {
            var n = nodes[i]

            var node = new Node()
            node.name = n['name']
            node.data = n['data'] // Need some method of parsing schema-specific data.
        }

        var connections = graph['connections']
        for (var i = 0; i < connections.length; ++i) {
            var c = connections[i]
        }
    }
}

class Node {
    constructor() {
        this.name = null;
        this.type = null;
        this.inputPins = [];
        this.outputPins = [];
        this.data = null;
    }
}

class Pin {
    constructor() {
        this.name = null;
        this.type = null;
        this.connections = [];
    }

    addConnection(node, data = null) {

    }
}

class Connection {
    constructor() {
        this.beginPin = null;
        this.endPin = null;
        this.data = null;
    }
}
