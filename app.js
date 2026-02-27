//! Don't remove this mock data
// const data = {
// 	"1" : [],
// 	"2" : [
// 		{
// 			id: '7dbc706b-23d9-4718-b1d0-240efd2e1e89',
// 			url: 'URL',
// 			title: 'GOOGLE',
// 			description: 'description',
// 			createdAt: '2026-02-25T23:10:43.395Z',
// 			likes: 0
// 		},
// 		{
// 			id: '5d88f737-bd8a-4bb7-990f-e5fb2a549fca',
// 			url: 'IG_URL',
// 			title: 'INSTAGRAM',
// 			description: 'IIIIIIII',
// 			createdAt: '2026-02-25T23:10:43.401Z',
// 			likes: 0
// 		},
// 	],
// 	"3" : [],
// 	"4" : [
// 		{
// 			id: '0481a6b4-8cd5-4973-9879-8a8433837fd3',
// 			url: 'XX_.com',
// 			title: 'AAAA',
// 			description: 'AAAA',
// 			createdAt: '2026-02-25T23:10:43.401Z',
// 			likes: 0
// 		}
// 	],
// 	"5" : [],
// }

import { getUserIds, setData, getData } from './storage.js';

/*
 * Function to setup the data to localStorage
 */
function setInitialData() {
	const users = getUserIds();
	users.forEach((user) => {
		if (getData(user) === null) {
			setData(user, []);
		}
	});
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
function pushBookmark (userId , bookmark) {
	const array = getData(userId);
	array.push(bookmark);
	setData(selectElmt.value, array)
}

/*
 * function to get a bookmark by userId and bookmarkId
 */
function getBookmark(userID, bookmarkId) {
	return data[userID].find(bookmark => bookmark.id === bookmarkId)
}

//todo -> we can remove this function becouse we don't need it for now
/*
 * Function to get likes from a bookmark
 */
// function getLikes(bookmark) {
// 	return bookmark.likes;
// }

// todo -> we have to see this function in the future
/*
 * this function hope to receive a bookmark object to increment the likes property 
 */
// function incrementLike(bookmark) {
// 	bookmark.likes++
// 	setData()
// }

//* Here start the DOM manipulation
const users = getUserIds()

const selectElmt = document.querySelector("#user-select");
const formElmt = document.querySelector("#bookmark-form");
const bookmarkSection = document.querySelector("#bookmark-section");

//* inserting users to select tag
users.forEach((user, index) => {
	const optionElmt = document.createElement("option");
	optionElmt.selected = (index === 0);
	optionElmt.value = user;
	optionElmt.text = user;
	selectElmt.appendChild(optionElmt);
});

//* listen changes on select tag
selectElmt.addEventListener("change", () => {
	renderBookmarksForUser(selectElmt.value);
});

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

/*
 * Render bookmark
 */
function renderBookmarksForUser(userId) {
  bookmarkSection.innerHTML = "";
  // const bookmarks = data[userId] || [];
  const bookmarks = getData(userId) || [];

  if (bookmarks.length === 0) {
    bookmarkSection.innerHTML = "<p>No bookmarks yet 👀</p>";
    return;
  }

  bookmarks.forEach(bookmark => {
    const div = document.createElement("div");
    div.className = "bookmark-item";
    div.innerHTML = `
      <h3>${bookmark.title}</h3>
      <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
      <p>${bookmark.description}</p>
      <small>Likes: ${bookmark.likes}</small>
      <button data-id="${bookmark.id}">❤️ Like</button>
    `;

    //* Like button
    div.querySelector("button").addEventListener("click", () => {
			const array = getData(userId);
			const newData = array.map((bmk => {
				if(bmk.id === bookmark.id) {
					bmk.likes++
				}
				return bmk;
			}));
			setData(userId, newData);
      renderBookmarksForUser(userId);
    });

    bookmarkSection.appendChild(div);
  });
}

setInitialData();
renderBookmarksForUser(selectElmt.value);