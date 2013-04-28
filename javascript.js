function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

$(document).ready(function () {
    var location = document.location;
    var index = /index\.html/.test(location);
    var login = /login\.html/.test(location);
    var add_com = /add_comissioner\.html/.test(location);

    var ballot_id = getURLParameter('ballot_id');
    if (ballot_id != 'null') {
	$("#ballot"+ballot_id).show();
	if (add_com) {
	    ac_select();
	}
    } else {
	$(".unsubmitted_ballot").hide();
	$(".submitted_ballot").show();
    }

    // fix links based on login status and location
    if (!index) {
	show_all_links('a.home_link');
    }

    if (login) {
	hide_all('a.not_logged');
    }

    var role = $.cookie('role');
    if (role != null) {
	if (login) {
	    document.location = 'index.html';
	}
	show_all_links('a.any_logged');
	hide_all('a.not_logged');
	if (role == 'student') {
	    show_all_links('a.student_logged');
	} else if (role == 'hso') {
	    show_all_links('a.hso_logged');
	} else if (role == 'ec') {
	    show_all_links('a.ec_logged');
	}
    } else {
	if (!index && !login) {
	    document.location = "login.html";
	}
    }
});

function show_all_links(selector) {
    $(selector).each(function(i) { $(this).show(); $(this).css('display', 'block'); });
}

function hide_all(selector) {
    $(selector).each(function(i) { $(this).hide(); });
}

function party_vote(party) {
    $('.' + party + '_party').each(function(i) {$(this).prop('checked', true);});
}

function limit_options(index) {
    if ($('input[type=checkbox]:checked').length > 2) {
	$('#option' + index).attr('checked', false);
    }
}

function radio_or_text(index) {
    var writein = $('#text1').val();

    if (index < 4) {
	$('#text1').val('');
    } else if (writein != '') {
	$('input[type=radio]:checked').each(function(i){$(this).prop('checked', false);});
    }
}

function confirm_vote(ballot_id) {
    var ballot_form = $("#ballot_form"+ballot_id).serializeArray();
    var count = 0;
    var success = true;
    var additional_options = false;

    $.each(ballot_form, function(i, field) {
	if (field.name == 'race1_candidate' &&
	    ballot_id == 2) {
	    if (!additional_options) {
		additional_options = true;
		count += 1;
	    }
	} else if (field.name != 'party' &&
		   field.value != '') {
	    count += 1;
	}
    });

    if (count != 2) {
	alert("You have not completed the ballot");
	success = false;
    } else {
	success = confirm("Are you sure you want to submit your ballot?");
    }

    return success;
}

function upload_restore() {
    $('.unsubmitted_restore').hide();
    $('.submitted_restore').show();
    return false;
}

function submit_ac() {
    var name = $('#fname').val() + ' ' + $('#lname').val();
    var ballot = $('option:selected').text();
    $('#ac_name').text(name);
    $('#ac_ballot').text(ballot);
    $('.unsubmitted_ac').hide();
    $('.submitted_ac').show();
    return false;
}

function fake_login() {
    var form = $('#login_form').serializeArray();
    var username;
    var password;
    var error = false;

    $.each(form, function(i, field) {
	if (field.name == "username") {
	    username = field.value;
	} else if (field.name == "password") {
	    password = field.value;
	}
    });

    if (password != 'password') {
	error = true;
    } else {
	if (username == 'student') {
	    login_as('student');
	} else if (username == 'hso') {
	    login_as('hso');
	} else if (username == 'ec') {
	    login_as('ec');
	} else {
	    error = true;
	}
    }

    if (error) {
	$('.login_error').show();
    } else {
	document.location = "index.html";
    }

    return false;
}

function login_as(role) {
    $.cookie('role', role);
}

function fake_logout() {
    $.removeCookie('role');
}

function invalidate(student_id) {
    $('#student'+student_id+'_vote').html('<a href="javascript:revalidate(' +
					  student_id + ');">Revalidate Vote</a>');
}

function revalidate(student_id) {
    $('#student'+student_id+'_vote').html('<a href="javascript:invalidate(' +
					  student_id + ');">Invalidate Vote</a>');
}

function remove_comissioner(ballot_id) {
    $('#comissioner'+ballot_id+'_name').html('');
    $('#comissioner'+ballot_id+'_actions').html('<a href="add_comissioner.html?ballot_id=' +
						ballot_id + '">Add Comissioner</a>');
}

function ac_select() {
    var b_id = getURLParameter('ballot_id');
    $('#ballot' + b_id).attr('selected', true);
}

function certify_election(ballot_id) {
    $('.unsubmitted_ce').hide();
    $('.submitted_ce').show();
    return false;
}
