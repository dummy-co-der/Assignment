function getRepositories() {
  const username = document.getElementById("username").value;
  const perPage = document.getElementById("perPage").value;

  if (username.trim() === "") {
    alert("Please add a valid username.");
    return;
  }

  const userApiUrl = `https://api.github.com/users/${username}`;
  const repositoriesApiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}`;

  document.getElementById("loader").classList.remove("d-none");

  fetch(userApiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`User not found for username: ${username}`);
      }
      return response.json();
    })
    .then((user) => {
      displayUserInfo(user);
      return fetch(repositoriesApiUrl);
    })
    .then((response) => response.json())
    .then((repositories) => {
      document.getElementById("loader").classList.add("d-none");
      displayRepositories(repositories);
      perPageContainer.classList.remove("d-none");
    })
    .catch((error) => {
      document.getElementById("loader").classList.add("d-none");
      alert(`Error: ${error.message}`);
      perPageContainer.classList.add("d-none");
    });
}

function displayUserInfo(user) {
    const userInfoElement = document.getElementById("user-info");
    const userAvatarElement = document.getElementById("user-avatar");
  
    const userInfoContainer = document.createElement("div");
  
    if (window.innerWidth <= 768) {
      userInfoContainer.className = "d-flex flex-column align-items-center justify-content-center";
    } else {
      userInfoContainer.className = "d-flex align-items-center";
    }
  
    const avatarContainer = document.createElement("div");
    avatarContainer.style.marginRight = "20px";
    avatarContainer.style.marginLeft = "30px";
  
    userAvatarElement.src = user.avatar_url;
    avatarContainer.appendChild(userAvatarElement);
  
    const userDetailsContainer = document.createElement("div");
  
    const userNameElement = document.createElement("p");
    userNameElement.textContent = `${user.login}`;
    userNameElement.style.fontWeight = "bold";
  
    userDetailsContainer.appendChild(userNameElement);
  
    if (user.location) {
      const locationElement = document.createElement("p");
      locationElement.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${user.location}`;
      locationElement.style.fontSize = "0.6em";
      userDetailsContainer.appendChild(locationElement);
    }
  
    const bioElement = document.createElement("p");
    bioElement.textContent = `${user.bio || ""}`;
    bioElement.style.fontSize = "0.6em";
  
    userDetailsContainer.appendChild(bioElement);
  
    userInfoContainer.appendChild(avatarContainer);
    userInfoContainer.appendChild(userDetailsContainer);
  
    userInfoElement.innerHTML = "";
    userInfoElement.appendChild(userInfoContainer);
  
    userInfoElement.classList.remove("d-none");
    userAvatarElement.classList.remove("d-none");
  }
  
  // Event listener for window resize
  window.addEventListener("resize", () => {
    displayUserInfo(/* Pass the user data here */);
  });
  
  // Initial call to display user info
  displayUserInfo(/* Pass the user data here */);
  

function displayRepositories(repositories, currentPage) {
  const repositoriesContainer = document.getElementById("repositories");
  repositoriesContainer.innerHTML = "";

  if (repositories.length === 0) {
    repositoriesContainer.innerHTML = "<p>No repositories found.</p>";
    return;
  }

  repositories.forEach((repository, index) => {
    const repositoryElement = document.createElement("div");
    repositoryElement.className = "card mt-2 repository-card d-flex flex-wrap";

    const topicsHTML =
      repository.topics.length > 0
        ? repository.topics
            .map((tag) => `<p class="card-text1 mr-2">${tag}</p>`)
            .join("")
        : "";

    const languageHTML = repository.language
      ? `<p class="card-text1 mr-2">${repository.language}</p>`
      : "";

    const contentHTML =
      topicsHTML || languageHTML
        ? `${topicsHTML}${languageHTML}`
        : '<p class="card-text1">Not specified</p>';

    repositoryElement.innerHTML = `
          <div class="card-body">
              <h5 class="card-title">${repository.name}</h5>
              <p class="card-text">${
                repository.description || "No description available."
              }</p>
              <div class="d-flex flex-wrap">${contentHTML}</div>
          </div>
        `;

    repositoryElement.id = `repository-${index + 1}`;

    repositoriesContainer.appendChild(repositoryElement);
  });

  addPagination(repositories.length, currentPage);
}

function addPagination(totalRepositories, currentPage, perPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(totalRepositories / perPage);

  const pageButtonsContainer = document.createElement("div");
  pageButtonsContainer.style.display = "flex";
  pageButtonsContainer.style.justifyContent = "center";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "btn btn-outline-primary mr-2";
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => goToPage(i));
    pageButtonsContainer.appendChild(pageButton);
  }

  paginationContainer.appendChild(pageButtonsContainer);

  document.getElementById("perPage").value = perPage;
}

function goToPage(pageNumber) {
  const username = document.getElementById("username").value;
  const perPage = document.getElementById("perPage").value;
  const apiUrl = `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${pageNumber}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("loader").classList.add("d-none");

      displayRepositories(data, pageNumber, perPage);
    })
    .catch((error) => console.error("Error fetching data:", error));
}