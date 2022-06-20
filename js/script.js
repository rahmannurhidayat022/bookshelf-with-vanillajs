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
  const yearStr = document.getElementById('year').value;
  const year = parseInt(yearStr);
  const isComplete = document.getElementById('isComplete').checked;
  const id = generateId();
  const obj = generateBooktoObject(id, title, author, year, isComplete);
  books.push(obj);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
}

const changeIsComplete = (bookId) => {
  const book = findBook(bookId);
  
  if (book === null) return;

  book.isComplete = !book.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
}

function deleteBook(bookId) {
  const book = findBookbyIndex(bookId);

  if (book === -1) return;

  books.splice(book, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveDataToLocalStorage();
}

const searchKeyword = () => {
  let input = document.getElementById('keyword').value;
  input = input.toLowerCase();
  let x = document.getElementsByClassName('shelf__item');
  for (let i = 0; i < x.length; i++) {
    if (!x[i].innerHTML.toLowerCase().includes(input)) {
        x[i].style.display="none";
    }
    else {
        x[i].style.display="block";                 
    }
  }
}

const showModal = () => {
  const modalElmnt = document.getElementById('modal');
  const mainElmnt = document.getElementById('main');
  modalElmnt.classList.add('active')
  mainElmnt.classList.add('blur');
}

const closeModal = () => {
  const modalElmnt = document.getElementById('modal');
  const mainElmnt = document.getElementById('main');
  modalElmnt.classList.remove('active');
  mainElmnt.classList.remove('blur');
}

const renderTemplate = (book) => {
  return `
  <div key="${book.id}" class="shelf__item">
    <h3 class="shelf__title title__book">${book.title}</h3>
    <h4 class="shelf__subtitle">Author ${book.author}</h4>
    <h4 class="shelf__subtitle">Year: ${book.year}</h4>
    <div class="btn__group">
      <button onclick="changeIsComplete(${book.id})" class="btn btn__info">${book.isComplete === true ? 'to unread shelf' : 'to completed shelf'}</button>
      <button onclick="showModal()" class="btn btn__danger">Remove</button>
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