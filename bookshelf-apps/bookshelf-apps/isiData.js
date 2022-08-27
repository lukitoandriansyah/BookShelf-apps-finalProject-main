const RENDER_EVENT = 'render-bookShelf';
let searchBookReq = '';
const localStorageBook = 'bookShelf-storage';

document.addEventListener(
    'DOMContentLoaded', function () {
        if (typeof (Storage) !== 'undefined') {
            if (localStorage.getItem(localStorageBook)  === null) {
                localStorage.setItem(localStorageBook, JSON.stringify([]));
            }
            document.dispatchEvent(new Event(RENDER_EVENT));

            const submitForm = document.getElementById("inputBook");
            submitForm.addEventListener(
                "submit", function (event) {
                    event.preventDefault();
                    addListBook();
                }
            );

            const searchSubmit = document.getElementById('searchSubmit');
            searchSubmit.addEventListener('click', function (event) {
                event.preventDefault();
                searchBookReq = document.getElementById('searchBookTitle').value
                document.dispatchEvent(new Event(RENDER_EVENT));
            });
        } else {
            alert('Browser tidak mendukung Web Storage');
        }


    }

);

function addListBook() {
    const listBookS = JSON.parse(localStorage.getItem(localStorageBook))
    const judulBuku = document.getElementById("inputBookTitle").value;
    const penulisBuku = document.getElementById("inputBookAuthor").value;
    const tahunTerbitBuku = document.getElementById("inputBookYear").value;
    const tandaCeklis = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generatedId();
    const listBookSObject = generatedListBookSObject(
        generatedID, judulBuku, penulisBuku,
        tahunTerbitBuku, tandaCeklis
    );
    listBookS.push(listBookSObject);
    localStorage.setItem(localStorageBook, JSON.stringify(listBookS));
    document.dispatchEvent(
        new Event(RENDER_EVENT)
    );
}

function generatedId() {
    return +new Date();
}

function generatedListBookSObject(
    id, judul, penulis, tahun, isComplete
) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isComplete
    }
}


document.addEventListener(RENDER_EVENT, function () {
    const listBookS = JSON.parse(localStorage.getItem(localStorageBook));
    console.log(listBookS);
    const listBookCompleted = document.getElementById("completeBookshelfList");
    const listBookUnCompleted = document.getElementById("incompleteBookshelfList");
    listBookCompleted.innerHTML = '';
    listBookUnCompleted.innerHTML = '';

    for (const listBookItem of listBookS) {
        if (listBookItem.isComplete && listBookItem.tahun.includes(searchBookReq)) {
            const bookElement = makeListBookComplete(listBookItem);
            listBookCompleted.append(bookElement);
        } else if (!listBookItem.isComplete && listBookItem.tahun.includes(searchBookReq)) {
            const bookElement = makeListBookInComplete(listBookItem);
            listBookUnCompleted.append(bookElement);
        }
    }
}
);


function makeListBookComplete(listBookSObject) {
    const textJudul = document.createElement('h3');
    textJudul.innerText = listBookSObject.judul;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = listBookSObject.penulis;

    const textTahun = document.createElement('p');
    textTahun.innerText = listBookSObject.tahun;

    const textPart = document.createElement('article');
    textPart.classList.add('book_item');

    const btnSelesai = document.createElement('button');
    btnSelesai.innerHTML = 'Belum Selesai dibaca';
    btnSelesai.classList.add('green');

    const btnHapus = document.createElement('button');
    btnHapus.innerHTML = 'Hapus buku'
    btnHapus.classList.add('red');

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action');
    actionDiv.append(btnSelesai, btnHapus)
    textPart.append(textJudul, textPenulis, textTahun, actionDiv);

    btnSelesai.addEventListener('click', function () {
        pindahBuku(listBookSObject.id);
    });

    btnHapus.addEventListener('click', function () {
        removeBook(listBookSObject.id);
    });

    return textPart;
}

function makeListBookInComplete(listBookSObject) {
    const textJudul = document.createElement('h3');
    textJudul.innerText = listBookSObject.judul;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = listBookSObject.penulis;

    const textTahun = document.createElement('p');
    textTahun.innerText = listBookSObject.tahun;

    const textPart = document.createElement('article');
    textPart.classList.add('book_item');

    const btnSelesai = document.createElement('button');
    btnSelesai.innerHTML = 'Selesai dibaca';
    btnSelesai.classList.add('green');

    const btnHapus = document.createElement('button');
    btnHapus.innerHTML = 'Hapus buku'
    btnHapus.classList.add('red');

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('action');
    actionDiv.append(btnSelesai, btnHapus)



    textPart.append(textJudul, textPenulis, textTahun, actionDiv);

    btnSelesai.addEventListener('click', function () {
        pindahBuku(listBookSObject.id);
    });

    btnHapus.addEventListener('click', function () {
        removeBook(listBookSObject.id);
    });

    return textPart;


}

function pindahBuku(bookSObjectId) {
    const bookTarget = findBook(bookSObjectId);
    if (bookTarget == null) return;
    bookTarget.isComplete = !bookTarget.isComplete;
    updateDataBook(bookTarget)
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookSObjectId) {
    const listBookS = JSON.parse(localStorage.getItem(localStorageBook))
    const bookTarget = findBook(bookSObjectId);

    if (bookTarget == null) return;

    listBookS.splice(bookTarget, 1);
    localStorage.setItem(localStorageBook, JSON.stringify(listBookS))
    document.dispatchEvent(new Event(RENDER_EVENT));
    return listBookS
}

function findBook(bookId) {
    const listBookS = JSON.parse(localStorage.getItem(localStorageBook))
    for (const listBookItem of listBookS) {
        if (listBookItem.id === bookId) {
            return listBookItem;
        }
    }
    return null;
}

function updateDataBook(book) {
    const listBookS = JSON.parse(localStorage.getItem(localStorageBook))
    const bookTarget = findBook(book.id);
    listBookS.splice(bookTarget, 1);
    listBookS.push(book)
    localStorage.setItem(localStorageBook, JSON.stringify(listBookS))
}

