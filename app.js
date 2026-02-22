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
    console.log(array)
    array.push(bookmark)
    console.log(array)
}

const bookmarkX = createBookmark("GOOGLE", "XXXXX", "URL");

pushBookmark("2", bookmarkX)
pushBookmark("2", bookmarkX)
