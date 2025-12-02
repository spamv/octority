var highlightMultiple = {

	doHighlight: function(cm, words) {
		var colors = ["styled-background", "styled-background2", "styled-background3", "styled-background4", "styled-background5"];
 		var result = words.split(' ');
		for (var i = 0; i < result.length; i++) {
			m=i;
			if (i>4){
				m=4;
			}
			findMatch(result[i], colors[m]);
		}
		
		function findMatch(sword, scolor){
			var lines = cm.getValue().split('\n');
			var myRegexp = new RegExp("(" + sword + ")", "ig");
	 		for(var m = 0;m < lines.length;m++){
				while ((match=myRegexp.exec(lines[m]))!=null) {
					cm.markText({line: m, ch: match.index}, {line: m, ch: myRegexp.lastIndex}, {className: scolor});
				}
				myRegexp.lastIndex = 0;
			} 
		}
		
	}
}