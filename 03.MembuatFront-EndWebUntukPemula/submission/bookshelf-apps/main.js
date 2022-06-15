/**
 * [
        {
            id: string | number,
            title: string,
            author: string,
            year: number,
            isComplete: boolean,
        }
 *  ]
 */

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function generateId() {
    return +new Date();
  }

function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
    return -1;
  }

  /**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
 function saveData() {
  if (isStorageExist()) {
    const parsed /* string */ = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see books}
 */

 function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

  const {id, title, author, year, isComplete} = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = ('Penulis: ' + author);

  const textYear = document.createElement('p');
  textYear.innerText = ('Tahun: ' + year);

  const container = document.createElement('article');
  container.classList.add('book_item')
  container.append(textTitle, textAuthor, textYear);
  container.setAttribute('id', `book-${id}`);

  if (isComplete) {

    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.innerText = ('Belum Selesai dibaca');
    buttonGreen.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('blue');
    editButton.innerText = ('Edit Buku');


    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = ('Hapus Buku');
    deleteButton.addEventListener('click', function (){
      removeBookFromCompleted(id);
    });

    const actionButton = document.createElement('div');
    actionButton.classList.add('action');
    actionButton.append(buttonGreen, editButton, deleteButton);

    container.append(actionButton);
  } else {

    const buttonGreen = document.createElement('button');
    buttonGreen.classList.add('green');
    buttonGreen.innerText = ('Selesai dibaca');
    buttonGreen.addEventListener('click', function () {
      addBookToCompleted(id);
    });

    const editButton = document.createElement('button');
    editButton.classList.add('blue');
    editButton.innerText = ('Edit Buku');

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';
    deleteButton.addEventListener('click', function () {
      removeBookFromCompleted(id);
    });

    const actionButton = document.createElement('div');
    actionButton.classList.add('action');
    actionButton.append(buttonGreen, editButton, deleteButton);

    container.append(actionButton);
  }

  return container;
}

function isChecked() {
  if(document.getElementById('inputBookIsComplete').checked) {
    const textChecked = document.getElementById('myChecked');
    textChecked.innerText = ('Selesai Dibaca');
  } else {
    const textChecked = document.getElementById('myChecked');
    textChecked.innerText = ('Belum Selesai Dibaca');
  }

}

function addBook() {
  const textTitle = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const textYear = document.getElementById('inputBookYear').value;
  const textCheck = document.getElementById('inputBookIsComplete').value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, textCheck);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert('Berhasil Terhapus')
}

function undoBookFromCompleted(bookId /* HTMLELement */) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm /* HTMLFormElement */ = document.getElementById('inputBook');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  const listCompleted = document.getElementById('completeBookshelfList');

  // clearing list item
  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

