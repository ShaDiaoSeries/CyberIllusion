function textDel(ev){
    this.parentNode.parentNode.remove();
}
var replaceRules = 0;
function addReplaceRow(thisNode, replaceData) {
    var srcText = replaceData?.src ?? "";
    var targetText = replaceData?.target ?? "";
    var replaceItem = replaceData?.item ?? "";
    var configItem = document.getElementsByClassName('config-form-item')[0];
    var configItemClone = configItem.cloneNode(true);
    configItemClone.removeAttribute('hidden');
    configItemClone.getElementsByClassName('before-change')[0].value = srcText;
    configItemClone.getElementsByClassName('after-change')[0].value = targetText;
    replaceRules++;
    var radioBoxes = configItemClone.getElementsByClassName('replace-item')[0].children;
    for (var i = 0; i < radioBoxes.length; i++) {
        radioBoxes[i].name = "row" + replaceRules;
        if (radioBoxes[i].value == replaceItem) {
            radioBoxes[i].checked = true;
        }
    }
    var delBtn = configItemClone.getElementsByClassName('row-delete-btn')[0];
    delBtn.addEventListener('click', textDel);
    document.getElementById('config-form').appendChild(configItemClone);
}

document.getElementById('add_text_replace_rule_btn').onclick = function(curNode) {
    layui.use('form', function() {
        var form = layui.form;
        addReplaceRow(curNode);
        form.render();
    });
};

document.getElementById('save_btn').onclick = function() {
    var replaceDataNodes = document.getElementsByClassName('config-form-item');
    var textReplaceList = [];
    for (var i = 0; i < replaceDataNodes.length; i++) {
        var replaceDataNode = replaceDataNodes[i];
        var src = replaceDataNode.getElementsByClassName('before-change')[0].value;
        var target = replaceDataNode.getElementsByClassName('after-change')[0].value;
        var replaceItemOptions = replaceDataNode.getElementsByClassName('replace-item')[0].children;
        var item = "";
        for (var j = 0; j < replaceItemOptions.length; j++) {
            if (replaceItemOptions[j].checked) {
                item = replaceItemOptions[j].value;
                break;
            }
        }
        if (!!src && !!target) {
            textReplaceList.push({src: src, target: target, item: item});
        }
    }
	chrome.storage.local.set({ 'textReplaceList': textReplaceList }, function() {
		alert('保存成功！');
	});
};

window.onload = function() {
    chrome.storage.local.get('textReplaceList', function(replaceData) {
        if (!!replaceData && !!replaceData.textReplaceList) {
            layui.use('form', function() {
                var form = layui.form;
                var replaceList = replaceData.textReplaceList;
                replaceList.forEach(replaceObj => {
                    addReplaceRow(null, replaceObj);
                });
                form.render();
            });
        }
	});
}