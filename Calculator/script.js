let toBeDisplayed = "";
let expression = "";
let inputs = {
  addition: [],
  subtraction: [],
  multiplication: [],
  division: [],
};
const tester = document.querySelector(".tester");
const output = document.getElementById("output");

const handleClick = (e) => {
  handleInput(e.target.innerText);
};

const handleInput = (input) => {
  if (output.innerText === "") {
    toBeDisplayed += input;
    expression +=
      input === "÷"
        ? "/"
        : input === "X"
        ? "*"
        : input;
  } else {
    toBeDisplayed = output.innerText;
    expression = output.innerText;
    output.innerText = "";
    toBeDisplayed += input;
    expression +=
      input === "÷"
        ? "/"
        : input === "X"
        ? "*"
        : input;
  }

  document.getElementById("pressed-input").innerText = toBeDisplayed;
};

const handleCompute = () => {
  output.style.color = '#7f8388'
  let tokens = expression.match(/(\d+(\.\d+)?|\+|\-|\√|\*|\/)/g);

  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      let left = parseFloat(tokens[i - 1]);
      let right = parseFloat(tokens[i + 1]);
      let result = tokens[i] === "*" ? left * right : left / right;
      tokens.splice(i - 1, 3, result.toString());
      i--;
    } else if (tokens[i] === "√") {
      let right = parseFloat(tokens[i + 1]);
      let result = (Math.sqrt(right)).toFixed(3);
      tokens.splice(i, 2, result.toString());
    } else {
      i++;
    }
  }

  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    let operator = tokens[i];
    let right = parseFloat(tokens[i + 1]);
    if (operator === "+") {
      result += right;
    } else if (operator === "-") {
      result -= right;
    }
  }

  if (result === Infinity) {
    alert("Divide by Zero error");
    toBeDisplayed = "";
    expression = "";
    document.getElementById("pressed-input").innerText = toBeDisplayed;
    output.innerText = "";
  }
  else if(isNaN(result)){
    output.innerText = 'Invalid Format'
    output.style.color = '#e96767'
  } else {
    document.getElementById("output").innerText = result;
  }
};

const handleClear = () => {
  toBeDisplayed = "";
  expression = "";
  document.getElementById("pressed-input").innerText = toBeDisplayed;
  output.innerText = "";
  document.getElementById("pressed-input").style.fontSize = `3.5rem`;
};

document.querySelectorAll(".button").forEach((button) => {
  button.addEventListener("click", handleClick);
});

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (!isNaN(key)) {
    handleInput(key);
  } else if (key === "+") {
    handleInput("+");
  } else if (key === "-") {
    handleInput("-");
  } else if (key === "*") {
    handleInput("X");
  } else if (key === "/") {
    handleInput("÷");
  } else if (key === "Enter") {
    e.preventDefault();
    handleCompute();
  } else if (key === "Escape" || key === "c" || key === "Backspace") {
    handleClear();
  }
});
