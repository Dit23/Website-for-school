function loadCSS() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'style.css';
  document.head.appendChild(link);
}

function loadContent(elementId, filePath, selector) {
  loadCSS(); // Load CSS dynamically because for some reason some issues arose (it took me 2 hours to fix this, im boutta commit)

  fetch(filePath)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Fehler beim Laden von ${filePath}: ${response.statusText}`);
          }
          return response.text();
      })
      .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const content = doc.querySelector(selector);
          console.log(content); // Check the content being loaded

          if (content) {
              document.getElementById(elementId).innerHTML = content.innerHTML;
          } else {
              console.error(`Element ${selector} nicht in ${filePath} gefunden.`);
          }
      })
      .catch((error) => {
          console.error("Ein Fehler ist aufgetreten:", error);
      });
}

document.addEventListener("DOMContentLoaded", () => {
  loadContent("header", "header.html", "header"); // Header laden
  loadContent("footer", "footer.html", "footer"); // Footer laden
});