const data = {
	"1" : [],
	"2" : [],
	"3" : [],
	"4" : [],
	"5" : [],
}

/**
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
	const array = data[userId]
	array.push(bookmark)
}

pushBookmark("2", createBookmark("GOOGLE", "XXXXX", "URL"))
pushBookmark("2", createBookmark("INSTAGRAM", "IIIIIIII", "IG_URL"))
pushBookmark("2", createBookmark("AAAA", "AAAA", "XX_.com"))
console.log(data["2"])
