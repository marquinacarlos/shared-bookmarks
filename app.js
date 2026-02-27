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
import { uuidv4, createBookmark, pushBookmark, getBookmark } from './bookmarks.js';

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

/**
 * Trims leading and trailing whitespace from a string value.
 */
function sanitizeInput(value) {
	return value.trim();
}

/**
 * Prepends https:// to a URL if no protocol is present.
 */
function normalizeUrl(url) {
	if (!/^https?:\/\//i.test(url)) {
		return `https://${url}`;
	}
	return url;
}

/**
 * Checks if a string is a valid URL with http or https protocol.
 */
function isValidUrl(url) {
	try {
		const parsed = new URL(url);
		const hasValidProtocol = parsed.protocol === "http:" || parsed.protocol === "https:";
		const hasValidDomain = /^([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(parsed.hostname);
		return hasValidProtocol && hasValidDomain;
	} catch {
		return false;
	}
}

/**
 * Validates that title, description, and URL are not empty and the URL is valid.
 */
function validateForm(title, description, url) {
	if (title === "") {
		alert("Title cannot be empty.");
		return false;
	}
	if (description === "") {
		alert("Description cannot be empty.");
		return false;
	}
	if (!isValidUrl(url)) {
		alert("Please enter a valid URL.");
		return false;
	}
	return true;
}

/**
 * Copies a given text value to the clipboard.
 */
function copyToClipboard(value) {
	navigator.clipboard.writeText(value);
}

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

	const title = sanitizeInput(formData.get("title"));
	const description = sanitizeInput(formData.get("description"));
	const url = normalizeUrl(sanitizeInput(formData.get("url")));

	if (!validateForm(title, description, url)) {
		return;
	}

  const bookmark = createBookmark(title, description, url);
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



  const sorted = [...bookmarks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  sorted.forEach(bookmark => {
    const div = document.createElement("div");
    div.className = "bookmark-item";
    div.innerHTML = `
      <h3>${bookmark.title}</h3>
      <a href="${bookmark.url}" target="_blank">${bookmark.url}</a>
      <p>${bookmark.description}</p>
      <small>Likes: ${bookmark.likes}</small>
      <button class="like-btn" data-id="${bookmark.id}">❤️ Like</button>
      <button class="copy-btn">📋 Copy URL</button>
	  <button class="delete-btn">🗑️ Delete</button>
    `;

    //* Copy URL button
    div.querySelector(".copy-btn").addEventListener("click", () => {
      copyToClipboard(bookmark.url);
    });

    //* Like button
    div.querySelector(".like-btn").addEventListener("click", () => {
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

		//Delete Buttion 
	   div.querySelector(".delete-btn").addEventListener("click", () => {
      const ok = confirm("Delete this bookmark?");
      if (!ok) return;

      const array = getData(userId) || [];
      const newData = array.filter(bmk => bmk.id !== bookmark.id);

      setData(userId, newData);
      renderBookmarksForUser(userId);
    });

    bookmarkSection.appendChild(div);
  });
}

setInitialData();
renderBookmarksForUser(selectElmt.value);