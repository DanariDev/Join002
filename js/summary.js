window.addEventListener("load", () => {
    showGreeting();
    showDate();
  });
  
  function showGreeting() {
    const el = document.querySelector("#summary-greeting");
    const hour = new Date().getHours();
    let text = "Hello";
    if (hour < 12) text = "Good morning";
    else if (hour < 18) text = "Good afternoon";
    else text = "Good evening";
    const name = "Sofia Müller"; // Später dynamisch aus Firebase
    el.textContent = `${text}, ${name}`;
  }
  
  function showDate() {
    const el = document.querySelector("#summary-date");
    const now = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    el.textContent = now.toLocaleDateString('en-US', opts);
  }
  