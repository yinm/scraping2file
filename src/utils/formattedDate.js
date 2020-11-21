function zeroPadding(string) {
  return `0${string}`.slice(-2);
}

module.exports = (date) => {
  const year = date.getFullYear();
  const month = zeroPadding(date.getMonth() + 1);
  const day = zeroPadding(date.getDate());
  const hour = zeroPadding(date.getHours());
  const min = zeroPadding(date.getMinutes());
  const sec = zeroPadding(date.getSeconds());

  return `${year}${month}${day}_${hour}${min}${sec}`;
};
