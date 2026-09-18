class BTreeNode {
    constructor(leaf = true) {
        this.leaf = leaf;
        this.keys = [];
        this.values = [];
        this.children = [];
    }
}

class BTree {
    constructor(t = 2) {
        this.root = new BTreeNode(true);
        this.t = t;
    }

    search(key, node = this.root) {
        let i = 0;

        while (i < node.keys.length && key > node.keys[i]) {
            i++;
        }

        if (i < node.keys.length && key === node.keys[i]) {
            return node.values[i];
        }

        if (node.leaf) {
            return null;
        }

        return this.search(key, node.children[i]);
    }

    splitChild(parent, index) {
        const t = this.t;
        const fullChild = parent.children[index];
        const newChild = new BTreeNode(fullChild.leaf);

        const middleKey = fullChild.keys[t - 1];
        const middleValue = fullChild.values[t - 1];

        newChild.keys = fullChild.keys.splice(t);
        newChild.values = fullChild.values.splice(t);

        if (!fullChild.leaf) {
            newChild.children = fullChild.children.splice(t);
        }

        fullChild.keys.splice(t - 1);
        fullChild.values.splice(t - 1);

        parent.children.splice(index + 1, 0, newChild);
        parent.keys.splice(index, 0, middleKey);
        parent.values.splice(index, 0, middleValue);
    }

    insert(key, value) {
        const root = this.root;
        const t = this.t;

        if (root.keys.length === 2 * t - 1) {
            const newRoot = new BTreeNode(false);
            newRoot.children.push(root);
            this.root = newRoot;

            this.splitChild(newRoot, 0);
            this.insertNonFull(newRoot, key, value);
        } else {
            this.insertNonFull(root, key, value);
        }
    }

    insertNonFull(node, key, value) {
        let i = node.keys.length - 1;

        if (node.leaf) {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }

            node.keys.splice(i + 1, 0, key);
            node.values.splice(i + 1, 0, value);
        } else {
            while (i >= 0 && key < node.keys[i]) {
                i--;
            }

            i++;

            if (node.children[i].keys.length === 2 * this.t - 1) {
                this.splitChild(node, i);

                if (key > node.keys[i]) {
                    i++;
                }
            }

            this.insertNonFull(node.children[i], key, value);
        }
    }
}

module.exports = { BTree };
const tree = new BTree();

tree.insert("tdr1v9", "Medical Kit");
tree.insert("tdr1vd", "Water Supply");
tree.insert("tdr1vb", "Ambulance");

console.log("Medical:", tree.search("tdr1v9"));
console.log("Water:", tree.search("tdr1vd"));
console.log("Ambulance:", tree.search("tdr1vb"));