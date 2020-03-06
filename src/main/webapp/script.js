$(function() {
	$.get('api/data', function(data) {
		$(data).each(function(idx, item) {
			$('#data-content').append(buildSkeinsHtml(idx, item));
		});
	});
	
	$('#search-value').keyup(function() {
		var val = this.value;
		$('[id^=skeins-row-]').css('display', 'none');
		$('[id^=skeins-row-' + val + ']').css('display', 'flex');
	});
	
	$('#command-link').click(function() {
		$('#command-content').toggle();
	});
	
	$('#search-value').focus();
	
	$('#command-button').click(function() {
		var result = 'Veillez saisir les codes DMC séparés par des virgules.';
		if ($('#command-value').val()) {
			var skeins = $('#command-value').val().split(',');
			skeins = Array.from(new Set(skeins));
			skeins.sort(function(left, right) {
				if (isNaN(left) || isNaN(right)) {
					return left.localeCompare(right);
				}
				return +left - +right;
			});
			for (var skeinCode of skeins) {
				var level = $('#skeins-state-' + skeinCode.toLowerCase()).val();
				var stock = $('#skeins-nb-' + skeinCode.toLowerCase()).val();
				
				if (level !== undefined && stock !== undefined) {
					if (level !== 'FULL' && level !== 'MED' && +stock === 0) {
						result += skeinCode + ', ';
					}
				} else {
					result += '!! ' + skeinCode + ' inconnu !!,';
				}
			}
			
			if (!result) {
				result = 'Stock suffisant';
			} else {
				result = result.substring(0, result.length - 2);
			}
			
		} else {
			
		}
		$('#command-result-skeins').text(result);
		$('#command-result').css('display', 'block');
	});
});

var buildSkeinsHtml = function(idx, item) {
	var div = $('<div></div>', {
		'class': 'skeins row ' + (idx % 2 === 0 ? 'even' : 'odd'),
		'id': 'skeins-row-' + item.code.toLowerCase()
	});
	
	var code = $('<div></div>', {
		'class': 'skeins-code col'
	}).text(item.code);
	
	var name = $('<div></div>', {
		'class': 'skeins-name col'
	}).text(item.name);
	
	var color = $('<div></div>', {
		'class': 'skeins-color col',
		'style': 'background-color: #' + item.color
	});
	
	div.append(code);
	div.append(name);
	div.append(color);
	div.append(buildSkeinsStateList(item));
	div.append(buildNbSkeinsInput(item));
	
	return div;
};

var buildNbSkeinsInput = function(item) {
	var div = $('<div></div>', {
		'class': 'col'
	});
	
	var input = $('<input></input>', {
		'type': 'number',
		'id': 'skeins-nb-' + item.code.toLowerCase(),
		'value': item.nb,
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
				nb: this.value
			}),
			error: function() {
				alert('Une erreur est survenue à l\'enregistrement');
			},
			contentType: 'application/json'
		});
	});
	
	return div;
};

var buildSkeinsStateList = function(item) {
	var div = $('<div></div>', {
		'class': 'col'
	});
	
	var select = $('<select></select>', {
		'id': 'skeins-state-' + item.code.toLowerCase(),
		'name': 'skeins-' + item.code.toLowerCase(),
		'class': 'form-control'
	});
	
	var optNone = $('<option value="NONE">Aucun</option>', {
		'class': 'skeins-state state-none'
	});
	
	var optLow = $('<option value="LOW">Bas</option>', {
		'class': 'skeins-state state-low'
	});
	
	var optMed = $('<option value="MED">Moyen</option>', {
		'class': 'skeins-state state-med'
	});
	
	var optFull = $('<option value="FULL">Complet</option>', {
		'class': 'skeins-state state-full'
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
			error: function() {
				alert('Une erreur est survenue à l\'enregistrement');
			},
			contentType: 'application/json'
		});
	});
	
	div.append(select);
	
	return div;
};