let showsInfo;

axios
  .get("https://project-1-api.herokuapp.com/showdates?api_key=e0eea5f0-0f8c-4b54-9fc4-ff50843766d4")
  .then((response) => {
    showsInfo = response.data;
    renderTables(showsInfo);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function createButton() {
  const button = document.createElement("button");
  button.classList.add("shows__button");
  button.textContent = "BUY TICKETS";
  return button;
}

function handleTableClick(event) {
  const innerArticles = document.querySelectorAll(".shows__table");
  innerArticles.forEach((innerArticle) => {
    innerArticle.classList.remove("selected");
  });

  const clickedInnerArticle = event.currentTarget;
  clickedInnerArticle.classList.add("selected");
}

function renderTables() {
  const container = document.querySelector("#booking");
  container.innerHTML = "";

  showsInfo.forEach((item) => {
    const outerArticle = document.createElement("article");
    outerArticle.classList.add("shows__booking");

    const innerArticle = document.createElement("article");
    innerArticle.classList.add("shows__table");

    const list = document.createElement("ul");
    list.classList.add("shows__table-container");

    Object.keys(item).forEach((key, keyIndex) => {
      if (keyIndex !== 0) {
        const listItem = document.createElement("li");
        listItem.classList.add("shows__table-row");

        const header = document.createElement("h3");
        header.textContent = key;
        header.classList.add("shows__table-head");

        const value = document.createElement("p");
        value.textContent = item[key];
        value.classList.add("shows__details");

        list.appendChild(listItem);
        listItem.appendChild(header);
        listItem.appendChild(value);

        if (keyIndex === 1) {
          value.classList.add("shows__date-data");
          value.textContent = new Date().toLocaleDateString();
        }
      }
    });

    innerArticle.appendChild(list);

    const button = createButton();
    innerArticle.appendChild(button);

    outerArticle.appendChild(innerArticle);
    container.appendChild(outerArticle);

    innerArticle.addEventListener("click", handleTableClick);
  });

  function handleResize() {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const tables = container.querySelectorAll(".shows__table");

    if (mediaQuery.matches) {
      for (let i = 1; i < tables.length; i++) {
        const headers = tables[i].querySelectorAll("h3");
        headers.forEach((header) => {
          header.style.display = "none";
        });
      }
    } else {
      const headers = container.querySelectorAll(".shows__table h3");
      headers.forEach((header) => {
        header.style.display = "";
      });
    }
  }

  window.addEventListener("resize", handleResize);

  handleResize();
}

