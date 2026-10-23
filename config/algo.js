// config/algo.js
// Folders become subcategories; files inside get path = folder.path || parent.folder
window.CFG_algo = [
  {
    type: "Folder",
    path: "algo/search",
    name: "Search",
    files: [
      {
        id: "binary_search",
        title: "Binary Search via API",
        diff: 3,
        desc: "Implement binary search over a given API with the minimal number of requests",
        file: "binary-search",
      },
    ],
  },
  {
    type: "Folder",
    path: "algo/logic",
    name: "Logic",
    files: [
      {
        id: "find_murderer",
        title: "Police Detective",
        diff: 1,
        desc: "Find the criminal: the suspect who saw all the killed people",
        file: "find-murderer",
      },
    ],
  },
  {
    type: "Folder",
    path: "algo/sorting",
    name: "Sorting",
    files: [
      {
        id: "selection_sort",
        title: "Selection Sort via API",
        diff: 3,
        desc: "Implement selection sort using only the provided API",
        file: "selection-sort",
      },
    ],
  },
  {
    type: "Folder",
    path: "algo/functional",
    name: "Functional",
    files: [
      {
        id: "currying",
        title: "Create a function add(4)(4)()",
        diff: 4,
        desc: "Chain calls of a function until a call without arguments returns the sum",
        file: "currying",
      },
      {
        id: "errors",
        title: "Process an object into array",
        diff: 2,
        desc: "Turn an object of error lists into an array of messages, without loops",
        file: "errors",
      },
    ],
  },
];
