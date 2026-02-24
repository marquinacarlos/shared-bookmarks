const data = {
	"1" : [],
	"2" : [],
	"3" : [],
	"4" : [],
	"5" : [],
}

/*
 * Source - https://stackoverflow.com/a/2117523
 * Funtion o generate a ramdon UUID
*/
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

/*
 * Create function to create each bookmarks
 */
function createBookmark (title , description , url) {
	const bookmark = {
		id : uuidv4(),
		url : url,
		title : title,
		description : description,
		createdAt : new Date().toISOString(),
		likes : 0,
	}
	return bookmark;
}

/* 
 * Implemment a function to push a bookmark object into a user array
 */
function pushBookmark (userId , bookmark ,) {
	const array = data[userId]
	array.push(bookmark)
}

pushBookmark("2", createBookmark("GOOGLE", "XXXXX", "URL"))
pushBookmark("2", createBookmark("INSTAGRAM", "IIIIIIII", "IG_URL"))
pushBookmark("2", createBookmark("AAAA", "AAAA", "XX_.com"))
console.log(data["2"])

/*
 * function to get a bookmark by userId and bookmarkId
 */
function getBookmark(userID, bookmarkId) {
	return data[userID].find(bookmark => bookmark.id === bookmarkId)
}

console.log("------------------------------------")
console.log(getBookmark("2", data["2"][1].id));

/*
 * Function to get likes from a bookmark
 */
function getLikes(bookmark) {
	return bookmark.likes;
}

const testBookmark = getBookmark("2", data["2"][1].id);
console.log("------------------------------------");
console.log("Likes: ", getLikes(testBookmark))

/*
 * this function hope to receive a bookmark object to increment the likes property 
 */
function incrementLike(bookmark) {
	bookmark.likes++
}

console.log("------------------------------------");
incrementLike(testBookmark)
incrementLike(testBookmark)
console.log("Likes incremented: ");
console.log(testBookmark)

// Here start the DOM manipulation
const users = Object.keys(data)
console.log(users)
const selectElmt = document.querySelector("#user-select");
const formElmt = document.querySelector("#bookmark-form");
console.log(selectElmt);

// inserting users to select tag
users.forEach((user, index) => {
	const optionElmt = document.createElement("option");
	optionElmt.selected = (index === 0);
	optionElmt.value = user;
	optionElmt.text = user;
	selectElmt.appendChild(optionElmt);
});

// listen changes on select tag
selectElmt.addEventListener("change", (event) => {
	console.log(`You have changed the user with id: ${selectElmt.value}` )
});

console.log(formElmt)
formElmt.addEventListener("submit", (event) => {
	event.preventDefault();
	const data = new FormData(event.target);
	console.table({
		url: data.get("url"),
		title: data.get("title"),
		description: data.get("description")
	});
	formElmt.reset();
});



//BOOKMARK-SECTION DISPLAYING USER BOOKMARKS

// Dom element for bookmark-section
 const bookmarkSection = document.querySelector("#bookmark-section");

 //Render bookmark
 function renderBookmarksForUser(userId) {
  bookmarkSection.innerHTML = "";
  const bookmarks = data[userId] || [];

  if (bookmarks.length === 0) {
    bookmarkSection.innerHTML = "<p>No bookmarks yet 👀</p>";
    return;
  }

  bookmarks.forEach(b => {
    const div = document.createElement("div");
    div.className = "bookmark-item";
    div.innerHTML = `
      <h3>${b.title}</h3>
      <a href="${b.url}" target="_blank">${b.url}</a>
      <p>${b.description}</p>
      <small>Likes: ${b.likes}</small>
      <button data-id="${b.id}">❤️ Like</button>
    `;

    // Like button
    div.querySelector("button").addEventListener("click", () => {
      incrementLike(b);
      renderBookmarksForUser(userId);
    });

    bookmarkSection.appendChild(div);
  });
}

//Event Listerner

// Change user → render their bookmarks
selectElmt.addEventListener("change", () => {
  renderBookmarksForUser(selectElmt.value);
});

// Submit form → add bookmark + render
formElmt.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const userId = selectElmt.value;

  const bookmark = createBookmark(
    formData.get("title"),
    formData.get("description"),
    formData.get("url")
  );

  pushBookmark(userId, bookmark);
  renderBookmarksForUser(userId);

  formElmt.reset();
});

// Initial Render
renderBookmarksForUser(selectElmt.value);

 

