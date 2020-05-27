module.exports.modelBook = (columns) => {
    var book = {};
    book.isbn = columns[0].value;
    book.titlu = columns[1].value;
    book.autor = columns[2].value;
    book.an = columns[3].value;
    book.editor = columns[4].value;
    book.imagine = columns[5].value;
    book.categorie = columns[6].value;
    book.pret = columns[7].value;
    book.descriere=columns[8].value;
    return book;
  }