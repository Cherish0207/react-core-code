let obj = {
  name: "cherish",
  age: 18,
};
console.log(JSON.stringify(obj, replacer, 2));
function replacer(key, value) {
  if (key == "age") {
    return (value += 10);
  } else {
    return value;
  }
}
