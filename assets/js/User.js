class User {
    constructor(name, age, address, imgUrl) {
        this.name = name;
        this.age = age;
        this.address = address;
        this.imgUrl = imgUrl;
        this.favoriteRecepies = [];
        this.cookedRecepies = {};
    }

    addToFavorites(recepie) {
        this.favoriteRecepies.push(recepie);
    }

    removeFromFavorites(recepie) {
        let idx = this.favoriteRecepies.indexOf(recepie);
        this.favoriteRecepies.splice(idx, 1);
    }

    recepieIsLiked(recepie) {
        return this.favoriteRecepies.indexOf(recepie) !== -1;
    }


    addToCooked(recepie) {

        if (this.cookedRecepies[recepie.title]) { //ако вече е готвена веднъж
            this.cookedRecepies[recepie.title]++;
        } else { //ако не е готвена, създай пропърти с името на рецептата и сложи стойност 1 готвене
            this.cookedRecepies[recepie.title] = 1;
        }

    }

    recepieIsCooked(recepie) {
        return this.cookedRecepies[recepie.title] ? true : false;
    }


    search(text) {
        text = text.toLowerCase();
        return this.favoriteRecepies.filter(recepie => recepie.title.toLowerCase().includes(text))
    }


    filterByIngredient(ingredient) {
        return this.favoriteRecepies.filter(recepie => recepie.ingredients.includes(ingredient));
    }
}