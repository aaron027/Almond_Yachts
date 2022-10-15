function getTimeArray (date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day, hour, minute, second].map(formatNumber);
}

//Formate date 2018-7-6 -->(2018-07-06)
function formatNumber (n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
}

/* 
Formate date  2018-07-06 11:11:37 
*/
function formatTime (date) {
    var t = getTimeArray(date);
    return [t[0], t[1], t[2]].map(formatNumber).join('-') + ' ' + [t[3], t[4], t[5]].map(formatNumber).join(':')
}

/**
 * Formate date yyyy-MM-dd
 */
function formatDate (date) {
    var t = getTimeArray(date);
    return [t[0], t[1], t[2]].map(formatNumber).join('-');
}
