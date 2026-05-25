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
        title: "Binary Search через API",
        diff: 3,
        desc: "Реализовать бинарный поиск по заданному API с минимальным количеством запросов",
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
        title: "Полицейский детектив",
        diff: 1,
        desc: "Определить преступника, который видел всех убитых",
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
        title: "Selection Sort через API",
        diff: 3,
        desc: "Реализовать сортировку выбором используя только предоставленный API",
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
        desc: "Практика каррирования",
        file: "currying",
      },
    ],
  },
];
