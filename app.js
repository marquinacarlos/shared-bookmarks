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


const bookmark = createBookmark("google", "description", "http://www.google.com")


console.log(bookmark)
