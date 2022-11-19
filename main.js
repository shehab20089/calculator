// Globals
const operationOptions = {
  "+": {
    func: (a, b) => {
      return a + b;
    },
  },
  "-": {
    func: (a, b) => {
      return a - b;
    },
  },
  "×": {
    func: (a, b) => {
      return a * b;
    },
  },
  "/": {
    func: (a, b) => {
      return a / b;
    },
  },
};
const operationOptionsArr = ["+", "-", "×", "/"];
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "."];
let reachedEqual = false;
let dotClicked = false;
const screen = document.querySelector(".screen");

function addNumberToScreen(number) {
  if (reachedEqual) {
    screen.textContent = "";
    reachedEqual = false;
  }
  if (number === ".") {
    if (dotClicked) return;
    if (!numberKeys.includes(screen.textContent[screen.textContent.length - 1]))
      return;
    dotClicked = true;
  }

  screen.textContent += number;
}
function numClicked(e) {
  addNumberToScreen(e.target.getAttribute("calc-value"));
}
// Record the number input of user on screen
document.querySelectorAll(".num-btns button").forEach((num) => {
  num.addEventListener("click", numClicked);
});

function addOperationToScreen(operation) {
  if (reachedEqual) {
    const resultValue = document
      .querySelector(".screen")
      .textContent.split("=")[1];
    screen.textContent = resultValue;
    reachedEqual = false;
  }
  const screenValue = screen.textContent;
  dotClicked = false;
  // ensure to not add more than one operation at a time
  if (
    !operationOptionsArr.includes(screenValue[screenValue.length - 1]) &&
    screenValue.length !== 0
  )
    screen.textContent += " " + operation + " ";
}

// Record the operation Input of user on screen
document.querySelectorAll("  button[operation-value]").forEach((operation) => {
  operation.addEventListener("click", (e) => {
    addOperationToScreen(e.target.getAttribute("operation-value"));
  });
});
function equalClicked() {
  const screenValue = screen.textContent;
  if (
    !operationOptionsArr.includes(screenValue[screenValue.length - 2]) &&
    screenValue.length !== 0 &&
    !screenValue.includes("=")
  ) {
    const result = calculateTheScreen(screenValue);
    screen.textContent += ` = ${result}`;
    reachedEqual = true;
  }
}
// Handle Equal sign click and take consideration to operator priority
document.querySelector(".equal").addEventListener("click", equalClicked);

function calculateTheScreen(screen) {
  const screenToArr = screen.split("");
  const operationIndexes = [];
  screenToArr.forEach((digit, i) => {
    if (operationOptionsArr.includes(digit)) {
      operationIndexes.push({ operation: digit, index: i });
    }
  });
  const highPriorityOperations = operationIndexes.filter((op) =>
    ["×", "/"].includes(op.operation)
  );

  highPriorityOperations.forEach((operation, i) => {
    // the location of the operation in relation to other operations
    const operationIndex = operationIndexes.findIndex(
      (op) => op.index == operation.index
    );
    const operationIndexOnScreen = operation.index;

    let leftLowPriorityOperationIndex = null;
    for (let j = operationIndex; j >= 0; j--) {
      const element = operationIndexes[j];
      if (!["×", "/"].includes(element.operation)) {
        leftLowPriorityOperationIndex = element.index;
        break;
      }
    }
    // get left and right of the operator
    const leftToTheOperator =
      operationIndex === 0
        ? screenToArr.slice(0, operation.index).join("")
        : screenToArr
            .slice(leftLowPriorityOperationIndex + 1, operation.index)
            .join("");
    const rightToTheOperator =
      operationIndex === operationIndexes.length - 1
        ? screenToArr.slice(operation.index + 1, screenToArr.length).join("")
        : screenToArr
            .slice(
              operation.index + 1,
              operationIndexes[operationIndex + 1].index
            )
            .join("");
    // calculate the function
    operationResult = operationOptions[operation.operation].func(
      Number(leftToTheOperator),
      Number(rightToTheOperator)
    );
    // update the indexes of the operators
    operationIndexes.forEach((op, index) => {
      if (index >= operationIndex)
        op.index =
          op.index -
          (leftToTheOperator.length + rightToTheOperator.length + 1) +
          (operationResult + "").length;
    });
    // update the value
    screenToArr.splice(
      operationIndexOnScreen - leftToTheOperator.length,
      leftToTheOperator.length + rightToTheOperator.length + 1,
      ...(operationResult + "").split("")
    );
  });
  operationIndexes.splice(0, operationIndexes.length);
  screenToArr.forEach((digit, i) => {
    if (operationOptionsArr.includes(digit))
      operationIndexes.push({ operation: digit, index: i });
  });
  const lowPriorityOperations = operationIndexes.filter(
    (op) => !["×", "/"].includes(op.operation)
  );
  // Calculate The screen low priority Operations
  lowPriorityOperations.forEach((operation, i) => {
    // get left and right of the operator
    const leftToTheOperator = screenToArr.slice(0, operation.index).join("");
    const rightToTheOperator =
      i === operationIndexes.length - 1
        ? screenToArr.slice(operation.index + 1, screenToArr.length).join("")
        : screenToArr
            .slice(operation.index + 1, operationIndexes[i + 1].index)
            .join("");
    // calculate the function
    operationResult = operationOptions[operation.operation].func(
      Number(leftToTheOperator),
      Number(rightToTheOperator)
    );
    // update the indexes of the operators
    operationIndexes.forEach((op) => {
      op.index =
        op.index -
        (leftToTheOperator.length + rightToTheOperator.length + 1) +
        (operationResult + "").length;
    });
    // update the value
    screenToArr.splice(
      0,
      leftToTheOperator.length + rightToTheOperator.length + 1,
      ...(operationResult + "").split("")
    );
  });
  return Math.round(Number(screenToArr.join("")) * 100) / 100;
}
function removeInput() {
  if (screen.textContent.length && !reachedEqual) {
    const screenVal = screen.textContent.split("");
    if (screenVal[screenVal.length - 1] === " ") screenVal.pop();
    screenVal.pop();
    screen.textContent = screenVal.join("");
  }
}
function addKey(e) {
  const keyValue = e.key;
  if (numberKeys.includes(keyValue)) {
    addNumberToScreen(keyValue);
  } else if (operationOptionsArr.includes(keyValue)) {
    addOperationToScreen(keyValue);
  } else if (keyValue === "*") addOperationToScreen("×");
  else if (keyValue === "Enter" || keyValue === "=") {
    equalClicked();
  } else if (keyValue === "Backspace") removeInput();
}
document.addEventListener("keydown", addKey);

document.querySelector(".clear").addEventListener("click", () => {
  screen.textContent = "";
});
document.querySelector(".back").addEventListener("click", removeInput);
