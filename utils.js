function sortByPriority(data, order) {
  var prs = ['High', 'Medium', 'Low'];
  data.sort((a, b) => {
    var x = prs.indexOf(a.priority);
    var y = prs.indexOf(b.priority);
    if (x < y) return -1 * order;
    if (x > y) return 1 * order;
    return 0;
  });
  return data;
}

function sortByDate(data, order) {
  data.sort(function (a, b) {
    var x = new Date(a.date);
    var y = new Date(b.date);

    if (x < y) return -1 * order;
    if (x > y) return 1 * order;
    return 0;
  });
  return data;
}

function sortByTitle(data, order) {
  data.sort(function (a, b) {
    var x = a.title;
    var y = b.title;

    if (x < y) return -1 * order;
    if (x > y) return 1 * order;
    return 0;
  });
  return data;
}
module.exports = {
  sortByPriority,
  sortByDate,
  sortByTitle,
};
