// Sicherheitsmaßnahmen für dynamisches Laden von externen HTML-Inhalten

function loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'style.css';
    document.head.appendChild(link);
}

function loadDOMPurify(callback) {
    // Dynamisch das DOMPurify-Skript laden
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.4.7/purify.min.js";
    script.onload = callback; // Call the callback function once the script is loaded
    document.head.appendChild(script);
}

function loadContent(elementId, filePath, selector) {
    loadCSS(); // Load CSS dynamically

    // URL-Validization: only accept allowed paths
    const allowedPathPattern = /^\/?[a-zA-Z0-9_\-/.]+$/; // only paths like "header.html" are allowed
    if (!allowedPathPattern.test(filePath)) {
        console.error(`Unsecure filepath blocked ${filePath}`);
        return;
    }

    // Load DOMPurify first
    loadDOMPurify(() => {
        // Once DOMPurify is loaded, proceed with content fetching and sanitizing

        fetch(filePath)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error trying to load: ${filePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then((html) => {
                // use DOMPurify to sanitize (or clear out malicious code) the HTML
                const sanitizedHTML = DOMPurify.sanitize(html);

                // Parser used for processing the html contents into a new DOM document
                const parser = new DOMParser();
                const doc = parser.parseFromString(sanitizedHTML, "text/html");
                const content = doc.querySelector(selector);
                console.log(content); // Überprüfe den geladenen Inhalt

                if (content) {
                    const targetElement = document.getElementById(elementId);
                    if (targetElement) {
                        targetElement.innerHTML = DOMPurify.sanitize(content.innerHTML);
                    } else {
                        console.error(`Ziel-Element mit ID "${elementId}" nicht gefunden.`);
                    }
                } else {
                    console.error(`Element ${selector} nicht in ${filePath} gefunden.`);
                }
            })
            .catch((error) => {
                console.error("Ein Fehler ist aufgetreten:", error);
            });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Sicheres Laden von Header und Footer
    loadContent("header", "header.html", "header");
    loadContent("footer", "footer.html", "footer");
});