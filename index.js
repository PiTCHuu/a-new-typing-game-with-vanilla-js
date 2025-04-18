document.addEventListener("DOMContentLoaded", function () {
  const animatedTexts = document.querySelectorAll(".animated-text");
  let currentIndex = 0;

  function rotateText() {
    animatedTexts.forEach((text) => {
      text.classList.remove("active");
    });
    currentIndex = (currentIndex + 1) % animatedTexts.length;
    animatedTexts[currentIndex].classList.add("active");
  }

  animatedTexts[0].classList.add("active");
  setInterval(rotateText, 3000);
});

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  let isValid = true;

  const username = document.getElementById("username").value;
  if (!username) {
    document.getElementById("username-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("username-error").style.display = "none";
  }

  const email = document.getElementById("email").value;
  if (!email || !email.endsWith("@gmail.com")) {
    document.getElementById("email-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("email-error").style.display = "none";
  }

  const password = document.getElementById("password").value;
  if (!password || password.length < 6) {
    document.getElementById("password-error").style.display = "block";
    isValid = false;
  } else {
    document.getElementById("password-error").style.display = "none";
  }

  if (isValid) {
    localStorage.setItem("username", username);

    window.location.href = "game.html";
  }
});
