document.addEventListener('DOMContentLoaded', function() {
  const texts = document.querySelectorAll('.animated-text');
  const typingSpeed = 50;
  const displayDuration = 4000; 
  const eraseSpeed = 30; 
  
  texts.forEach(text => {
      text.style.width = '0';
      text.style.visibility = 'hidden';
      text.style.opacity = '0';
      text.style.position = 'absolute';
      text.style.visibility = 'hidden';
      text.style.width = 'auto';
      text.style.whiteSpace = 'nowrap';
      text.style.opacity = '0';
      
      const actualWidth = text.offsetWidth;
      text.dataset.width = actualWidth + 'px';
      
      text.style.width = '0';
  });
  
  let currentIndex = 0;
  
  function showNextText() {
      texts.forEach(text => {
          text.classList.remove('active');
          text.style.width = '0';
          text.style.visibility = 'hidden';
          text.style.opacity = '0';
      });
    
      const currentText = texts[currentIndex];
      const fullWidth = currentText.dataset.width;
      const charCount = currentText.textContent.length;
  
      currentText.classList.add('active');
      currentText.style.visibility = 'visible';
      currentText.style.opacity = '1';
      
      const typingDuration = typingSpeed * charCount;
      currentText.style.transition = `width ${typingDuration}ms steps(${charCount}, end)`;

      setTimeout(() => {
          currentText.style.width = fullWidth;
          setTimeout(() => {
              const eraseDuration = eraseSpeed * charCount;
              currentText.style.transition = `width ${eraseDuration}ms steps(${charCount}, end)`;
              currentText.style.width = '0';
              setTimeout(() => {
                  currentIndex = (currentIndex + 1) % texts.length;
                  showNextText();
              }, eraseDuration);
              
          }, displayDuration);
      }, 100);
  }

  showNextText();
});

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById("login-form");
  
  loginForm.addEventListener("submit", function(e) {
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
      const loginButton = document.querySelector(".login-button");
      localStorage.setItem("username", username);
      loginButton.disabled = true;

      loginButton.textContent = "log in";
      
      setTimeout(() => {
        loginButton.textContent = "log in.";
      }, 300);
      
      setTimeout(() => {
        loginButton.textContent = "log in..";
      }, 600);
      
      setTimeout(() => {
        loginButton.textContent = "log in...";
      }, 900);

      setTimeout(() => {
        window.location.href = "game.html";
      }, 2000);
    }
  });
});