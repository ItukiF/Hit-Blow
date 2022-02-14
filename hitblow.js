const digits = 4;

const guesses = document.querySelector(".guesses");
const lastResult = document.querySelector(".lastResult");
const guessSubmit = document.querySelector(".guessSubmit");
const guessField = document.querySelector(".guessField");

let resetButton;

const pow = (base, exponents) => {
  let power = 1;

  for (let i = 0; i < exponents; i++) power *= base;
  return power;
};

const questioner = {
  answer: [],
  guessCount: 0,

  shuffle: function () {
    let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < digits; i++) {
      let index = Math.floor(Math.random() * (10 - i));
      questioner.answer[i] = numbers[index];
      numbers[index] = numbers[0];
      numbers.shift();
    }

    console.log(questioner.answer);
  },

  judgement: function () {
    hit = 0;
    blow = 0;

    for (let i = 0; i < digits; i++) {
      for (let j = 0; j < digits; j++) {
        if (questioner.answer[i] === responser.guessNumber[j])
          if (i === j) hit++;
          else blow++;
      }
    }

    this.guessCount++;
    responser.guessString = responser.guessNumber.map(String).join("");
    if (this.guessCount === 1) {
      guesses.innerHTML = "前回の予想:<br>";
    }
    guesses.innerHTML +=
      this.guessCount +
      " - " +
      responser.guessString +
      " : " +
      hit +
      "hit " +
      blow +
      "blow<br>";

    if (hit === digits) {
      lastResult.textContent = "おめでとう! 正解です!";
      lastResult.style.backgroundColor = "green";
      this.setGameOver();
    } else if (this.guessCount === 10) {
      lastResult.textContent = "!!!ゲームオーバー!!!";
      guesses.innerHTML += "Answer : " + this.answer.map(String).join("");
      this.setGameOver();
    } else {
      lastResult.innerHTML =
        "間違いです!<br>" +
        responser.guessString +
        " : " +
        hit +
        "hit" +
        blow +
        "blow";
      lastResult.style.backgroundColor = "red";
    }

    guessField.value = "";
    guessField.focus();
  },

  setGameOver: function () {
    guessField.disabled = true;
    guessSubmit.disabled = true;
    resetButton = document.createElement("button");
    resetButton.textContent = "新しいゲームを始める";
    document.body.appendChild(resetButton);
    resetButton.addEventListener("click", questioner.resetGame);
  },

  resetGame: function () {
    this.guessCount = 1;

    const resetParas = document.querySelectorAll(".resultParas p");
    for (let i = 0; i < resetParas.length; i++) {
      resetParas[i].textContent = "";
    }

    resetButton.parentNode.removeChild(resetButton);

    guessField.disabled = false;
    guessSubmit.disabled = false;
    guessField.value = "";
    guessField.focus();

    lastResult.style.backgroundColor = "white";

    questioner.shuffle();
  },
};
const responser = {
  guessNumber: [],
  guessString: null,

  checkSubmit: function () {
    let submit = Number(guessField.value);
    submitNumber = submit;

    if (submit < 0 || submit >= pow(10, digits)) {
      lastResult.textContent = "4桁の数字を入力してください";
      return false;
    }
    for (let i = digits - 1; i >= 0; i--) {
      this.guessNumber[digits - i - 1] = Math.floor(submit / pow(10, i));
      submit -= pow(10, i) * this.guessNumber[digits - i - 1];
    }

    for (let i = 0; i < digits; i++) {
      for (let j = 0; j < i; j++) {
        if (this.guessNumber[i] === this.guessNumber[j]) {
          lastResult.textContent = "各桁が異なる4桁の数字を入力してください";
          return false;
        }
      }
    }

    return true;
  },
};

function result() {
  if (responser.checkSubmit()) {
    questioner.judgement();
  }
}

questioner.shuffle();
guessSubmit.addEventListener("click", result);
