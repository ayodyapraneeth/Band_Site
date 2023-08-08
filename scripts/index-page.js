document.addEventListener("DOMContentLoaded", function () {
  let preExistingComments;
  axios
    .get(
      "https://project-1-api.herokuapp.com/comments?api_key=e0eea5f0-0f8c-4b54-9fc4-ff50843766d4"
    )
    .then((response) => {
      preExistingComments = response.data;
      printExistingComments();
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const commentsContainer = document.querySelector(".comments__new-comments");

  function printExistingComments() {
    if (commentsContainer.children.length > 0) {
      return;
    }

    preExistingComments.forEach((commentData) => {
      const commentArticle = createCommentElement(commentData);
      commentsContainer.appendChild(commentArticle);
    });
  }

  document
    .querySelector(".comments__form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const inputName = document.querySelector("#name");
      const inputComment = document.querySelector("#comment");

      const nameValue = inputName.value.trim();
      const commentValue = inputComment.value.trim();

      if (nameValue === "" || commentValue === "") {
        inputName.classList.add("comments__error");
        inputComment.classList.add("comments__error");
        return;
      } else {
        inputName.classList.remove("comments__error");
        inputComment.classList.remove("comments__error");
        inputName.classList.add("comments__success");
        inputComment.classList.add("comments__success");
      }

      const postData = {
        name: nameValue,
        comment: commentValue,
      };


      axios
        .post(
          "https://project-1-api.herokuapp.com/comments?api_key=e0eea5f0-0f8c-4b54-9fc4-ff50843766d4",
          postData
        )
        .then((response) => {
          console.log("Response:", response.data);


          const createdComment = response.data;
          const commentArticle = createCommentElement(createdComment);

          commentsContainer.insertBefore(
            commentArticle,
            commentsContainer.firstChild
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      inputName.value = "";
      inputComment.value = "";

    });

  function createCommentElement(commentData) {
    const { name, comment, timestamp, likes } = commentData;

    const commentArticle = document.createElement("article");
    commentArticle.classList.add("comments__image-wrap");

    const imagePlaceholder = document.createElement("img");
    imagePlaceholder.classList.add("comments__image-placeholder");

    const innerArticle = document.createElement("article");
    innerArticle.classList.add("comments__comment-data");

    const nameAndDateArticle = document.createElement("article");
    nameAndDateArticle.classList.add("comments__timedata-set");

    const nameHeading = document.createElement("h3");
    nameHeading.textContent = name;

    const dateset = document.createElement("p");
    currentDate = new Date(timestamp).toLocaleString("en-US", {
      dateStyle: "short",
      timeStyle: "short",
    });
    dateset.textContent = currentDate;
    dateset.classList.add("comments__date");

    const commentParagraph = document.createElement("p");
    commentParagraph.textContent = comment;
    commentParagraph.classList.add("comments__wrapper");

    const commentAction = document.createElement("artical");
    commentAction.classList.add("comments__action")

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fas", "fa-trash", "comments__delete-icon");
    deleteIcon.addEventListener("click", function () {
      deleteComment(commentData.id);
      commentArticle.remove();
    });

    const commentLike = document.createElement("artical");
    commentLike.classList.add("comments__like");

    const likeIcon = document.createElement("i");
    likeIcon.classList.add("fas", "fa-thumbs-up", "comments__like-icon");
    likeIcon.addEventListener("click", function () {
      likeComment(commentData.id);
    });

    const likeCount = document.createElement("p");
    likeCount.textContent = likes;
    likeCount.classList.add("comments__like-count");

    commentLike.appendChild(likeIcon);
    commentLike.appendChild(likeCount);

    nameAndDateArticle.appendChild(nameHeading);
    nameAndDateArticle.appendChild(dateset);

    commentAction.appendChild(deleteIcon);
    commentAction.appendChild(commentLike);

    innerArticle.appendChild(nameAndDateArticle);
    innerArticle.appendChild(commentParagraph);
    innerArticle.appendChild(commentAction);

    commentArticle.appendChild(imagePlaceholder);
    commentArticle.appendChild(innerArticle);

    function likeComment(commentId) {
      axios
        .put(
          `https://project-1-api.herokuapp.com/comments/${commentId}/like?api_key=e0eea5f0-0f8c-4b54-9fc4-ff50843766d4`
        )
        .then((response) => {
          if (response.status === 200) {
            const updatedComment = response.data;
            likeCount.textContent = updatedComment.likes;
          } else {
            throw new Error("Error: " + response.status);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    function deleteComment(commentId) {
      axios
        .delete(
          `https://project-1-api.herokuapp.com/comments/${commentId}?api_key=e0eea5f0-0f8c-4b54-9fc4-ff50843766d4`
        )
        .then((response) => {
          if (response.status === 200) {
            console.log("Comment deleted successfully");
            commentArticle.remove();
          } else {
            throw new Error("Error: " + response.status);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    return commentArticle;
  }
});
