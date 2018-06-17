var badchars = "<>/\\";
var sanitize = function(input){
    //var temp = input;
    if(input == null || input.length == 0){
	return "null";
    }
    for(var c in badchars){
	if(input.includes(badchars[c])){
	    var ind = input.indexOf(badchars[c]);
	    input = input.slice(0, ind) + input.slice(ind+1, input.length);
	}
    }
    return input;
};

