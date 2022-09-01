class RecepieManager {
    constructor() {
        this.allRecepies = [];
        this.ingredients = new Set();
    }

    addRecepie(recepie) {
        this.allRecepies.unshift(recepie);

        recepie.ingredients.forEach(ingredient => { //в същото време взимаме от всяка рецепта съставките и ги бутаме в set
            this.ingredients.add(ingredient);
        })

    }

    isAlreadyAdded(recepie) {
        return this.allRecepies.some(r => r.title === recepie.title);
    }

    searchAndFilter(text, ingredient) { //комбинирана ф-я за търсене по няколко параметъра
        text = text.toLowerCase();

        if (text && ingredient) {
            return this.allRecepies.filter(recepie => recepie.title.toLowerCase().includes(text) && recepie.ingredients.includes(ingredient))
        } else if (text) {
            return this.allRecepies.filter(recepie => recepie.title.toLowerCase().includes(text)) //search по стрнинг
        } else if (ingredient) {
            return this.allRecepies.filter(recepie => recepie.ingredients.includes(ingredient)); //филтриране по параметър
        } else {
            return this.allRecepies; //връщай всички рецепти винаги, когато не сме търсили или филтрирали или и двете
        }

    }

}