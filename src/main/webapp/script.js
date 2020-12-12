$(function() {
	$.get('api/data', function(data) {
		$(data).each(function(idx, item) {
			$('#data-content').append(buildSkeinsHtml(idx, item));
		});
	});
	
	$('#search-value').keyup(function() {
		const val = this.value;
		if (val) {
			const parts = val.split(/[,.]/);  
			$('[id^=skeins-row-]').css('display', 'none');

			parts.forEach(part => {
				if (part) {
					$('[id^=skeins-row-' + part + ']').css('display', 'flex');
				}
			});
		} else {
			$('[id^=skeins-row-]').css('display', 'flex');
		}
		
		
	});
	
	$('#command-link').click(function() {
		$('#command-content').toggle();
		$('#command-value').val('');
		$('#command-result-skeins').text('');
		$('#command-result').css('display', 'none');
	});
	
	$('#search-value').focus();
	
	$('#command-button').click(function() {
		var result = '';
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
			result = 'Veillez saisir les codes DMC séparés par des virgules.';
		}
		$('#command-result-skeins').text(result);
		$('#command-result').css('display', 'block');
	});
	
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
			$('#back-to-top').fadeIn();
		} else {
			$('#back-to-top').fadeOut();
		}
	});
	// scroll body to 0px on click
	$('#back-to-top').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 400);
		return false;
	});
	
	$('#shortcut-bar li a').click(function() {
		var val = $(this).data('val');
		var pos = $('div[data-skein-val="' + val + '"').offset().top;
		$('body,html').animate({
			scrollTop: pos - 40
		}, 400);
		return false;
	});
});

var buildSkeinsHtml = function(idx, item) {
	var div = $('<div></div>', {
		'class': 'skeins row',
		'id': 'skeins-row-' + item.code.toLowerCase(),
		'data-skein-val': item.code.toLowerCase()
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
		input.prop('disabled', true);
		$.ajax({
			type: 'POST',
			url: 'api/data/nb', 
			data: JSON.stringify({
				code: item.code,
				nb: this.value
			}),
			complete: function() {
				input.prop('disabled', false);
			},
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
		select.prop('disabled', true);
		$.ajax({
			type: 'POST',
			url: 'api/data/state', 
			data: JSON.stringify({
				code: item.code,
				state: this.value
			}),
			complete: function() {
				select.prop('disabled', false);
			},
			error: function() {
				alert('Une erreur est survenue à l\'enregistrement');
			},
			contentType: 'application/json'
		});
	});
	
	div.append(select);
	
	return div;
};