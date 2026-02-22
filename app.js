const data = {
    "1" : [],    
    "2" : [],    
    "3" : [],    
    "4" : [],    
    "5" : [],    
}


//Create function to create each bookmarks
function createBookmark (title , description , url) {
	const bookmark = {
		id : Date.now().toString(),
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


pushBookmark("2", createBookmark("GOOGLE", "GGGGGG", "GOOGLE.COM"))
pushBookmark("2", createBookmark("INSTAGRAM", "IGIGIGIG", "IG.COM"))
pushBookmark("2", createBookmark("YAHOO", "YYYYYY", "YAHOOO.COM"))

/*
 * Get bookmark by userId and bookmarkId
 */
function getBookmark(userId, bookmarkId) {
	return data[userId].find(item => item.id === bookmarkId);
}



console.log(
	getBookmark("2", data["2"][1].id)
)

