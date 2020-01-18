$(function() {
	$.get('api/data', function(data) {
		$(data).each(function(idx, item) {
			$('#data-content').append(buildThreadsHtml(idx, item));
		});
	});
	
	$('#search-value').keyup(function() {
		var val = this.value;
		$('[id^=threads-row-]').css('display', 'none');
		$('[id^=threads-row-' + val + ']').css('display', 'flex');
	});
});

var buildThreadsHtml = function(idx, item) {
	var div = $('<div></div>', {
		'class': 'threads row ' + (idx % 2 === 0 ? 'even' : 'odd'),
		'id': 'threads-row-' + item.code.toLowerCase()
	});
	
	var code = $('<div></div>', {
		'class': 'threads-code col'
	}).text(item.code);
	
	var name = $('<div></div>', {
		'class': 'threads-name col'
	}).text(item.name);
	
	var color = $('<div></div>', {
		'class': 'threads-color col',
		'style': 'background-color: #' + item.color
	});
	
	div.append(code);
	div.append(name);
	div.append(color);
	div.append(buildThreadsStateList(item));
	div.append(buildNbThreadsInput(item));
	
	return div;
};

var buildNbThreadsInput = function(item) {
	var div = $('<div></div>', {
		'class': 'col'
	});
	
	var input = $('<input></input>', {
		'type': 'number',
		'id': 'threads-nb-' + item.code,
		'value': item.nbThreads,
		'min': 0,
		'class': 'form-control'
	});
	
	div.append(input);
	
	input.change(function() {
		$.ajax({
			type: 'POST',
			url: 'api/data/nb', 
			data: JSON.stringify({
				code: item.code,
				nbThreads: this.value
			}),
			contentType: 'application/json'
		});
	});
	
	return div;
};

var buildThreadsStateList = function(item) {
	var div = $('<div></div>', {
		'class': 'col'
	});
	
	var select = $('<select></select>', {
		'id': 'threads-state-' + item.code,
		'name': 'threads-' + item.code,
		'class': 'form-control'
	});
	
	var optNone = $('<option value="NONE">None</option>', {
		'class': 'threads-state state-none'
	});
	
	var optLow = $('<option value="LOW">Low</option>', {
		'class': 'threads-state state-low'
	});
	
	var optMed = $('<option value="MED">Medium</option>', {
		'class': 'threads-state state-med'
	});
	
	var optFull = $('<option value="FULL">Full</option>', {
		'class': 'threads-state state-full'
	});
	
	switch (item.state) {
	case 'NONE':
		optNone.attr('selected', 'selected');
		break;
	case 'LOW':
		optLow.attr('selected', 'selected');
		break;
	case 'MED':
		optMed.attr('selected', 'selected');
		break;
	case 'FULL':
		optFull.attr('selected', 'selected');
		break;
	default:
		break;
	}
	
	select.append(optNone);
	select.append(optLow);
	select.append(optMed);
	select.append(optFull);
	
	select.change(function() {
		$.ajax({
			type: 'POST',
			url: 'api/data/state', 
			data: JSON.stringify({
				code: item.code,
				state: this.value
			}),
			contentType: 'application/json'
		});
	});
	
	div.append(select);
	
	return div;
};