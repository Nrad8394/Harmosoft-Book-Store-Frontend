const axios = require('axios');

// Base URL for API
const baseURL = 'https://api.harmosoftbookstore.co.ke/collections/';

// School ID variable
const schoolId = '606bfad7-6f6f-47af-aee4-d9fb2dd21a29';

// Collections data
const collections = [
  {
    items: [
      { item: "8LLWCA", quantity: 1, substitutable: true },
      { item: "O5N2O6", quantity: 1, substitutable: false },
      { item: "Q70M2I", quantity: 1, substitutable: true },
      { item: "7YWJOK", quantity: 1, substitutable: false },
      { item: "S2A57S", quantity: 1, substitutable: true },
      { item: "WA2NEX", quantity: 1, substitutable: false },
      { item: "DQDIED", quantity: 1, substitutable: true }
],
    name: "Term 3 2024 list",
    grade: "Grade 3",
    school: schoolId
  },
  {
    items: [
      { item: "QKCJYN", quantity: 1, substitutable: false },
      { item: "PSKHTC", quantity: 1, substitutable: true },
      { item: "932O6U", quantity: 1, substitutable: false },
      { item: "WSUH2O", quantity: 1, substitutable: true },
      { item: "9C5YRU", quantity: 1, substitutable: false },
      { item: "7ZIOP3", quantity: 1, substitutable: true },
      { item: "617OKR", quantity: 1, substitutable: false }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 7",
    school: schoolId
  },
  {
    items: [
      { item: "XT4UDW", quantity: 1, substitutable: true },
      { item: "MLKK20", quantity: 1, substitutable: false },
      { item: "FWCQ8F", quantity: 1, substitutable: true },
      { item: "LLZ32I", quantity: 1, substitutable: false },
      { item: "UC8CER", quantity: 1, substitutable: true },
      { item: "ECWW5E", quantity: 1, substitutable: false },
      { item: "P8JSHO", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Pre-Primary 2",
    school: schoolId
  },
  {
    items: [
      { item: "KQFD0X", quantity: 1, substitutable: false },
      { item: "ONKNXL", quantity: 1, substitutable: true },
      { item: "7J999T", quantity: 1, substitutable: false },
      { item: "ORYRM0", quantity: 1, substitutable: true },
      { item: "CD2X3D", quantity: 1, substitutable: false },
      { item: "2A72G3", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Pre-Primary 1",
    school: schoolId
  },
  {
    items: [
      { item: "HMWZRG", quantity: 1, substitutable: true },
      { item: "IUYRFY", quantity: 1, substitutable: false },
      { item: "LPY8PB", quantity: 1, substitutable: true },
      { item: "E2YRB7", quantity: 1, substitutable: false },
      { item: "LC8RB2", quantity: 1, substitutable: true },
      { item: "N6RL9V", quantity: 1, substitutable: false }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 1",
    school: schoolId
  },
  {
    items: [
      { item: "KGRTHV", quantity: 1, substitutable: false },
      { item: "VURYQV", quantity: 1, substitutable: true },
      { item: "SE6J1W", quantity: 1, substitutable: false },
      { item: "9Y4HW6", quantity: 1, substitutable: true },
      { item: "XD7QQD", quantity: 1, substitutable: false },
      { item: "5VZCYU", quantity: 1, substitutable: true },
      { item: "U4EBKK", quantity: 1, substitutable: false }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 2",
    school: schoolId
  },
  {
    items: [
      { item: "56N1K6", quantity: 1, substitutable: false },
      { item: "YV1V8B", quantity: 1, substitutable: true },
      { item: "LTEQBD", quantity: 1, substitutable: false },
      { item: "KZYW6N", quantity: 1, substitutable: true },
      { item: "DQI074", quantity: 1, substitutable: false },
      { item: "P1B7NW", quantity: 1, substitutable: true },
      { item: "9BBIZA", quantity: 1, substitutable: false },
      { item: "OGZHF0", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 8",
    school: schoolId
  },
  {
    items: [
      { item: "M93B8W", quantity: 1, substitutable: true },
      { item: "XS7FFH", quantity: 1, substitutable: false },
      { item: "D2NJRY", quantity: 1, substitutable: true },
      { item: "3XD67Z", quantity: 1, substitutable: false },
      { item: "PNM67Y", quantity: 1, substitutable: true },
      { item: "EU6EDS", quantity: 1, substitutable: false },
      { item: "M1CVAV", quantity: 1, substitutable: true },
      { item: "AHMOTA", quantity: 1, substitutable: false },
      { item: "3T8N5N", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 6",
    school: schoolId
  },
  {
    items: [
      { item: "DVCW2J", quantity: 1, substitutable: false },
      { item: "29LK70", quantity: 1, substitutable: true },
      { item: "YH2UZR", quantity: 1, substitutable: false },
      { item: "81VMWS", quantity: 1, substitutable: true },
      { item: "2774VH", quantity: 1, substitutable: false },
      { item: "USVS8S", quantity: 1, substitutable: true },
      { item: "S19FX8", quantity: 1, substitutable: false },
      { item: "VU1FEA", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 4",
    school: schoolId
  },
  {
    items: [
      { item: "8GYZV1", quantity: 1, substitutable: false },
      { item: "X08S3O", quantity: 1, substitutable: true },
      { item: "2G2B9Q", quantity: 1, substitutable: false },
      { item: "6HRZ15", quantity: 1, substitutable: true },
      { item: "TIST7F", quantity: 1, substitutable: false }
    ],
    name: "Term 3 2024 list",
    grade: "Play Group",
    school: schoolId
  },
  {
    items: [
      { item: "GDZTT1", quantity: 1, substitutable: false },
      { item: "2SQAWC", quantity: 1, substitutable: true },
      { item: "ZT5CY6", quantity: 1, substitutable: false },
      { item: "IL034R", quantity: 1, substitutable: true },
      { item: "PTD1TW", quantity: 1, substitutable: false },
      { item: "5VZCYU", quantity: 1, substitutable: true },
      { item: "7N4KSQ", quantity: 1, substitutable: false },
      { item: "3SN9VE", quantity: 1, substitutable: true }
    ],
    name: "Term 3 2024 list",
    grade: "Grade 5",
    school: schoolId
  }
];

// Function to send POST request
const createCollection = async (collection) => {
  try {
    const response = await axios.post(baseURL, collection);
    console.log(`Collection for ${collection.grade} created successfully:`, response.data);
  } catch (error) {
    console.error(`Error creating collection for ${collection.grade}:`, error.response?.data || error.message);
  }
};

// Sequentially create collections
const createCollectionsSequentially = async () => {
  for (const collection of collections) {
    await createCollection(collection);
  }
};

// Call the function
createCollectionsSequentially();