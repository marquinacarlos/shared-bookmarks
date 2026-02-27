import { getData, setData } from './storage.js';

/*
 * Source - https://stackoverflow.com/a/2117523
 * Funtion o generate a ramdon UUID
*/
export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
    (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

/*
 * Create function to create each bookmarks
 */
export function createBookmark (title , description , url) {
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
export function pushBookmark (userId , bookmark) {
	const array = getData(userId);
	array.push(bookmark);
	setData(userId, array)
}

/*
 * function to get a bookmark by userId and bookmarkId
 */
export function getBookmark(userID, bookmarkId) {
	const bookmarks = getData(userID);
	return bookmarks.find(bookmark => bookmark.id === bookmarkId)
}
