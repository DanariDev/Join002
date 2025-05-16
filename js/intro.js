function startIntro() {
    console.log("startIntro() wurde gestartet");
  
    const introLogo = document.getElementById('intro-logo');
    const introWrapper = document.querySelector('.intro-wrapper');
    const loginContainer = document.getElementById('loginContainer');
    const loginLogo = document.querySelector('.logo');
  
    if (!introLogo || !introWrapper || !loginContainer || !loginLogo) {
      console.error('Ein oder mehrere Elemente nicht gefunden!');
      return;
    }
  
    
    setTimeout(() => {
      setTimeout(() => {
        introLogo.style.opacity = '0';
        introLogo.style.transition = 'opacity 0.5s ease';
  
        setTimeout(() => {
          introLogo.style.display = 'none';
          introWrapper.style.display = 'none'; 
          loginLogo.style.display = 'block';
          loginContainer.style.display = 'flex';
          loginContainer.style.opacity = '0';
          loginContainer.style.transition = 'opacity 0.6s ease';
  
          setTimeout(() => {
            loginContainer.style.opacity = '1';
          }, 50);
        }, 500);
      }, 500);
    }, 2000);
  }
  