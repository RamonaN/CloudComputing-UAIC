module.exports.modelSale = (columns) => {
  var sale = {};
  sale.utilizator = columns[0].value;
  sale.isbn = columns[1].value;
  sale.valoare = columns[2].value;
  sale.dataInceperii = columns[3].value;
  sale.dataTerminarii = columns[4].value;
  return sale;
}