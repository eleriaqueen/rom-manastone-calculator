function getNumberString(v) {
	var s = (Math.ceil(v)).toString();
	var fs = "";

	if (s.length > 3) {
		for (var i = 0; i < s.length; i++) {
			fs += s.substring(i, i + 1);

			if ((i + 1) % 3 == (s.length % 3) && (i + 1) < s.length) {
				fs += ".";
			}
		}
	} else {
		return s;
	}

	return fs;
}

function plural(v,p) {
  return ((Math.ceil(v) == 1) ? "" : p);
}

function singularPlural(v,s,p) {
  return ((Math.ceil(v) == 1) ? s : p);
}

function updateValues() {
	var manaStoneCount = parseInt(document.getElementById("manaStoneCountInput").value);
	var manaStoneTier = parseInt(document.getElementById("manaStoneTierInput").value);

	var itemTier = parseInt(document.getElementById("itemTierInput").value);
	var itemPrice = parseInt(document.getElementById("itemPriceInput").value);
	var fusiPrice = parseInt(document.getElementById("fusiPriceInput").value);
	var goldDiaRate = parseInt(document.getElementById("goldDiaRateInput").value);

	var wholePackage = document.getElementById("wholePackageInput").checked;

	var chargesPriceType = 0;
	for (var i = 0; i < 6; i++) {
		if (document.formular.chargesPriceInput[i].checked) chargesPriceType = i;
	}

	var chargesPrice = 0;
	var payWithDiamonds = true;

	var cpCharges = 0;
	var cpPrice = 0;

	switch (chargesPriceType) {
	case 0:
		cpCharges = 10;
		cpPrice = 9;
		break;
	case 1:
		cpCharges = 50;
		cpPrice = 45;
		break;
	case 2:
		cpCharges = parseInt(document.getElementById("cpDiaCharges").value);
		cpPrice = parseInt(document.getElementById("cpDiaPrice").value);
		break;
	case 3:
		cpCharges = 10;
		cpPrice = 100;
		payWithDiamonds = false;
		break;
	case 4:
		cpCharges = 1;
		cpPrice = 30;
		payWithDiamonds = false;
		break;
	case 5:
		cpCharges = parseInt(document.getElementById("cpPhiriusCharges").value);
		cpPrice = parseInt(document.getElementById("cpPhiriusPrice").value);
		payWithDiamonds = false;
	}

	chargesPrice = cpPrice / cpCharges;

	var s = "";
	var error = false;

	if (isNaN(manaStoneCount) || manaStoneCount <= 0) {
		s += "Error: The number of desired Mana Stones must be greater than 0.<br />";
		error = true;
	}
	if (isNaN(manaStoneTier) || manaStoneTier <= 0 || manaStoneTier < itemTier) {
		s += "Error: The tier of the desired Mana Stones must be greater than 0 and must not be smaller than the tier of the initial item.<br />";
		error = true;
	}
	if (isNaN(itemTier) || itemTier <= 0) {
		s += "Error: The tier of the initial item must be greater than 0.<br />";
		error = true;
	}
	if (isNaN(itemPrice) || itemPrice < 0) {
		s += "Error: The price of the initial item must not be smaller than 0.<br />";
		error = true;
	}
	if (isNaN(fusiPrice) || fusiPrice < 0) {
		s += "Error: he price of a Fusion Stone must not be smaller than 0.<br />";
		error = true;
	}
	if (isNaN(goldDiaRate) || goldDiaRate <= 0) {
		s += "Error: The Gold/Diamond rate must be greater than 0.<br />";
		error = true;
	}
	if (isNaN(cpCharges) || cpCharges <= 0 || isNaN(cpPrice) || cpPrice < 0) {
		s += "Error: The price for an Arcane Charge must be greater than 0.<br />";
		error = true;
	}

	if (!error) {
		var itemCount = manaStoneCount * Math.pow(3, manaStoneTier - itemTier);
		
		var chargesCount = 0;
		for (var i = 0; i <= (manaStoneTier - itemTier); i++) {
			chargesCount += Math.pow(3, i);
		}
		chargesCount *= manaStoneCount;

		if (wholePackage) {
			var chargesUsed = chargesCount;
			var packageCount = Math.ceil(chargesCount / cpCharges);
			chargesCount = Math.ceil(chargesCount / cpCharges) * cpCharges;
			var chargesLeft = chargesCount - chargesUsed;
		}

		var finalChargesPrice = chargesCount * chargesPrice;
		var finalItemPrice = itemCount * itemPrice;
		var finalFusiPrice = itemCount * fusiPrice;

		s += "<b>Required Materials:</b><br />";
		s += getNumberString(itemCount) + " item" + plural(itemCount,"s") + " of tier " + itemTier + "<br />";
		s += getNumberString(itemCount) + " Fusion Stone" + plural(itemCount,"s") + "<br />";

		if (!wholePackage) {
			s += getNumberString(chargesCount) + " Arcane Charge" + plural(chargesCount,"s") + "<br />";
		} else {
			//s += "<br /><b>Required Charges:</b><br />";
			s += getNumberString(packageCount) + " package" + plural(packageCount,"s");
			s += " with each " + getNumberString(cpCharges) + " Arcane Charge" + plural(cpCharges,"s");
			s += " (" + getNumberString(chargesUsed) + " Charge" + plural(chargesUsed,"s") + " will be used, ";
			s += getNumberString(chargesLeft) + " " + singularPlural(chargesLeft,"Charge is","Charges are") + " remaining)<br />";
		}

		s += "<br /><b>Total Costs:</b><br />";

		if (payWithDiamonds) {
			var finalPriceGold = finalChargesPrice * goldDiaRate + finalItemPrice + finalFusiPrice;
			var finalPriceDia = finalPriceGold / goldDiaRate;
			s += getNumberString(finalPriceGold) + " Gold or ";
			s += getNumberString(finalPriceDia) + " Diamond" + plural(finalPriceDia,"s") + "<br />";
		} else {
			var finalPriceGold = finalItemPrice + finalFusiPrice;
			var finalPriceDia = finalPriceGold / goldDiaRate;
			s += getNumberString(finalPriceGold) + " Gold and " + getNumberString(finalChargesPrice) + " Phirius Token Coin" + plural(finalChargesPrice,"s") + " or<br />";
			s += getNumberString(finalPriceDia) + " Diamond" + plural(finalPriceDia,"s") + " and " + getNumberString(finalChargesPrice) + " Phirius Token Coin" + plural(finalChargesPrice,"s") + "<br />";
		}

		s += "<br /><b>Costs for " + getNumberString(chargesCount) + " Charge" + plural(chargesCount,"s");
		s += (wholePackage ? (" respectively " + packageCount + " package" + plural(packageCount,"s")) : "") + "</b><br />";
		
		if (payWithDiamonds) {
			s += getNumberString(finalChargesPrice * goldDiaRate) + " Gold or " + getNumberString(finalChargesPrice) + " Diamond" + plural(finalChargesPrice,"s") + "<br />";
		} else {
			s += getNumberString(finalChargesPrice) + " Phirius Token Coin" + plural(finalChargesPrice,"s") + "<br />";
		}

		s += "<br /><b>Costs for " + getNumberString(itemCount) + " item" + plural(itemCount,"s") + ":</b><br />";
		s += getNumberString(finalItemPrice) + " Gold or " + getNumberString(finalItemPrice / goldDiaRate) + " Diamond" + plural(finalItemPrice / goldDiaRate,"s") + "<br />";

		s += "<br /><b>Costs for " + getNumberString(itemCount) + " Fusion Stones:</b><br />";
		s += getNumberString(finalFusiPrice) + " Gold or " + getNumberString(finalFusiPrice / goldDiaRate) + " Diamond" + plural(finalFusiPrice / goldDiaRate,"s") + "<br />";
	}

	document.getElementById("results").innerHTML = s;
}




