import { Edge } from "./classes/Edge";
import { Node } from "./classes/Node";
import { _ } from "lodash";

export class Graphs {
    /**
     * Creates an instance of Graphs.
     * @param {String} name nome do grafo
     * @memberof Graphs
     */
    constructor(name) {
        this.name = name;
        this.edges = [];
        this.nodes = [];
    }

    /**
     * @public
     * Adiciona um vértice ao Grafo
     * @param {String} name nome do vértice
     * @param {Number} value valor do vértice
     * @memberof Graphs
     */
    addNode(name, value) {
        this.nodes.push(new Node(name, value));
    }

    /**
     * @public
     * Pega um vértice a partir do nome
     * @param {String} name nome do vértice
     * @returns {Node} vértice encontrado
     * @memberof Graphs
     */
    getNode(name) {
        let found = null;
        this.nodes.forEach((node) => {
            if (node.name == name) found = node;
        });
        return found;
    }
    removeNode(value) {
        for (var i = 0; i < this.nodes.length; i++) {
            if(this.nodes[i].value != value){
                this.nodes = this.nodes.slice(i, 1);
            }
        }
    }
    /**
     * @public
     * Adiciona uma aresta ao grafo
     * @param {Node} source vértice de origem
     * @param {Node} target vértice de destino
     * @param {Number} value valor do vértice
     * @memberof Graphs
     */
    addEdge(source, target, value) {
        this.edges.push(new Edge(source, target, value));
    }

    /**
     * @public
     * Retorna a ordem do grafo
     * @returns {Number} ordem do grafo
     * @memberof Graphs
     */
    getOrder() {
        return this.nodes.length;
    }

    /**
     * @public
     * Retorna o tamanho do grafo
     * @returns {Number} tamanho do grafo
     * @memberof Graphs
     */
    getSize() {
        return this.edges.length;
    }

    /**
     * @public
     * Retorna os vizinhos de um vértice
     * @param {Node} node vértice
     * @returns {Array} vetor com os vértices vizinhos
     * @memberof Graphs
     */
    getNeighbors(node) {
        const nodes = [];
        this.edges.forEach((edge) => {
            if (node.value == edge.source.value) {
                edge.target.edgeValue = edge.value;
                nodes.push(edge.target);
            } else if (node.value == edge.target.value) {
                edge.target.edgeValue = edge.value;
                nodes.push(edge.source);
            }
        });
        return nodes;
    }

    /**
     * @public
     * Retorna o grau do vértice passado
     * @param {Node} node vértice
     * @returns {Number} valor do grau
     * @memberof Graphs
     */
    getDegree(node) {
        let degree = 0;
        this.edges.forEach((edge) => {
            if (node.value == edge.source.value) degree++;
            else if (node.value == edge.target.value) degree++;
        });
        return degree;
    }

    /**
     * @public
     * Verifica se o grafo é bipartido
     * @returns {Boolean} se o grafo é ou não bipartido
     * @memberof Graphs
     */
    isSplit() {
        return true;
    }

    /**
     * @public
     * Verifica se o vértice é uma articulação
     * @param {Node} node vértice
     * @returns {Boolean} se o vértice é uma articulação
     * @memberof Graphs
     */
    isArticulation(node) {
        return true;
    }

    /**
     * @public
     * Verifica se aresta é uma ponte
     * @param {Edge} edge aresta
     * @returns {Boolean} se a aresta é uma ponte
     * @memberof Graphs
     */
    isBridge(edge) {
        return true;
    }

    //TODO PENSAR
    widthSearch() {
        return returnNode;
    }

    //TODO PENSAR
    deepSearch() {
        return returnNode;
    }

    /**
     * @public
     * Retorna o número de componentes conexas do Grafo
     * @returns {Number} número de componentes conexas
     * @memberof Graphs
     */
    numberOfRelatedComponents() {
        let visited = [];
        const possibleNodes = [];

        let visitedLenght = 0;
        let possibleLenght = 0;
        let numberOfRelatedComponents = 0;

        //Enquanto o numero de nós visitados for menos que a ordem do grafo
        while(visitedLenght < this.getOrder()){
            numberOfRelatedComponents++;

            //encontra o primeiro nó que n foi visitado e o adiciona aos nós que podem ser explorados
            for (var i = 0; i < this.getOrder(); i++) {
                if(!_.find(visited, {value : this.nodes[i].value })){
                    possibleNodes.push(this.nodes[i]);
                    //Só pode ter um nó a ser explorado por vez, seus vizinhos serão adicionados
                    break;
                }
           }
            //para cada nó que pode ser explorado visitar todos seus vizinhos, e vizinhos de vizinhos etc
            //até não ser mais possivel, então passa para a proxima iteração do while, e Verifica se visitou
            //o mesmo numero de nós do grafo por completo
            for (var node in possibleNodes) {
                console.log(`oi`);
                //se ele não foi visitado
                if (!_.find(visited, { value: node.value })) {
                    //adiciona os vizinhos dele aos possiveis nós a ser visitado

                    for (var newNode in node.getNeighbors) {
                        //se o vizinho n foi visitado
                        if(!_.find(visited, { value: newNode.value})){
                            //ele pode ser explorado
                            possibleNodes.push(newNode);
                            possibleLenght++;
                        }
                    }
                    //Visita e aumenta o numero de nós visitados
                    visited.push(node);
                    visitedLenght++;
                }
                //zera o numero de nós a ser explorado, esse sera iniciado no inicio do while, passando para a
                //exploração do proximo componente conexo
                possibleNodes.length = 0;
                possibleLenght = 0;
            }
            return numberOfRelatedComponents;
        }
    }

    /**
     * @public
     * Retorna o caminho mínimo entre um vértice até todos os outros
     * @param {Node} source
     * @param {Node} target
     * @returns {Array} com vértices e suas respectivas distâncias
     * @memberof Graphs
     */
    getMinimumPath(source, target) {
        let visited = [source],
            path = [];

        const _search = (src) => {
            let neighbords = this.getNeighbors(src);

            neighbords = neighbords.filter(
                (neighbor) => !_.find(visited, { value: neighbor.value })
            );

            const node = _.find(path, { value: target.value });
            if (!node) {
                src = _.minBy(neighbords, "edgeValue");
                path.push(src);
                visited.push(src);
                return _search(src);
            } else {
                const value = path.reduce((r, edge) => {
                    r += edge.edgeValue;
                    return r;
                }, 0);
                return { value, path };
            }
        };

        return _search(source);
    }

    /**
     * @public
     * Verifica se grafo tem algum circuito negativo
     * @returns {Boolean} se grafo possui circuito negativo
     * @memberof Graphs
     */
    hasNegativeCircuit() {
        return true;
    }

    /**
     * @public
     * Retorna a árvore geradora mínima do grafo
     * @returns {Array} com a árvore geradora
     * @memberof Graphs
     */
    getMinimumGeneratingTree() {
        return tree;
    }

    /**
     * @public
     * Verifica se grafo é euleriano
     * @returns {Boolean} se grafo é euleriano
     * @memberof Graphs
     */
    isEurelian() {
        let isEurelian = true;
        this.nodes.forEach((node) => {
            if (this.getDegree(node) % 2 != 0) isEurelian = false;
        });
        return isEurelian;
    }

    /**
     * @public
     * Retorna um conjunto independente através de uma heurística gulosa
     * @returns {Array} conjunto independente de vértices
     * @memberof Graphs
     */
    getIndependentSet() {
        let visited = [];
        const nodes = [];

        this.nodes.forEach((node) => {
            if (!_.find(visited, { value: node.value })) {
                visited.push(node);
                nodes.push(node);
                visited = visited.concat(this.getNeighbors(node));
            }
        });

        return nodes;
    }
}
