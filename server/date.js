function getDateToday(){
    let date = new Date();

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); //Increment by 1 because getMonth() returns months from 0 - 11. Pad start for months < 10 so can be two digits
    let day = date.getDate().toString().padStart(2, "0"); //Pad start for dates < 10 to be two digits

    let fullDateToday = year.toString() + "-" + month + "-" + day; //String version of today's date

    return fullDateToday;
}


//console.log(getDateToday());

module.exports.getDateToday = getDateToday;


//(month < 10 ? : )




