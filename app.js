const StorageCtrl = null;

const ItemCtrl = (function () {

    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const state = {
        items: [
            // { id: 0, name: "Salad (a lot)", calories: 1600 },
            // { id: 1, name: "Paczki", calories: 500 },
            // { id: 2, name: "Spinach", calories: 450 }
        ],
        currentItem: null,
        totalCalories: 0
    };

    return {
        getItems: function () {
            return state.items;
        },
        addItem: function (name, calories) {
            let ID;
            if (state.items.length > 0) {
                ID = state.items[state.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);

            const newItem = new Item(ID, name, calories);

            state.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;

            state.items.forEach(item => total += item.calories);

            state.totalCalories = total;

            return state.totalCalories;
        },
        logState: function () {
            return state;
        }
    };
})();

const UICtrl = (function () {

    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput: "#item-calories",
        totalCalories: ".total-calories"
    };

    return {
        populateItemList: function (items) {
            let html = "";

            items.forEach(item => {
                html += `
                    <li id="item-${item.id}" class="collection-item">
                        <strong>${item.name}: </strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="fa fa-pencil edit-item"></i>
                        </a>
                    </li>
                `;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem: function (item) {

            document.querySelector(UISelectors.itemList).style.display = "block";

            const li = document.createElement("li");

            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong>
                <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="fa fa-pencil edit-item"></i>
                </a>
            `;

            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = "";
            document.querySelector(UISelectors.itemCaloriesInput).value = "";
        },
        hidelist: function () {
            document.querySelector(UISelectors.itemList).style.display = "none";
        },
        showTotalCalories: function (totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        getSelectors: function () {
            return UISelectors;
        }
    };
})();

const App = (function (ItemCtrl, UICtrl) {

    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit)
    };

    const itemAddSubmit = function (e) {

        const input = UICtrl.getItemInput();

        if (input.name !== "" && input.calories !== "") {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();

            UICtrl.showTotalCalories(totalCalories);

            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    return {
        init: function () {
            const items = ItemCtrl.getItems();

            if (items.length === 0) {
                UICtrl.hidelist();
            } else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            loadEventListeners();
        }
    };

})(ItemCtrl, UICtrl);

App.init();