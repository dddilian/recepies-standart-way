(function () {

    let homePageEl = document.getElementById("homePage");
    let favoritesPageEl = document.getElementById("favoritesPage");
    let createRecepiePageEl = document.getElementById("createRecepiePage");
    let profilePageEl = document.getElementById("profilePage");
    let errorPageEl = document.getElementById("errorPage");
    let searhDivEl = document.getElementById("searchDiv");
    let searchEl = document.getElementById("searchEl");
    let selectEl = document.getElementById("selectEl");
    let cookedRecepiesTable = document.getElementById("cookedRecepiesTable");
    let profilePic = document.getElementById("profilePic");


    let createRecBtn = document.getElementById("createRecBtn");
    let createRecepieForm = document.getElementById("createRecForm");

    let editProfleForm = document.getElementById("editProfileForm");
    let submitBtnProfile = document.getElementById("submitBtnProfile");


    let homeRecepiesContainer = document.getElementById("homeRecepiesContainer");
    let favoritesRecepiesContainer = document.getElementById("favoritesRecepiesContainer");

    window.addEventListener("load", showPage);
    window.addEventListener("hashchange", showPage);

    //!1.Създай нов user
    let user = new User("Pesho", 24, "Sofia, Reduta", "./assets/images/guest.png");

    //!2.Създай recepieManager
    let recepieManager = new RecepieManager();

    //!3.Напълни с резепти от тип Recepie recepieManager
    recepies.forEach(recepie => {
        recepieManager.addRecepie(new Recepie(...Object.values(recepie))); //пълним recepieManager с рецепти от клас Recepie
    })

    //после този сет го ползваме, за да създадем option елемент за всяка съставка
    recepieManager.ingredients.forEach(ingredient => {
        let newOption = document.createElement("option");
        newOption.value = ingredient;
        newOption.innerText = ingredient;
        selectEl.append(newOption);
    })

    //!4.Ф-я, която играе ролята на hash рутер
    function showPage() {

        let hash = location.hash.slice(1);

        if (hash === "") {
            hash = "home"
        }

        switch (hash) {
            case "home":
                homePageEl.style.display = "block";
                searhDivEl.style.display = "flex";
                favoritesPageEl.style.display = "none";
                createRecepiePageEl.style.display = "none";
                profilePageEl.style.display = "none";
                errorPageEl.style.display = "none";
                printRecepies(recepieManager.allRecepies, homeRecepiesContainer);
                break;
            case "favorites":
                homePageEl.style.display = "none";
                searhDivEl.style.display = "flex";
                favoritesPageEl.style.display = "block";
                createRecepiePageEl.style.display = "none";
                profilePageEl.style.display = "none";
                errorPageEl.style.display = "none";
                printRecepies(user.favoriteRecepies, favoritesRecepiesContainer);
                break;
            case "create-recepie":
                homePageEl.style.display = "none";
                searhDivEl.style.display = "none";
                favoritesPageEl.style.display = "none";
                createRecepiePageEl.style.display = "flex";
                profilePageEl.style.display = "none";
                errorPageEl.style.display = "none";
                loadCreatePage();
                break;
            case "profile":
                homePageEl.style.display = "none";
                searhDivEl.style.display = "none";
                favoritesPageEl.style.display = "none";
                createRecepiePageEl.style.display = "none";
                profilePageEl.style.display = "flex";
                errorPageEl.style.display = "none";
                loadProfilePage(user.cookedRecepies);
                break;
            default:
                homePageEl.style.display = "none";
                searhDivEl.style.display = "none";
                favoritesPageEl.style.display = "none";
                createRecepiePageEl.style.display = "none";
                profilePageEl.style.display = "none";
                errorPageEl.style.display = "block";
                break;
        }


    }


    function printRecepies(recepies, container) {

        container.innerHTML = ""; //!зачистваме контейнера преди принтиране

        recepies.forEach(recepie => {

            let cardDiv = document.createElement("div");
            cardDiv.classList.add("card");

            let a = document.createElement("a");
            a.href = recepie.href;
            a.target = "_blank";

            let img = document.createElement("img");
            img.classList.add("cardImg");
            img.src = recepie.thumbnail;

            a.append(img);

            let h2 = document.createElement("h2");
            h2.classList.add("cardH2");
            h2.innerText = recepie.title;

            let p = document.createElement("p");
            p.classList.add("cardP");
            p.innerText = recepie.ingredients.join(", ");

            let btnsDiv = document.createElement("div");
            btnsDiv.classList.add("cardBtnsDiv");

            let likeBtn = document.createElement("button");
            likeBtn.classList.add("likeBtn");

            if (user.recepieIsLiked(recepie)) {
                likeBtn.innerText = "Премахни от любими"
            } else {
                likeBtn.innerText = "Добави в любими"
            }

            let cookBtn = document.createElement("button");
            cookBtn.classList.add("cookBtn");
            cookBtn.innerText = "Сготви";


            //логика за бутоните
            likeBtn.addEventListener("click", function (e) {

                if (user.recepieIsLiked(recepie)) {
                    user.removeFromFavorites(recepie);
                    likeBtn.innerText = "Добави в любими";

                    if (location.hash === "#favorites") { //за да се разкара елемента, ако сме на страница favorites
                        e.target.parentElement.parentElement.remove();
                    }

                } else {
                    user.addToFavorites(recepie);
                    likeBtn.innerText = "Премахни от любими";
                }

            })

            cookBtn.addEventListener("click", function (e) {
                console.log(e);
                user.addToCooked(recepie);
            })

            btnsDiv.append(likeBtn, cookBtn);

            cardDiv.append(a, h2, p, btnsDiv);
            container.append(cardDiv);
        })

    }


    //!search by name
    searchEl.addEventListener("input", function (e) {

        let searchStr = e.target.value;

        //има значение къде търсим
        if (location.hash === "#home") {
            // let results = recepieManager.search(searchStr);

            let results = recepieManager.searchAndFilter(searchStr, selectEl.value);

            printRecepies(results, homeRecepiesContainer);


        } else if (location.hash = "#favorites") {
            let results = user.search(searchStr);
            printRecepies(results, favoritesRecepiesContainer);
        }

    })

    //!filter by ingredient
    selectEl.addEventListener("change", function (e) {

        let ingredient = e.target.value;

        if (location.hash === "#home") {
            // let results = recepieManager.filterByIngredient(ingredient);

            let results = recepieManager.searchAndFilter(searchEl.value, e.target.value);

            printRecepies(results, homeRecepiesContainer);
        } else if (location.hash = "#favorites") {
            let results = user.filterByIngredient(ingredient);
            printRecepies(results, favoritesRecepiesContainer);
        }

    })


    //!Print cooked recepies in profile page
    function loadProfilePage(cookedRecepiesObj) {

        console.log(user);

        //!Profile edit logic
        //Disabled, ако не са попълнени всички полета
        editProfleForm.addEventListener('input', function (e) {
            if (this.checkValidity()) {
                submitBtnProfile.removeAttribute('disabled');
            } else {
                submitBtnProfile.setAttribute('disabled', true);
            }
        });

        //Попълни полетата с текущите данни на user
        editProfileForm.name.value = user.name
        editProfileForm.age.value = user.age;
        editProfileForm.address.value = user.address;
        editProfileForm.imgUrl.value = user.imgUrl; //закоментирай, за да ползвай upload

        // let profileUpload = document.getElementById("profile-upload"); //откоментирай, за да ползвай upload

        //откоментирай цялото, за да ползвай upload:
        // let newSrc;

        // profileUpload.addEventListener('change', function (e) {
        //     let fileReader = new FileReader();
        //     console.log("faf");
        //     fileReader.addEventListener('load', function (event) {
        //         console.log(event);
        //         newSrc = event.target.result;
        //         // profilePic.src = event.target.result;
        //         // user.imgUrl = event.target.result;
        //     })

        //     fileReader.readAsDataURL(this.files[0]);
        // });



        //при submit event на формата, вземи въведените данни и ги сложи на user
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let form = this.elements;

            user.name = editProfileForm.name.value;
            user.age = editProfileForm.age.value;
            user.address = editProfileForm.address.value;
            user.imgUrl = editProfileForm.imgUrl.value; //закоментирай, за да ползваш upload
            // user.imgUrl = newSrc; //откоментирай, за да ползвай upload

            //Сложи новото src и на елемента profilePic, за да се смени аватара

            profilePic.src = editProfileForm.imgUrl.value; //закоментирай, за да ползвай upload
            //profilePic.src = newSrc; //откоментирай, за да ползвай upload


            //зачисти инпутите
            form.name.value = "";
            form.age.value = "";
            form.address.value = "";
            form.imgUrl.value = ""; //закоментирай, за да ползвай upload

        });



        cookedRecepiesTable.innerHTML = ""; //!зачистваме таблицата преди принтиране

        for (let key in cookedRecepiesObj) {

            let newTr = document.createElement("tr");
            let td1 = document.createElement("td");
            let td2 = document.createElement("td");

            td1.innerText = key;
            td2.innerText = cookedRecepiesObj[key];

            newTr.append(td1, td2);
            cookedRecepiesTable.append(newTr);
        }

    }


    function loadCreatePage() {

        //!Create recepie logic
        //Disabled, ако не са попълнени всички полета
        createRecepieForm.addEventListener('input', function (e) {
            if (this.checkValidity()) {
                createRecBtn.removeAttribute('disabled');
            } else {
                createRecBtn.setAttribute('disabled', true);
            }
        });

        //при submit event на формата, вземи инпутите от полетата и създай нова рецепта
        createRecepieForm.addEventListener('submit', function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            let form = this.elements;
            // console.log(form);

            let newRec = new Recepie(
                form.title.value,
                form.href.value,
                form.ingredients.value,
                form.thumbnail.value
            );

            console.log(newRec);
            //ако рецепта с този title не съществува, вкарай я при останалите
            if (!recepieManager.isAlreadyAdded(newRec)) {
                recepieManager.addRecepie(newRec);

                //ако искат да зачистим след submit
                form.title.value = "";
                form.href.value = "";
                form.ingredients.value = "";
                form.thumbnail.value = "";

            } else {
                return;
            }

        });


    }



})();







// let fileUpload = document.getElementById('profile-upload'); //!инпут полето за upload-ване на снимка
// let profilePic = document.getElementById('profile-pic'); //!img eлемента, на който ще сменим src-то

//!Закачаме listener на img-то за клик, все едно сме натиснали upload бутона
// document.getElementById('profile-pic').addEventListener('click', function(){
//     fileUpload.click();
// });


// fileUpload.addEventListener('change', function(e) {
//     let fileReader = new FileReader();

//     fileReader.addEventListener('load', function(event) {
//         profilePic.src = event.target.result;
//         user.profilePic = event.target.result;
//     })

//     fileReader.readAsDataURL(this.files[0]);
// });





















// (function () {

//     let homePageEl = document.getElementById("homePage");
//     let favoritesPageEl = document.getElementById("favoritesPage");
//     let createRecepiePageEl = document.getElementById("createRecepiePage");
//     let profilePageEl = document.getElementById("profilePage");
//     let errorPageEl = document.getElementById("errorPage");
//     let searhDivEl = document.getElementById("searchDiv");
//     let searchEl = document.getElementById("searchEl");
//     let selectEl = document.getElementById("selectEl");
//     let cookedRecepiesTable = document.getElementById("cookedRecepiesTable");
//     let submitBtnProfile = document.getElementById("submitBtnProfile");
//     let createRecBtn = document.getElementById("createRecBtn");

//     let homeRecepiesContainer = document.getElementById("homeRecepiesContainer");
//     let favoritesRecepiesContainer = document.getElementById("favoritesRecepiesContainer");

//     window.addEventListener("load", showPage);
//     window.addEventListener("hashchange", showPage);

//     let user = new User("Pesho", 24, "Sofia, Reduta", "./assets/images/guest.png");
//     console.log(user);
//     let recepieManager = new RecepieManager();

//     let ingredientsSet = new Set();

//     recepies.forEach(recepie => {
//         recepieManager.addRecepie(new Recepie(...Object.values(recepie))); //пълним recepieManager с рецепти от клас Recepie

//         recepie.ingredients.split(", ").forEach(ingredient => { //в същото време взимаме от всяка рецепта съставките и ги бутаме в set
//             ingredientsSet.add(ingredient);
//         })

//     })

//     //после този сет го ползваме, за да създадем option елемент за всяка съставка
//     ingredientsSet.forEach(ingredient => {
//         let newOption = document.createElement("option");
//         newOption.value = ingredient;
//         newOption.innerText = ingredient;
//         selectEl.append(newOption);
//     })

//     // console.log(recepieManager.allRecepies);


//     function showPage() {

//         let hash = location.hash.slice(1);

//         if (hash === "") {
//             hash = "home"
//         }

//         switch (hash) {
//             case "home":
//                 homePageEl.style.display = "block";
//                 searhDivEl.style.display = "flex";
//                 favoritesPageEl.style.display = "none";
//                 createRecepiePageEl.style.display = "none";
//                 profilePageEl.style.display = "none";
//                 errorPageEl.style.display = "none";
//                 printRecepies(recepieManager.allRecepies, homeRecepiesContainer);
//                 break;
//             case "favorites":
//                 homePageEl.style.display = "none";
//                 searhDivEl.style.display = "flex";
//                 favoritesPageEl.style.display = "block";
//                 createRecepiePageEl.style.display = "none";
//                 profilePageEl.style.display = "none";
//                 errorPageEl.style.display = "none";
//                 printRecepies(user.favoriteRecepies, favoritesRecepiesContainer);
//                 break;
//             case "create-recepie":
//                 homePageEl.style.display = "none";
//                 searhDivEl.style.display = "none";
//                 favoritesPageEl.style.display = "none";
//                 createRecepiePageEl.style.display = "flex";
//                 profilePageEl.style.display = "none";
//                 errorPageEl.style.display = "none";
//                 break;
//             case "profile":
//                 homePageEl.style.display = "none";
//                 searhDivEl.style.display = "none";
//                 favoritesPageEl.style.display = "none";
//                 createRecepiePageEl.style.display = "none";
//                 profilePageEl.style.display = "flex";
//                 errorPageEl.style.display = "none";
//                 loadProfilePage(user.cookedRecepies);
//                 break;
//             default:
//                 homePageEl.style.display = "none";
//                 searhDivEl.style.display = "none";
//                 favoritesPageEl.style.display = "none";
//                 createRecepiePageEl.style.display = "none";
//                 profilePageEl.style.display = "none";
//                 errorPageEl.style.display = "block";
//                 break;
//         }


//     }


//     function printRecepies(recepies, container) {

//         container.innerHTML = ""; //!зачистваме контейнера преди принтиране

//         recepies.forEach(recepie => {

//             let cardDiv = document.createElement("div");
//             cardDiv.classList.add("card");

//             let a = document.createElement("a");
//             a.href = recepie.href;
//             a.target = "_blank";

//             let img = document.createElement("img");
//             img.classList.add("cardImg");
//             img.src = recepie.thumbnail;

//             a.append(img);

//             let h2 = document.createElement("h2");
//             h2.classList.add("cardH2");
//             h2.innerText = recepie.title;

//             let p = document.createElement("p");
//             p.classList.add("cardP");
//             p.innerText = recepie.ingredients.join(", ");

//             let btnsDiv = document.createElement("div");
//             btnsDiv.classList.add("cardBtnsDiv");

//             let likeBtn = document.createElement("button");
//             likeBtn.classList.add("likeBtn");

//             if (user.recepieIsLiked(recepie)) {
//                 likeBtn.innerText = "Премахни от любими"
//             } else {
//                 likeBtn.innerText = "Добави в любими"
//             }

//             let cookBtn = document.createElement("button");
//             cookBtn.classList.add("cookBtn");
//             cookBtn.innerText = "Сготви";


//             //логика за бутоните
//             likeBtn.addEventListener("click", function (e) {

//                 if (user.recepieIsLiked(recepie)) {
//                     user.removeFromFavorites(recepie);
//                     likeBtn.innerText = "Добави в любими";

//                     if (location.hash === "#favorites") { //за да се разкара елемента, ако сме на страница favorites
//                         e.target.parentElement.parentElement.remove();
//                     }

//                 } else {
//                     user.addToFavorites(recepie);
//                     likeBtn.innerText = "Премахни от любими";
//                 }

//             })

//             cookBtn.addEventListener("click", function (e) {
//                 console.log(e);
//                 user.addToCooked(recepie);
//             })

//             btnsDiv.append(likeBtn, cookBtn);

//             cardDiv.append(a, h2, p, btnsDiv);
//             container.append(cardDiv);
//         })

//     }


//     //!search by name
//     searchEl.addEventListener("input", function (e) {

//         let searchStr = e.target.value;

//         //има значение къде търсим
//         if (location.hash === "#home") {
//             // let results = recepieManager.search(searchStr);

//             let results = recepieManager.searchAndFilter(searchStr, selectEl.value);

//             printRecepies(results, homeRecepiesContainer);


//         } else if (location.hash = "#favorites") {
//             let results = user.search(searchStr);
//             printRecepies(results, favoritesRecepiesContainer);
//         }

//     })

//     //!filter by ingredient
//     selectEl.addEventListener("change", function (e) {

//         let ingredient = e.target.value;

//         if (location.hash === "#home") {
//             // let results = recepieManager.filterByIngredient(ingredient);

//             let results = recepieManager.searchAndFilter(searchEl.value, e.target.value);

//             printRecepies(results, homeRecepiesContainer);
//         } else if (location.hash = "#favorites") {
//             let results = user.filterByIngredient(ingredient);
//             printRecepies(results, favoritesRecepiesContainer);
//         }

//     })


//     //!Print cooked recepies in profile page
//     function loadProfilePage(cookedRecepiesObj) {

//         let inputs = Array.from(document.getElementsByClassName("inputProfile"));
//         inputs[0].value = user.name;
//         inputs[1].value = user.age;
//         inputs[2].value = user.address;
//         inputs[3].value = user.imgUrl;



//         cookedRecepiesTable.innerHTML = ""; //!зачистваме таблицата преди принтиране

//         for (let key in cookedRecepiesObj) {

//             let newTr = document.createElement("tr");
//             let td1 = document.createElement("td");
//             let td2 = document.createElement("td");

//             td1.innerText = key;
//             td2.innerText = cookedRecepiesObj[key];

//             newTr.append(td1, td2);
//             cookedRecepiesTable.append(newTr);
//         }

//     }


//     //!Profile inputs
//     let inputs = Array.from(document.getElementsByClassName("inputProfile")) //.map(input => input.value);

//     inputs.forEach(input => {

//         input.addEventListener("change", function (e) {

//             if (inputs.every(input => input.value)) {
//                 submitBtnProfile.removeAttribute("disabled")
//             } else {
//                 submitBtnProfile.setAttribute("disabled", true);
//             }

//         })

//     });


//     submitBtnProfile.addEventListener("click", function (e) {
//         e.preventDefault()

//         let inputs = Array.from(document.getElementsByClassName("inputProfile")).map(input => input.value);

//         user.name = inputs[0];
//         user.age = inputs[1];
//         user.address = inputs[2];
//         user.imgUrl = inputs[3];

//         let profilePic = document.getElementById("profilePic");
//         profilePic.src = inputs[3];
//     })


//     //!Create recepie inputs
//     let createRecInputs = Array.from(document.getElementsByClassName("createRecInput"));

//     createRecInputs.forEach(input => {

//         input.addEventListener("change", function (e) {

//             if (createRecInputs.every(input => input.value)) {
//                 createRecBtn.removeAttribute("disabled")
//             } else {
//                 createRecBtn.setAttribute("disabled", true);
//             }

//         })

//     });



//     createRecBtn.addEventListener("click", function (e) {

//         e.preventDefault()

//         console.log(document.forms.createRecForm);
//         //лесен начин за взимане на формата, която ни трябва, по id="loginForm"
//         let formData = new FormData(document.forms.loginForm);
//         // let username = formData.get("loginUsername");
//         // let password = formData.get("loginPassword");

//         let createRecInputsValues = Array.from(document.getElementsByClassName("createRecInput")).map(input => input.value);
//         // console.log(createRecInputsValues);
//         let newRec = new Recepie(...createRecInputsValues);

//         if (!recepieManager.isAlreadyAdded(newRec)) {
//             recepieManager.addRecepie(newRec);

//             createRecInputs.forEach(input => input.value = "");
//         } else {
//             return;
//         }

//     })

// })();