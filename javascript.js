function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

$(document).ready(function () {
    var ballot_id = getURLParameter('ballot_id');
    if (ballot_id != 'null') {
	$("#ballot_number").text(ballot_id);
    } else {
	$(".unsubmitted").hide();
	$(".submitted").show();
    }
});

function confirm_vote() {
    var ballot_form = $("#ballot_form").serializeArray();
    var c = '';
    $.each(ballot_form, function(i, field) {
	if (field.name="candidate") {
	    c = field.value;
	}
    });
    if (c != '') {
	return confirm("Are you sure you want to vote for " +
		       c + "?");
    } else {
	alert("You have not chosen a candidate");
    }
}