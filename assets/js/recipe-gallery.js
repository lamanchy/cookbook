(function () {
  "use strict";

  const sections = document.querySelectorAll(".recipe-content");
  if (!sections.length) {
    return;
  }

  const lightbox = createLightbox();
  const lightboxImage = lightbox.querySelector(".recipe-lightbox__image");
  const lightboxCaption = lightbox.querySelector(".recipe-lightbox__caption");
  const closeButton = lightbox.querySelector(".recipe-lightbox__close");
  const backdrop = lightbox.querySelector(".recipe-lightbox__backdrop");

  let previouslyFocused = null;

  sections.forEach((section) => {
    const nodes = Array.from(section.children);
    let buffer = [];

    const flushBuffer = () => {
      if (!buffer.length) {
        return;
      }

      const gallery = document.createElement("div");
      gallery.className = "recipe-gallery";
      buffer[0].before(gallery);

      buffer.forEach((paragraph) => {
        const img = paragraph.querySelector("img");
        if (!img) {
          return;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.className = "recipe-gallery__item";

        const altText = img.getAttribute("alt") || "";
        button.setAttribute(
          "aria-label",
          altText
            ? `Zobrazit obrázek: ${altText}`
            : "Zobrazit obrázek ve větší velikosti"
        );

        button.addEventListener("click", () => {
          openLightbox(img, altText);
        });

        button.appendChild(img);
        gallery.appendChild(button);
        paragraph.remove();
      });

      buffer = [];
    };

    nodes.forEach((node) => {
      if (
        node.tagName === "P" &&
        node.children.length === 1 &&
        node.firstElementChild &&
        node.firstElementChild.tagName === "IMG"
      ) {
        buffer.push(node);
      } else {
        flushBuffer();
      }
    });

    flushBuffer();
  });

  if (!lightbox.parentElement) {
    document.body.appendChild(lightbox);
  }

  closeButton.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hasAttribute("hidden")) {
      event.preventDefault();
      closeLightbox();
    }
  });

  function openLightbox(image, altText) {
    previouslyFocused =
      document.activeElement && document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = altText;
    lightboxCaption.textContent = altText;

    lightbox.removeAttribute("hidden");
    lightbox.classList.add("is-visible");
    document.body.classList.add("has-lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.setAttribute("hidden", "");
    lightbox.classList.remove("is-visible");
    document.body.classList.remove("has-lightbox-open");

    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }

    lightboxImage.removeAttribute("src");
  }

  function createLightbox() {
    const overlay = document.createElement("div");
    overlay.className = "recipe-lightbox";
    overlay.setAttribute("hidden", "");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    overlay.innerHTML = `
      <div class="recipe-lightbox__backdrop" data-action="close"></div>
      <figure class="recipe-lightbox__figure">
        <button type="button" class="recipe-lightbox__close" aria-label="Zavřít náhled">&times;</button>
        <img class="recipe-lightbox__image" alt="" />
        <figcaption class="recipe-lightbox__caption"></figcaption>
      </figure>
    `;

    return overlay;
  }
})();
