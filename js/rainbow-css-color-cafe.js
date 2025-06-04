// const colorNameCodeElems = document.querySelectorAll(".colors tbody tr > td:first-child > code");
// const colors = colorNameCodeElems.map((color) => color.textContent);
// console.log(colors);

class CSSColorNames extends HTMLElement {
  static #selectors = {
    colorInput: "#color-input",
    colorsForm: "form",
    copyToClipboardButton: ".copy-color-name",
    submitButton: ".submit-button",
    totalCount: "#total-count",
  };

  #cssNamedColorsSet = new Set([
    "silver",
    "gray",
    "white",
    "maroon",
    "red",
    "purple",
    "fuchsia",
    "green",
    "lime",
    "olive",
    "yellow",
    "navy",
    "blue",
    "teal",
    "aqua",
    "aliceblue",
    "antiquewhite",
    "aqua",
    "aquamarine",
    "azure",
    "beige",
    "bisque",
    "black",
    "blanchedalmond",
    "blue",
    "blueviolet",
    "brown",
    "burlywood",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "cornsilk",
    "crimson",
    "cyan",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgray",
    "darkgreen",
    "darkgrey",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkseagreen",
    "darkslateblue",
    "darkslategray",
    "darkslategrey",
    "darkturquoise",
    "darkviolet",
    "deeppink",
    "deepskyblue",
    "dimgray",
    "dimgrey",
    "dodgerblue",
    "firebrick",
    "floralwhite",
    "forestgreen",
    "fuchsia",
    "gainsboro",
    "ghostwhite",
    "gold",
    "goldenrod",
    "gray",
    "green",
    "greenyellow",
    "grey",
    "honeydew",
    "hotpink",
    "indianred",
    "indigo",
    "ivory",
    "khaki",
    "lavender",
    "lavenderblush",
    "lawngreen",
    "lemonchiffon",
    "lightblue",
    "lightcoral",
    "lightcyan",
    "lightgoldenrodyellow",
    "lightgray",
    "lightgreen",
    "lightgrey",
    "lightpink",
    "lightsalmon",
    "lightseagreen",
    "lightskyblue",
    "lightslategray",
    "lightslategrey",
    "lightsteelblue",
    "lightyellow",
    "lime",
    "limegreen",
    "linen",
    "magenta",
    "maroon",
    "mediumaquamarine",
    "mediumblue",
    "mediumorchid",
    "mediumpurple",
    "mediumseagreen",
    "mediumslateblue",
    "mediumspringgreen",
    "mediumturquoise",
    "mediumvioletred",
    "midnightblue",
    "mintcream",
    "mistyrose",
    "moccasin",
    "navajowhite",
    "navy",
    "oldlace",
    "olive",
    "olivedrab",
    "orange",
    "orangered",
    "orchid",
    "palegoldenrod",
    "palegreen",
    "paleturquoise",
    "palevioletred",
    "papayawhip",
    "peachpuff",
    "peru",
    "pink",
    "plum",
    "powderblue",
    "purple",
    "rebeccapurple",
    "red",
    "rosybrown",
    "royalblue",
    "saddlebrown",
    "salmon",
    "sandybrown",
    "seagreen",
    "seashell",
    "sienna",
    "silver",
    "skyblue",
    "slateblue",
    "slategray",
    "slategrey",
    "snow",
    "springgreen",
    "steelblue",
    "tan",
    "teal",
    "thistle",
    "tomato",
    "turquoise",
    "violet",
    "wheat",
    "white",
    "whitesmoke",
    "yellow",
    "yellowgreen",
  ]);

  #debounceTimeout;
  #elements;
  #sortedUniqueColorNames = [];
  #totalColorsCount = 0;
  #copyToClipBoardLabel = `
        <span class="visually-hidden">Copy</span> {{color}} <span class="visually-hidden"> to your clipboard.</span>
      `;

  #getElements() {
    return {
      colorInput: this.querySelector(CSSColorNames.#selectors.colorInput),
      colorsForm: this.querySelector(CSSColorNames.#selectors.colorsForm),
      submitButton: this.querySelector(CSSColorNames.#selectors.submitButton),
      totalCount: this.querySelector(CSSColorNames.#selectors.totalCount),
    };
  }

  constructor() {
    super();

    this.#elements = this.#getElements();

    this.#sortedUniqueColorNames = Array.from(
      this.#cssNamedColorsSet,
    ).toSorted();
    this.#totalColorsCount = this.#sortedUniqueColorNames.length;

    this.#listColorNames(this.#sortedUniqueColorNames);
    this.#addEventListeners();
  }

  /**
   * Updates the DOM to display a list of color names.
   * Removes any existing color names list, creates a new <ul> element,
   * and appends a <li> for each color in the provided array.
   * Each <li> contains a <span> with the color name and sets a CSS variable for the color.
   * The list is made accessible with appropriate ARIA attributes.
   *
   * @param {string[]} colors - An array of color names to display.
   * @private
   */
  #listColorNames(colors) {
    const { totalCount } = this.#elements;
    let container = this.querySelector(".color-names");

    if (container) {
      container.remove();
    }

    container = document.createElement("ul");
    container.classList.add("color-names");

    colors.forEach((color) => {
      const button = document.createElement("button");
      const item = document.createElement("li");

      button.dataset.color = color;
      button.innerHTML = this.#copyToClipBoardLabel.replace("{{color}}", color);
      button.classList.add("copy-color-name");

      item.style = `--color-name: ${color};`;
      item.appendChild(button);

      container.appendChild(item);
    });

    totalCount.textContent = `Showing ${colors.length} of ${this.#totalColorsCount} colors`;
    this.append(container);
  }

  /**
   * Filters the list of sorted unique color names based on the provided query string,
   * and updates the displayed list of color names accordingly.
   *
   * @param {string} query - The substring to filter color names by.
   * @private
   */
  #filterColorNames(query) {
    const colorNames = this.#sortedUniqueColorNames.filter((color) =>
      color.includes(query),
    );
    this.#listColorNames(colorNames);
  }

  #handleSubmit = (event) => {
    event.preventDefault();
    const { colorInput } = this.#elements;
    this.#filterColorNames(colorInput.value);
  };

  #handleInputChange = (event) => {
    if (this.#debounceTimeout) {
      clearTimeout(this.#debounceTimeout);
    }

    this.#debounceTimeout = setTimeout(() => {
      this.#filterColorNames(event.target.value);
    }, 300);
  };

  /**
   * Attaches event listeners to the color input and form elements.
   * - Listens for input events on the color input to filter color names as the user types.
   * - Listens for submit events on the form to filter color names when the form is submitted.
   * @private
   */
  #addEventListeners() {
    const { colorInput, colorsForm, submitButton } = this.#elements;

    colorInput.addEventListener("input", this.#handleInputChange);
    colorsForm.addEventListener("submit", this.#handleSubmit);

    this.addEventListener("change", async (event) => {
      if (event.target.value.toLowerCase() === "submit") {
        colorInput.removeEventListener("input", this.#handleInputChange);
        submitButton.hidden = false;
      } else if (event.target.value.toLowerCase() === "live") {
        colorInput.addEventListener("input", this.#handleInputChange);
        submitButton.hidden = true;
      }
    });

    this.addEventListener("click", async (event) => {
      const shouldCopyToClipboard = event.target.matches(
        CSSColorNames.#selectors.copyToClipboardButton,
      );

      if (!shouldCopyToClipboard) {
        return;
      }

      const colorName = event.target.dataset.color;
      const buttonContents = this.#copyToClipBoardLabel.replace(
        "{{color}}",
        colorName,
      );
      await navigator.clipboard.writeText(colorName);
      event.target.innerHTML = `${colorName} copied!`;

      setTimeout(() => {
        event.target.innerHTML = buttonContents;
      }, 2000);
    });
  }
}

customElements.define("css-color-names", CSSColorNames);
