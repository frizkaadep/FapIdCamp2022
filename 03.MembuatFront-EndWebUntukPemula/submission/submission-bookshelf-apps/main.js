const UNCOMPLETED_READ_ID = 'UnCompleteBookshelfList';
const COMPLETED_READ_ID = 'completeBookshelfList';
const BOOK_ITEM_ID = "itemId";
const STORAGE_KEY = "BOOKSHELF_APP";


let books = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);

    let data = JSON.parse(serializedData);

    if (data !== null)
        books = data;

    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function composeBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (book of books) {
        if (book.id === bookId)
            return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0;
    for (book of books) {
        if (book.id === bookId)
            return index;
        index++;
    }
    return -1;
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETED_READ_ID);
    let listCompleted = document.getElementById(COMPLETED_READ_ID);

    for (book of books) {
        const newBook = inputBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEM_ID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}

function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const book = inputBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    const bookObject = composeBookObject(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);

    book[BOOK_ITEM_ID] = bookObject.id;
    books.push(bookObject);

    if (inputBookIsComplete) {
        document.getElementById(COMPLETED_READ_ID).append(book);
    } else {
        document.getElementById(UNCOMPLETED_READ_ID).append(book);
    }
    updateDataToStorage();
}

function inputBook(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete) {
    const bookTitle = document.createElement('h3');
    bookTitle.classList.add('book-title');
    bookTitle.innerText = inputBookTitle;

    const bookAuthor = document.createElement('p');
    bookAuthor.classList.add('book-details');
    bookAuthor.innerText = inputBookAuthor;

    const bookYear = document.createElement('p');
    bookYear.classList.add('book-details');
    bookYear.innerText = inputBookYear;

    const buttons = document.createElement('div');
    buttons.classList.add('book-buttons');
    buttons.append(greenButton(inputBookIsComplete));
    buttons.append(orangeButton());
    buttons.append(redButton());

    const bookContainer = document.createElement('div');
    bookContainer.classList.add('book-card');
    bookContainer.append(bookTitle, bookAuthor, bookYear, buttons);

    return bookContainer;
};

function createButton(buttonType, buttonText, eventListener) {
    const button = document.createElement("button");
    button.innerText = buttonText;
    button.classList.add(buttonType);
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function greenButton(status) {
    return createButton('green-button', (status ? 'Belum Selesai' : 'Selesai'), function (event) {
        if (status) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
        } else {
            addBookToCompleted(event.target.parentElement.parentElement);
        }
    });
}

function orangeButton() {
    return createButton('orange-button', 'Edit', function (event) {
        editBook(event.target.parentElement.parentElement);
    });
}

function redButton() {
    return createButton('red-button', 'Hapus', function (event) {
        removeBook(event.target.parentElement.parentElement);
    });
}

function addBookToCompleted(taskElement) {
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = true;

    const newBook = inputBook(book.title, book.author, book.year, inputBookIsComplete = true);
    newBook[BOOK_ITEM_ID] = book.id;

    const bookCompleted = document.getElementById(COMPLETED_READ_ID);
    bookCompleted.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function editBook(taskElement) {
    const edit = document.querySelector('.edit-section');
    edit.removeAttribute("hidden");

    const book = findBook(taskElement[BOOK_ITEM_ID]);

    const editBookTitle = document.getElementById("editBookTitle");
    editBookTitle.value = book.title;
    const editAuthor = document.getElementById("editAuthor");
    editAuthor.value = book.author;
    const editYear = document.getElementById("editYear");
    editYear.value = book.year;
    const editBookIsComplete = document.getElementById("editBookIsComplete");
    editBookIsComplete.checked = book.isCompleted;

    const submitEdit = document.getElementById('edit-submit');
    submitEdit.addEventListener('click', function (event) {

        updateEditBook(editBookTitle.value, editAuthor.value, editYear.value, editBookIsComplete.checked, book.id);

        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    });
}

function updateEditBook(title, author, year, isComplete, id) {
    const bookStorage = JSON.parse(localStorage[STORAGE_KEY]);
    const bookIndex = findBookIndex(id);

    bookStorage[bookIndex] = {
        id: id,
        title: title,
        author: author,
        year: year,
        isCompleted: isComplete
    };

    const parsed = JSON.stringify(bookStorage);
    localStorage.setItem(STORAGE_KEY, parsed);

    location.reload(true);
}

function removeBook(taskElement) {
    const hapus = confirm('ingin menghapus buku?');
    if (hapus) {

        const bookPosition = findBookIndex(taskElement[BOOK_ITEM_ID]);
        books.splice(bookPosition, 1);

        taskElement.remove();
        updateDataToStorage();
    }
}

function undoBookFromCompleted(taskElement) {
    const book = findBook(taskElement[BOOK_ITEM_ID]);
    book.isCompleted = false;

    const newBook = inputBook(book.title, book.author, book.year, book.isCompleted);
    newBook[BOOK_ITEM_ID] = book.id;

    const uncompletedRead = document.getElementById(UNCOMPLETED_READ_ID);
    uncompletedRead.append(newBook);

    taskElement.remove();
    updateDataToStorage();
}

function searchBook(keyword) {
    const bookList = document.querySelectorAll('.book-card');
    for (let book of bookList) {
        const title = book.childNodes[0];
        if (!title.innerText.toLowerCase().includes(keyword)) {
            title.parentElement.style.display = 'none';
        } else {
            title.parentElement.style.display = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('input-book');
    submitForm.addEventListener('submit', function () {
        addBook();
    });

    const closeForm = document.getElementById('closeForm');
    closeForm.addEventListener('click', function () {
        const edit = document.querySelector('.edit-section');
        edit.setAttribute("hidden", '');
    })

    const searchButton = document.getElementById('searchSubmit');
    searchButton.addEventListener('click', function () {
        const keyword = document.getElementById('searchBookTitle').value;
        searchBook(keyword.toLowerCase());
    });

    if (isStorageExist()) { loadDataFromStorage() }
});

document.addEventListener("ondataloaded", () => {
    refreshDataFromBooks();
});

const lightBtn = document.querySelector('.fas');
const bodyElement = document.querySelector('body');

const lightMode = () => {
    bodyElement.classList.toggle('light');
}

lightBtn.addEventListener('click', () => {
    setLightMode = localStorage.getItem('light');
    if (setLightMode !== "on") {
        lightMode();
        setLightMode = localStorage.setItem('light', 'on');
    } else {
        lightMode();
        setLightMode = localStorage.setItem('light', null);
    }
});

let setLightMode = localStorage.getItem('light');

if (setLightMode === 'on') {
    lightMode();
}
