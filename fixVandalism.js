//Couldn't find a better solution to get the price of each element. Feel free to make this better.
const additionCosts = {
    'rct2dlc.footpath_item.litterpa': 40,
    'rct2.footpath_item.bench1': 50,
    'rct2.footpath_item.benchlog': 50,
    'rct2.footpath_item.benchpl': 50,
    'rct2.footpath_item.benchspc': 50,
    'rct2.footpath_item.benchstn': 50,
    'rct2.footpath_item.jumpfnt1': 200,
    'rct2.footpath_item.jumpsnw1': 250,
    'rct2.footpath_item.lamp1': 40,
    'rct2.footpath_item.lamp2': 50,
    'rct2.footpath_item.lamp3': 60,
    'rct2.footpath_item.lamp4': 60,
    'rct2.footpath_item.lampdsy': 60,
    'rct2.footpath_item.lamppir': 60,
    'rct2.footpath_item.litter1': 30,
    'rct2.footpath_item.littermn': 40,
    'rct2.footpath_item.littersp': 40,
    'rct2.footpath_item.litterww': 40,
    'rct2.footpath_item.qtv1': 150,
    'rct2tt.footpath_item.firhydrt': 40,
    'rct2tt.footpath_item.medbench': 50
}

function repair(element) {
	if (park.getFlag("noMoney")) {
		element.isAdditionBroken = false;
		return 0;
	}
	else {
		// Find out what type of object is to be repaired
        var additionIdentifier = context.getObject("footpath_addition", element.addition).identifier;
		
		// Repair costs are the building costs of that specific object
		var repairCost = additionCosts[additionIdentifier];
		
		// If the park has more money than the repairs cost
		if (park.cash >= repairCost) {
			// Repair the element and deduct the repair costs
			park.cash -= repairCost;
			element.isAdditionBroken = false;
			return repairCost;
		}
		else {
			throw new Error("Insufficient funds to fix vandalism.")
			return 0;
		}
	}
}

function fixVandalism() {
	var totalSpent = 0;
	
    // Iterate every tile in the map
    for (var y = 0; y < map.size.y; y++) {
        for (var x = 0; x < map.size.x; x++) {
            var tile = map.getTile(x, y);

            // Iterate every element on the tile
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);

                // If the element is a footpath, set the broken flag to true
                if (element.type === 'footpath') {
                    if (element.isAdditionBroken) {
						totalSpent += repair(element);
					}
                }
            }
        }
    }
	
	park.postMessage({type: "blank", text: "Spent $" + totalSpent/10 + " fixing vandalism"});
}

function main() {
	
	ui.registerMenuItem("Fix Vandalism", function() { 
		fixVandalism(); 
	});

	ui.registerShortcut({
		id: "fixVandalism.fixVandalism",
		text: "Fix Vandalism Shortcut",
		bindings: ["CTRL+SHIFT+F"],
		callback: function() {
			fixVandalism();
		},
	});
    
}

registerPlugin({
    name: 'Fix Vandalism',
    version: '1.0',
    authors: ['Cendwar'],
    type: 'local',
	license: "MIT",
    main: main
});