var elasticSearch = {

	makeSearch: function(textname, searchit) {
		
	var index = elasticlunr(function () {
		this.addField('title');
		this.addField('group');
		this.addField('body');
		this.setRef('id');
	});

	var myRegexp = /(?:^|\s)-----------(.*)(?:\s|$)/g;
	var myRegexgroup = /(?:^|\s)=================================>(.*) <===(?:\s|$)/g;
	var lines = $('#code').val().split('\n');
	var inside = false;
	var match;
	var grouplines;
	var titlep;
	var matchgroup;
	var group = "No group";

	//parsing the text area and add it to the index
	for(var i = 0;i < lines.length;i++){
		match = myRegexp.exec(lines[i]);
		matchgroup = myRegexgroup.exec(lines[i]);
		if (matchgroup !== null) {
			if (matchgroup[1].length > 0){
				group = matchgroup[1];
			}
		}
		
		if (match !== null) {
			if (match[1].length > 0){
				inside = true;
				titlep = match[1];
			}
			else{
				inside = false;
				index.addDoc({"id": i,"title": titlep,"group": group,"body": grouplines});
				grouplines = "";
				titlep= "";
			}
		}
		else{
			if (inside == true){
				grouplines = grouplines + "\n" + lines[i];
			}
		}
	}
	  
	
	//var search = prompt("Search", "");
	//search and return to the same textarea
	let result = index.search(searchit, {
		fields: {
			title: {boost: 2, bool: "AND"},
			group: {boost: 3},
			body: {boost: 1}
		},
		bool: "OR",
		expand: true,
		limit: 10000
	});


	function decodeHtml(html) {
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}
	
	var myTextArea = "";
	if (typeof result[0] !== 'undefined'){
		//console.log(result);
		//console.log(result.length);
		for(var x = 0;x < result.length;x++){
			myTextArea = myTextArea + "=================================>" + index.documentStore.getDoc(result[x].ref).group;
			myTextArea = myTextArea + "\n-----------" + index.documentStore.getDoc(result[x].ref).title;
			myTextArea = myTextArea + index.documentStore.getDoc(result[x].ref).body;
			myTextArea = myTextArea + "\n-----------\n\n";
		}
	}
	
	return myTextArea;
	
	}
}