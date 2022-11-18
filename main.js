// Globals
const operationOptions = {
  "+": {
    func: (a, b) => {
      return a + b;
    },
    priority: 0,
  },
  "-": {
    func: (a, b) => {
      return a - b;
    },
    priority: 0,
  },
  x: {
    func: (a, b) => {
      return a * b;
    },
    priority: 1,
  },
  "/": {
    func: (a, b) => {
      return a / b;
    },
    priority: 1,
  },
};
const operationOptionsArr = ["+", "-", "x", "/"];

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
    const screenValue = document.querySelector(".screen").textContent;
    // ensure to not add more than one operation at a time
    if (
      !operationOptionsArr.includes(screenValue[screenValue.length - 1]) &&
      screenValue.length !== 0
    )
      document.querySelector(".screen").textContent +=
        e.target.getAttribute("operation-value");
  });
});

// Handle Equal sign click
document.querySelector(".equal").addEventListener("click", (e) => {
  const screenValue = document.querySelector(".screen").textContent;
  if (
    !operationOptionsArr.includes(screenValue[screenValue.length - 1]) &&
    screenValue.length !== 0
  ) {
    const result = calculateTheScreen(screenValue);
    document.querySelector(".screen").textContent += `=${result}`;
  }
});

function calculateTheScreen(screen) {
  const screenToArr = screen.split("");
  const operationIndexes = [];
  screenToArr.forEach((digit, i) => {
    if (operationOptionsArr.includes(digit)) {
      operationIndexes.push({ operation: digit, index: i });
    }
  });
  const highPriorityOperations = operationIndexes.filter((op) =>
    ["x", "/"].includes(op.operation)
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
      if (!["x", "/"].includes(element.operation)) {
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
    (op) => !["x", "/"].includes(op.operation)
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
  return screenToArr.join("");
}
