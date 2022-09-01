class Recepie {
    constructor(title, href, ingredients, thumbnail) {
        this.title = title;
        this.href = href;
        this.ingredients = ingredients.split(", ");
        this.thumbnail = thumbnail;
    }
}


// {
//     "title": "Potato and Cheese Frittata",
//     "href": "http://allrecipes.com/Recipe/Potato-and-Cheese-Frittata/Detail.aspx",
//     "ingredients": "cheddar cheese, eggs, olive oil, onions, potato, salt",
//     "thumbnail": "http://img.recipepuppy.com/2.jpg"
// },