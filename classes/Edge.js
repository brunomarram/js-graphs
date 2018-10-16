export class Edge {
    /**
     * Creates an instance of Edge.
     * @param {Node} source nó de origem
     * @param {Node} target nó de destino
     * @param {Number} value valor da aresta
     * @memberof Edge
     */
    constructor(source, target, value) {
        this.source = source;
        this.target = target;
        this.value = value;
    }
}
