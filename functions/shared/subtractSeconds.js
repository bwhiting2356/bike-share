export var subtractSeconds = function (date, seconds) {
    var a = new Date(date);
    a.setSeconds(date.getSeconds() - seconds);
    return a;
};
//# sourceMappingURL=subtractSeconds.js.map