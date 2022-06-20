// {
//   id: string | number,
//   title: string,
//   author: string,
//   year: number,
//   isComplete: boolean,
// }

const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APP';

const generateId = () => {
  return +new Date();
}

const generateBooktoObject = (id, title, author, year, isComplete) => {
  return { id, title, author, year, isComplete };
}

const findBook = (bookId) => {
  for (const book of books) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

const findBookbyIndex = (bookId) => {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const isStorageExist = () => {
  if (typeof (Storage) === undefined) {
    alert('The browser has no Storage!');
    return false;
  }
  return true;
}

const saveDataToLocalStorage = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const loadDataFromStorage = () => {
  const stringify = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(stringify);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

const addBook = () => {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const year = document.getElementById('year').value;
  const isComplete = document.getElementById('isComplete').checked;
  const id = generateId();
  const obj = generateBooktoObject(id, title, author, year, isComplete);
  books.push(obj);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
}

const renderTemplate = (book) => {
  return `
  <div key="${book.id}" class="shelf__item">
    <h3 class="shelf__title">${book.title}</h3>
    <h4 class="shelf__subtitle">Author ${book.author}</h4>
    <h4 class="shelf__subtitle">Years: ${book.year}</h4>
    <div class="btn__group">
      <button class="btn btn__info">${book.isComplete === true ? 'to unread shelf' : 'to completed shelf'}</button>
      <button class="btn btn__danger">Remove</button>
    </div>
  </div>
  `;
}

document.addEventListener('DOMContentLoaded', function() {
  const submitForm = document.getElementById('addBook');
  submitForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });

  if (isStorageExist()) loadDataFromStorage();
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data is was successfully to saved.');
});

document.addEventListener(RENDER_EVENT, function () {
  const completedShelfElmnt = document.getElementById('completedShelf');
  const unreadShelfElmnt = document.getElementById('unreadShelf');
  console.log(completedShelfElmnt, unreadShelfElmnt)
  let completedShelf = '';
  let unreadShelf = '';
  for (book of books) {
    if (book.isComplete === true) {
      completedShelf += renderTemplate(book);
    }
    if (book.isComplete === false) {
      unreadShelf += renderTemplate(book);
    }
  }
  completedShelfElmnt.innerHTML = completedShelf;
  unreadShelfElmnt.innerHTML = unreadShelf;
});