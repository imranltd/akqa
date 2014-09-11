if (Modernizr.fontface) {showFont = true;}

var adjustQuantity = function()
{
	$vatRate = 20;
	var $subTotal = [];
	cartLength = $("#items>div").length;

	if(cartLength=='0')
	{
		$("#items").text('Your basket is empty.');
		$('#buynow div button').attr('disabled',true);
		$('#buynow div button').addClass('inactive');
	}

	$("#items>div").each(function(index) 
 	{
		$itemPrice = $(this).find('.price').text().replace(/\u00A3/g, '');
		$itemQuantity = $(this).find('.quantity input').val();
		$itemTotal = $itemPrice * $itemQuantity
		$subTotal [ index ] = $itemTotal;
	
		$(this).find('.cost span').text($itemTotal.toFixed(2))
	});

 	var total = 0;
 	$.each($subTotal,function() 
	{
		total += this;
	});

	$subTotal = total;
	$vat = parseFloat($vatRate/100 * $subTotal);
	$CartTotal = parseFloat($subTotal + $vat);

	$("#cart-totals #subtotal .amount span").text($subTotal.toFixed(2));
	$("#cart-totals #vat .amount span").text($vat.toFixed(2));
	$("#cart-totals #total .amount span").text($CartTotal.toFixed(2));
}

var sendBasket = function()
{
	var json_data = {basket: []};

	$("#items>div").each(function(index) 
	{
		json_data.basket.push(
		{
			product: $(this).find('.product').text(), 
			price: $(this).find('.price').text().replace(/\u00A3/g, ''),
			quantity: $(this).find('.quantity input').val(),
			total: $(this).find('.cost span').text()
		});
	});

	json_data.basket.push(
	{
		sub_total: $("#cart-totals #subtotal").find('.amount span').text(), 
		vat: $("#cart-totals #vat").find('.amount span').text(),
		grand_total: $("#cart-totals #total").find('.amount span').text()
	});

	result = JSON.stringify(json_data)

	$.ajax(
	{
		type: 'POST',
		contentType: 'application/json',
		dataType: 'json',
		url: 'json/done.json',
		data: result,
		success: function(){alert("done:  "+result);},
		error: function(){alert("fail");}
	})
}





var loader = function() 
{
	adjustQuantity();
	adjQty();

	$('.remove span').click(function()
	{
		$(this).parents().eq(1).remove();
		adjustQuantity();
	});

	$('input').keypress(function(event)
	{
    	var keycode = (event.keyCode ? event.keyCode : event.which);
    
    	if(keycode == '13')
    	{
        	adjustQuantity();
    	}
	});
	
	$('#buynow div button').click(function()
	{
		sendBasket();
	});

}


var adjQty = function()
{
	$('.qty-ctrl>div').click(function(e)
	{
  		e.preventDefault();
  		item_index = $(this).find('button').attr('tabindex');
  		item_index2 = Math.round(parseInt(item_index) +1);
  		direction = $(this).attr('class');
  		value = $(this).parents().eq(2).find('.quantity input').val();

  		if(direction=='qtyUp')
		{
  			newvalue = Math.round(parseInt(value) +1);
  			$(this).parents().eq(2).find('.quantity input').val(newvalue);

  			if(newvalue>=11)
	  		{
	  			$('#errorMessage').remove();
	  			error = "You have reached your maximun quanitiy<br />";
		  		action = "<span id='ok'><button href='#ok' tabindex='"+item_index+"'>ok</button></span>"
  				$(this).parents().eq(2).find('.quantity input').val(10);
  				$(this).parents().eq(2).append('<div id="errorMessage" class="">'+error+action+'</div>')
	  		}
  		}
  		else
		{
  			newvalue = Math.round(parseInt(value) -1);
			$(this).parents().eq(2).find('.quantity input').val(newvalue);

  			if(newvalue<=0)
			{
				$('#errorMessage').remove();

  				error = "Do you want to remove this item from your cart?<br />";
  				action = "<span id='yes'><button href='#yes' tabindex='"+item_index+"'>yes</button></span> or <span id='no'><button href='#no'tabindex='"+item_index2+"'>no</button></span>"
				$(this).parents().eq(2).find('.quantity input').val(1);
				$(this).parents().eq(2).append('<div id="errorMessage" class="">'+error+action+'</div>')
		  	}
		}

		$('#errorMessage span button').click(function(e)
		{
  			e.preventDefault();
  			choice = $(this).text();
  			if(choice == 'yes')
			{
				$(this).parents().eq(2).remove();
				$('#errorMessage').remove();

				adjustQuantity();
			}
  			else
			{
	  			$('#errorMessage').remove();
	  			newvalue = Math.round(parseInt(value));
				$(this).parents().eq(2).find('.quantity input').val(newvalue);

				adjQty();
			}
		});

		adjustQuantity()

	});
}

$( document ).ready(loader);