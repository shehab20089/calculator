// Record the number input of user on screen
document.querySelectorAll(".num-btns button").forEach((num) => {
  num.addEventListener("click", (e) => {
    document.querySelector(".screen").textContent +=
      e.target.getAttribute("calc-value");
  });
});

// Record the operation Input of user on screen

document.querySelectorAll(".operation-btns button").forEach((operation) => {
  operation.addEventListener("click", (e) => {
    const operationOptions = ["+", "-", "*", "/"];
    const screenValue = document.querySelector(".screen").textContent;
    // ensure to not add more than one operation at a time
    if (
      !operationOptions.includes(screenValue[screenValue.length - 1]) &&
      screenValue.length !== 0
    )
      document.querySelector(".screen").textContent +=
        e.target.getAttribute("operation-value");
  });
});
