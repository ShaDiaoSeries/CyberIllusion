function textIterate(node, replaceList) {
	var child, next;
	if (!!node.title) {
		invokeOnNode(node, replaceList, 'text');
	}
	switch (node.nodeType) {
		case 1:
			if (!!node.href) {
				invokeOnNode(node, replaceList, 'url');
			}
		case 1:  // Element
		case 9:  // Document
		case 11: // Document fragment
			child = node.firstChild;
			while (child) {
				next = child.nextSibling;
				textIterate(child, replaceList);
				child = next;
			}
			break;
		case 3: // Text node
			invokeOnNode(node, replaceList, 'text');
			break;
	}
}

function invokeOnNode(node, replaceList, curItem) {
	replaceList.forEach(replaceObj => {
		var replaceItem = replaceObj.item;
		if (curItem != replaceItem) {
			return;
		}
		var targetList = replaceObj.target.split(';');
		var chosenIndex = Math.floor(Math.random() * targetList.length);
		if (curItem === 'text') {
			if (!!node.title) {
				node.title = node.title.replace(new RegExp(replaceObj.src, 'g'), targetList[chosenIndex]);
			} else {
				node.nodeValue = node.nodeValue.replace(new RegExp(replaceObj.src, 'g'), targetList[chosenIndex]);
			}
		} else if (curItem === 'url') {
			node.href = node.href.replace(new RegExp(replaceObj.src, 'g'), targetList[chosenIndex]);
		}
	});
}

chrome.storage.local.get('textReplaceList', function(replaceListObj) {
	var replaceList = replaceListObj.textReplaceList;
	textIterate(document, replaceList);
	new MutationObserver(function(mutations, observer) {
		mutations.forEach(function (val, index, arr) {
			textIterate(val.target, replaceList);
		});
	}).observe(document, {
		childList: true,
		subtree: true
	});
});
