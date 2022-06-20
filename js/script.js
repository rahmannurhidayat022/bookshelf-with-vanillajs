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