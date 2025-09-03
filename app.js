//jshint esversion:6

const express = require("express");

const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
require('dotenv').config();
const _ = require("lodash");


const app = express();
app.set('view engine', "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(`${process.env.MONGODB_URL}`, { useNewUrlParser: true });

// -----------Start---------Schema for the Today list-------------------------------------

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "welcome to ToDo List"
});
const item2 = new Item({
    name: "Hit the + button to create new item"
});

const defaut_Items = [item1, item2];

// ----------END----------Schema for the  Today list------------------------------------



// --------------------Schema for the custom Name list-------------------------------------
const customSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", customSchema);

//------------Start--------- get  method for the home route----------------------------
app.get("/", function (req, res) {

    let days = "Today";

    Item.find().then(function (foundItems, error) {
        // console.log("foundItems");
        if (foundItems.length === 0) {
            Item.insertMany(defaut_Items).then(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Doc is successfully inserted");
                }
                res.redirect("/");
            });
        }
        else {
            res.render("list", { listTitle: days, newListItems: foundItems });
        }

    });

});

app.post("/", function (req, res) {

    let listTitleName = req.body.listTitle;
    let listnewItem = req.body.newItem;

    const new_item = new Item({
        name: listnewItem
    });
    if (listTitleName === "Today") {
        new_item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listTitleName }).then(function (foundList, error) {
            foundList.items.push(new_item);
            foundList.save();
            res.redirect("/" + listTitleName);
        });
    }
});

app.post("/delete", function (req, res) {
    let checkedItemID = req.body.checkbox;
    let listName = req.body.listName;

    // Delete the item from the default collection
    if (listName == "Today") {
        deleteCheckedItem();
    } else {
        // Find the custom list and pull the item from the array
        deleteCustomItem();
    }

    async function deleteCheckedItem() {
        console.log( "deleted id",checkedItemID);
        await Item.deleteOne({ _id: checkedItemID });
        res.redirect("/");
    }

    async function deleteCustomItem() {
        console.log(checkedItemID);
        await List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemID } } }
        );
        res.redirect("/" + listName);
    }
});



//------------END--------- GET and POST method for the home route---------------------

//------------Start---------   method for the CUSTOM LIST route---------------------------------

app.get("/:customNameList", function (req, res) {
    const customNameList = _.capitalize(req.params.customNameList);

    List.findOne({ name: customNameList }).then(function (foundList, error) {
        if (!error) {
            if (!foundList) {

                console.log("List is Doesn't exist");
                const list = new List({
                    name: customNameList,
                    items: defaut_Items //Default item in the first array
                });
                list.save();
                res.redirect("/" + customNameList);
            }
            else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }

    });


    //res.redirect("/customNameList");
});
//------------END--------- GET and POST method for the CUSTOM LIST route----------------------


app.listen(3000, () => {
    console.log(" the server is Up and running at 3000");
})

//npx kill-port 3000 to kill the port
