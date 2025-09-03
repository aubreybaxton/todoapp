// >>>>> 1 way-------------------------------------
// module.exports = getDate;

// function getDate() {
//     var today = new Date();
//     var options = {
//         weekday: "long",
//         day: "numeric",
//         month: "numeric"
//     };
//     var days = today.toLocaleDateString("en-US", options);
//     return days;
// }

//>>>>>>2 way -----------------------------------
// module.exports.getDate = getDate;

// function getDate() {
//     var today = new Date();
//     var options = {
//         weekday: "long",
//         day: "numeric",
//         month: "numeric"
//     };
//     var days = today.toLocaleDateString("en-US", options);
//     return days;
// }

exports.getDate = function() {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "numeric"
    };
    
    return today.toLocaleDateString("en-US", options);
}

