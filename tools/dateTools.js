module.exports = {
  //'YYYY-MM-DD'格式转换为日期
  strToDate: function (str) {
    var array = str.split('-');
    //下面减一的原因直接看Date的构造函数的月份
    return new Date(parseInt(array[0]), parseInt(array[1]) - 1, parseInt(array[2]));
  },
  //日期转换为'YYYY-MM-DD'格式字符串，注意由于传入的是直接new的Date对象，因此月份+1
  dateToStr: function (date) {
    return date.getFullYear() + '-'
      + (date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '-'
      + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
  },
  addDate: function(date) {
    var d = new Date(date);
    d.setDate(d.getDate() + 1);
    return d;
  }
}