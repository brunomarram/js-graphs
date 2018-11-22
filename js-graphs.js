import { Edge } from "./classes/Edge";
import { Node } from "./classes/Node";
import { _ } from "lodash";

const fs = require("fs");

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
        return _.find(this.nodes, { name });
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
     * Retorna uma aresta
     * @param {String} source vertice fonte
     * @param {String} target vertice destino
     * @returns {Edge} aresta
     * @memberof Graphs
     */
    getEdge(source, target) {
        return _.find(this.edges, {
            source: { name: source },
            target: { name: target }
        });
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
     * @private
     * Retorna a cópia do objeto passado
     * @param {Object} obj objeto por parâmetro
     * @returns {Object} cópia do mesmo objeto
     * @memberof Graphs
     */
    _copy(obj) {
        return JSON.parse(JSON.stringify(obj));
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
        if (!node) return nodes;

        this.edges.forEach((edge) => {
            edge = this._copy(edge);
            if (node.value == edge.source.value) {
                edge.target.edgeValue = edge.value;
                nodes.push(edge.target);
            } else if (node.value == edge.target.value) {
                edge.source.edgeValue = edge.value;
                nodes.push(edge.source);
            }
        });
        return nodes;
    }

    /**
     * @public
     * Retorna os vizinhos de um vértice coloridos
     * @param {Node} node vértice
     * @returns {Array} vetor com os vértices vizinhos
     * @memberof Graphs
     */
    getColorsNeighbors(node) {
        const nodes = [];
        if (!node) return nodes;

        this.edges.forEach((edge) => {
            edge = this._copy(edge);
            if (node.value == edge.source.value) {
                edge.target.edgeValue = edge.value;
                nodes.push(this.getNode(edge.target.name));
            } else if (node.value == edge.target.value) {
                edge.source.edgeValue = edge.value;
                nodes.push(this.getNode(edge.source.name));
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
        const initialNodes = this._copy(this.nodes);
        let isSplit = true;

        this.nodes = this.nodes.map((node) => {
            return {
                name: node.name,
                value: node.value,
                color: -1
            };
        });

        const _dfsColor = (node, color) => {
            let result = true;
            node.color = color;
            this.getColorsNeighbors(node).forEach((neighbor) => {
                if (neighbor.color == -1) {
                    if (!_dfsColor(neighbor, 1 - color)) {
                        result = false;
                        return;
                    }
                } else {
                    if (neighbor.color == color) {
                        result = false;
                        return;
                    }
                }
            });
            return result;
        };

        this.nodes.forEach((node) => {
            if (node.color == -1) {
                if (!_dfsColor(this._copy(node), 0)) {
                    isSplit = false;
                    return;
                }
            }
        });

        this.nodes = initialNodes;
        return isSplit;
    }

    /**
     * @public
     * Verifica se o vértice é uma articulação
     * @param {Node} node vértice
     * @returns {Boolean} se o vértice é uma articulação
     * @memberof Graphs
     */
    isArticulation(node) {
        let relatedComponents = this.numberOfRelatedComponents(),
            isArticulation = false;

        const nodes = this._copy(this.nodes),
            edges = this._copy(this.edges);

        _.remove(this.nodes, { value: node.value });
        _.remove(this.edges, { source: { value: node.value } });
        _.remove(this.edges, { target: { value: node.value } });

        if (relatedComponents != this.numberOfRelatedComponents())
            isArticulation = true;

        this.nodes = nodes;
        this.edges = edges;

        return isArticulation;
    }

    /**
     * @public
     * Verifica se aresta é uma ponte
     * @param {Edge} edge aresta
     * @returns {Boolean} se a aresta é uma ponte
     * @memberof Graphs
     */
    isBridge(edge) {
        let relatedComponents = this.numberOfRelatedComponents(),
            isBridge = false;

        const edges = this._copy(this.edges);

        _.remove(this.edges, edge);

        if (relatedComponents != this.numberOfRelatedComponents())
            isBridge = true;

        this.edges = edges;

        return isBridge;
    }

    /**
     * @public
     * Realiza a busca em largura no grafo a partir do vertice
     * @param {Node} node no do grafo
     * @returns {Array} vertices visitados e seu numero
     * @memberof Graphs
     */
    widthSearch(initial) {
        const nodes = [];

        const _search = (node) => {
            if (!_.find(nodes, { value: node.value })) {
                nodes.push(node);
                this.getNeighbors(node).forEach((neighbor) => {
                    _search(neighbor);
                });
            }
        };

        _search(initial);

        return nodes;
    }

    /**
     * @public
     * Realiza a busca em profundidade no grafo
     * @returns {Array} vertices visitados e seu numero
     * @memberof Graphs
     */
    deepSearch() {
        let nodes = [];
        const initial = this.nodes[0];

        nodes = nodes.concat(this.widthSearch(initial));

        while (nodes.length != this.nodes.length) {
            const notVisited = _.differenceBy(this.nodes, nodes, "value");
            nodes = nodes.concat(this.widthSearch(notVisited[0]));
        }

        return nodes;
    }

    /**
     * @public
     * Retorna o número de componentes conexas do Grafo
     * @returns {Number} número de componentes conexas
     * @memberof Graphs
     */
    numberOfRelatedComponents() {
        const initial = this.nodes[0];
        let nodes = [],
            count = 1;

        nodes = nodes.concat(this.widthSearch(initial));

        while (nodes.length != this.nodes.length) {
            count++;
            const notVisited = _.differenceBy(this.nodes, nodes, "value");
            nodes = nodes.concat(this.widthSearch(notVisited[0]));
        }

        return count;
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
            path = { value: 0, path: [] };

        const _search = (src) => {
            let neighbords = this.getNeighbors(src);
            neighbords.forEach((node) => {
                if (node.value == target.value) {
                    path.path.push(node);
                    path.value += node.edgeValue;
                }
            });

            neighbords = neighbords.filter(
                (neighbor) => !_.find(visited, { value: neighbor.value })
            );

            let node = _.find(path.path, { value: target.value });

            // se ainda sim não encontrar, procura pelo menor caminho conhecido
            if (!node) {
                src = _.minBy(neighbords, "edgeValue");
                path.value += src.edgeValue;
                path.path.push(src);
                visited.push(src);
                return _search(src);
            } else {
                return path;
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
     * @private
     * Escreve a árvore no arquivo de saída
     * @param {Array} tree arvore
     * @param {String} fileName caminho do arquivo
     * @memberof Graphs
     */
    _writeTree(tree, fileName) {
        let file = tree.length + "\n";
        let weight = 0;
        tree.forEach((edge) => {
            file +=
                edge.source.name +
                " " +
                edge.target.name +
                " " +
                edge.value +
                "\n";
            weight += edge.value;
        });
        file += weight;

        fs.writeFile(process.env["PWD"] + fileName, file, (err) => {
            if (err) throw err;
        });
    }

    /**
     * @public
     * Retorna a árvore geradora mínima do grafo
     * @returns {Array} com a árvore geradora
     * @memberof Graphs
     */
    getMinimumGeneratingTree() {
        const visited = [],
            tree = [],
            edges = this._copy(this.edges);

        while (edges.length != 0) {
            const min = _.minBy(edges, "value");
            const index = _.findIndex(edges, min);
            if (_.find(visited, min.source) && _.find(visited, min.target))
                edges.splice(index, 1);
            else {
                visited.push(min.source, min.target);
                tree.push(min);
                edges.splice(index, 1);
            }
        }
        //Texto a ser escrito no arquivo

        var str;

        (str += "tamanho da arvore : "), tree.lenght;
        tree.forEach((edge) => {
            str += (edge.source, edge.target, edge.value);
        });

        this._writeTree(tree, "/private/arvores/arvore.txt");

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

        if (this.numberOfRelatedComponents() > 1) return false;

        this.nodes.forEach((node) => {
            if (this.getDegree(node) % 2 != 0) {
                isEurelian = false;
                return;
            }
        });

        return isEurelian;
    }

    /**
     * @public
     * Retorna um circuito euleriano pelo algoritmo de Hieholzer
     * @returns {Array} Circuito fechado
     * @memberof Graphs
     */
    eurelianCircuit() {
        const initialEdges = this._copy(this.edges);
        const initialNodes = this._copy(this.nodes);

        const visited = [],
            visitedNodes = [];
        let initial = this.getNode("5");
        let end = false;

        if (!this.isEurelian()) return null;

        const _createClosedCircuit = (node) => {
            if (end) return;
            visitedNodes.push(node);
            const neighbords = this.getNeighbors(node);
            neighbords.forEach((neighbord) => {
                if (end) return;
                visitedNodes.push(neighbord);
                let edge = this.getEdge(node.name, neighbord.name);
                if (!edge) edge = this.getEdge(neighbord.name, node.name);
                if (!edge) return;

                visited.push(edge);
                _.remove(this.edges, edge);

                if (
                    (edge.source.value == initial.value ||
                        edge.target.value == initial.value) &&
                    visited.length >= 2
                ) {
                    end = true;
                    return;
                } else {
                    _createClosedCircuit(neighbord);
                }
            });
            return;
        };

        _createClosedCircuit(initial);

        while (visited.length != initialEdges.length) {
            for (let i = 0; i < this.getOrder(); i++) {
                if (this.getDegree(this.nodes[i]) == 0) {
                    this.nodes.splice(i, 1);
                    i--;
                }
            }

            const intersection = _.intersectionBy(
                visitedNodes,
                this.nodes,
                "value"
            );

            initial = intersection[0];
            end = false;
            _createClosedCircuit(initial);
        }

        this.edges = initialEdges;
        this.nodes = initialNodes;
        return visited;
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
