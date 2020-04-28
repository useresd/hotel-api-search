var validateRange = function(range, callback) {
    var rangeCheck = range.split(":");
    if(rangeCheck.length != 2) return callback({message: "Range not valid!"}, null);
    else return callback(null, {min: rangeCheck[0], max: rangeCheck[1]});
}

module.exports = validateRange;

