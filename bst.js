function Node(data) {
  this.data = data;
  this.left = null;
  this.right = null;
}

function clearArray(arr) {
  return [...new Set(arr)].sort((a, b) => a - b);
}

function BinarySearchTree(array) {
  const treeArray = clearArray(array);

  function buildTree(arr) {
    if (arr.length == 0) return null;
    if (arr.length == 1) return new Node(arr[0]);

    const mid = Math.floor(arr.length / 2);
    const root = new Node(arr[mid]);

    root.left = buildTree(arr.slice(0, mid));
    root.right = buildTree(arr.slice(mid + 1));

    return root;
  }

  let root = buildTree(treeArray);

  function prettyPrint(node = root, prefix = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  }

  function insert(value) {
    let node = root;
    let parent = null;
    while (node !== null) {
      parent = node;
      if (value < node.data) {
        node = node.left;
      } else if (value > node.data) {
        node = node.right;
      }
    }

    if (value < parent.data) {
      parent.left = new Node(value);
    } else if (value > parent.data) {
      parent.right = new Node(value);
    }

    if(!isBalanced()) reBalance();
  }

  function find(value) {
    let node = root;
    while (node !== null) {
      if (value < node.data) {
        node = node.left;
      } else if (value > node.data) {
        node = node.right;
      } else {
        return node;
      }
    }

    return null;
  }

  function deleteItem(value) {
    root = deleteNode(root, value);

    function deleteNode(node, value) {
      if (node === null) return node;

      if (value < node.data) {
        node.left = deleteNode(node.left, value);
      } else if (value > node.data) {
        node.right = deleteNode(node.right, value);
      } else {
        // check the children of the node
        if (node.left === null && node.right === null) {
          return null;
        }

        if (node.left === null) {
          return node.right;
        }

        if (node.right === null) {
          return node.left;
        }

        // we find the smalles in the right subtree

        let successor = node.right;
        while (successor && successor.left !== null) {
          successor = successor.left;
        }

        if (successor) {
          node.data = successor.data;
          node.right = deleteNode(node.right, successor.data);
        }
      }

      return node;
    }
  }

  function levelOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    const queue = [root];

    while (queue.length > 0) {
      let currentNode = queue.shift();
      callback(currentNode);

      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }
  }

  function inOrder(callback, node = root) {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    if (node !== null) {
      inOrder(callback, node.left);
      callback(node.data);
      inOrder(callback, node.right);
    }
  }

  function preOrder(callback, node = root) {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    if (node !== null) {
      callback(node.data);
      preOrder(callback, node.left);
      preOrder(callback, node.right);
    }
  }

  function postOrder(callback, node = root) {
    if (typeof callback !== "function") {
      throw new Error("Callback is required");
    }

    if (node !== null) {
      postOrder(callback, node.left);
      postOrder(callback, node.right);
      callback(node.data);
    }
  }

  function height(node) {
    if (node === null) return -1;

    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  }

  function depth(node) {
    let currentNode = root;
    let nodeDepth = 0;
    while (currentNode !== null) {
      if (currentNode.data === node.data) {
        return nodeDepth;
      }

      if (currentNode.data < node.data) {
        currentNode = currentNode.right;
        nodeDepth++;
      }

      if (currentNode.data > node.data) {
        currentNode = currentNode.left;
        nodeDepth++;
      }
    }

    return null;
  }

  function isBalanced() {
    // checks if the height of the left and right subtrees is between -1 <= h <= 1
    if (
      height(root.left) - height(root.right) <= 1 &&
      height(root.left) - height(root.right) >= -1
    ) {
      return true;
    }

    return false;
  }

  function reBalance() {
    const arr = [];
    inOrder((node) => arr.push(node));
    root = buildTree(arr);
  }

  return {
    prettyPrint,
    insert,
    deleteItem,
    find,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
  };
}


module.exports = { BinarySearchTree };