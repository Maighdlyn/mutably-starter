$(document).ready(function(){

createBookRow = (title, author, bookId) => {
  $('.list-group').append(
    `<li class="row" data-book-id="${bookId}">
      <button class="editButton col-md-2">Edit</button>
      <button class="saveButton col-md-2 invisible">Save</button>
      <p class="col-md-4">${title}</p>
      <input class="col-md-4 invisible"  value="${title}"/>
      <p class="col-md-4">${author}</p>
      <input class="col-md-4 invisible"  value="${author}"/>
      <button class="deleteButton col-md-2">Delete</button>
    </li>`)
  bookRowEventListeners()
}

displayAllBooks = (mutablyResponse) => {
  for (i=0; i<mutablyResponse.books.length; i++) {
    const book = mutablyResponse.books[i]
    createBookRow(book.title, book.author, book._id)
  }
}

$.ajax({
  type: 'GET',
  url: 'https://mutably.herokuapp.com/books',
  success: (mutablyResponse) => {
    displayAllBooks(mutablyResponse)
    // eventListeners()
  }
})

const addBook = (title, author) => {
  event.preventDefault()
  $.ajax({
    type: 'POST',
    url: 'https://mutably.herokuapp.com/books',
    data: {title, author},
    success: (data) => {
      createBookRow(title, author, data._id)
    }
  })
}

const deleteBook = (bookId) => {
  $.ajax({
    type: 'DELETE',
    url: 'https://mutably.herokuapp.com/books/' + bookId,
    success: $('li[data-book-id="'+bookId+'"]').remove()
  })
}

const updateBook = (title, author, bookId) => {
  $.ajax({
    type: 'PUT',
    url: 'https://mutably.herokuapp.com/books/' + bookId,
    data: {title, author},
  })
}

// Event Listeners:

$('button.addBook').on('click', () => {
  const newBookForm = $('.newBook').serializeArray()

  const newBookTitle = newBookForm[0].value
  const newBookAuthor = newBookForm[1].value

  addBook(newBookTitle, newBookAuthor)
  $('form.newBook')[0].reset()
})

const bookRowEventListeners = () => {
  $('.deleteButton').on('click', function () {
    const bookId = $(this).parent().attr('data-book-id')
    deleteBook(bookId)
  })


  $('button.saveButton').on('click', function () {
    const bookId = $(this).parent().attr('data-book-id')
    const bookTitle = $(this).siblings('input')[0].value
    const bookAuthor = $(this).siblings('input')[1].value
    updateBook(bookTitle, bookAuthor, bookId)

    $(this).siblings('p')[0].innerText = bookTitle
    $(this).siblings('p')[1].innerText = bookAuthor
  })

  $('button.editButton, button.saveButton').on('click', function () {
    $(this).toggleClass('invisible')
    $(this).siblings('button.editButton, button.saveButton').toggleClass('invisible')
    $(this).siblings('p, input').toggleClass('invisible')
  })

}






});
