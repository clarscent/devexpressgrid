<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%
	request.setCharacterEncoding("utf-8");

	int size = 100;
	
	String test = "17\" WHEEL";
	
	System.out.println(test + "," + test.replaceAll("\"", "\\\""));
%>
<!DOCTYPE html>
<html>
<head>
<title>AK</title>
<link rel="stylesheet" type="text/css" href="./css/common.css">
<link rel="stylesheet" type="text/css" href="./css/program.css" />

<link rel="stylesheet" type="text/css" href="./lib/webix/webix.css" charset="utf-8">
<link rel="stylesheet" type="text/css" href="./css/webix.custom.css" />

<script type="text/javascript" src="./lib/jquery/jquery-2.1.4.js"></script>
<script type="text/javascript" src="./lib/webix/webix_debug.js"></script>
<script type="text/javascript" src="./lib/hangul-postposition.js"></script>
<script type="text/javascript" src="./js/common.js"></script>
<!-- [3] CUSTOM -->
<script type="text/javascript" src="./js/webix.custom.js"></script>
<style>
.searchRow>label {
	min-width: 88px !important;
}

button.btnCodeHelp, button.btnCodeHelpGrid {
	background-image: url('./img/img_search.png') !important;
 	background-repeat: no-repeat;
 	background-position: center;

 	background-color: #ecedef;

	border: 1px solid #c8c8c8;
	border-left:0px;
	height:25px;
	width:25px;
	line-height: 21px;
	line-height: 22px\9\0;
	vertical-align:middle;
}
</style>
<script>
$(document).ready(function() {
});


var selectData = [{"id":"A4", value:"A$$"}, {"id":"B4", value:"B$$"}];
//console.log("selectData", selectData);

function initPage() {
	//console.log("initPage", $("#test").multipleSelect('getSelects'));
	//$$("grid1").addRow({"title":"111"});
}

listener.select.change = function(obj) {
	//console.log("selectChangeListener", obj.val());
}

var gridData = [
<%
	for (int i = 1; i < size; i++) { 
%>
		{id:<%=i%>, title:"The Godfather<%=i%10%>", cat_id:"A4", year1:<%=i%2%>, year2:<%=i%>, year3:1972, year4:1972, year5:1972, year6:1972, year7:1972, votes:'Y', rating:9.2, rank:<%=i%>},
<%
	}
%>
]


webix.ready(function() {
	grid = webix.ui({
		id : "grid1",
		container : "grid1",
		view : "datagrid",
		columns : [
				{id:"ch1", header:{ content:"masterCheckbox", contentId:"mc1" }, css:"textCenter", template:"{common.checkbox()}", width:30},
				{id : "rank", editor : "text", header : "rank", css : "", width : 100, template : column.codehelp("rank"), liveEdit:true, option : {type : "vin", code:'00001', param:{}, target:'year1', required : true}},
				{id : "title", editor : "", header : "Film title", fillspace:true,},
				{id : "year1", editor : "text", header : "year1", css : "", width : 200},
				{id : "cat_id", editor: "select", header:"Category" , options: selectData, width:80},
				{id : "year2", editor : "text", header : "year2", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}, footer:{ content:"count", desc:"cnt:"}},
				{id : "year3", editor : "text", header : "year3", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}},
				{id : "year4", editor : "text", header : "year4", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}},
				{id : "year5", editor : "text", header : "year5", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}},
				{id : "year6", editor : "text", header : "year6", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}},
				{id : "year7", editor : "text", header : "year7", css : "", width : 80, sort:"int", option : {type : "positiveNumber"}, footer:{ content:"sum"}, format:intFormat},
				{id : "votes", header : "votes", css : "", width : 80, sort:"int", checkValue:'Y', uncheckValue:'N', template:"{common.checkbox()}", footer:{ content:"summColumn", text:"갯수"} },
		],
		scheme:{
			$sort:{ by:"votes", as:"int", dir:"desc" }
		},
		data : gridData,
		footer : true,
	});

	console.log(grid.config.columns);
});


$(document).ready(function() {

});

listener.button.search.click = function() {
}


listener.button.new.click = function() {
	$$("grid1").addRow({id:200, title:"The Godfather200", cat_id:"A1", year1:1, year2:200, year3:1972, year4:1972, year5:1972, year6:1972, year7:1972, votes:'Y', rating:9.2, rank:200});
}

listener.button.help.callback = function($obj, result) {
	console.log("헬프팝업", $obj, result);
	if ($obj.attr("id") == "search1") {
		
	}
}
</script>
</head>
<body>
<div id="titleArea" style="position:absolute; width:100%; height:38px; background-color:#e6e6e6; border-bottom:1px solid #d8d8d8;">
	<div id="naviArea" style="position:absolute; left:12px; top:12px; color:#333333;">Promotion > 프로모션기준정보 > <span style="font-weight:bold; color:#3da3ef;">대상모델</span></div>
	<div class="buttonArea" style="position:absolute; right:12px; top:7px;">
		<button id="new">신규</button>
		<button id="search">조회</button>
		<button id="save">저장</button>
		<button id="del">삭제</button>
		<!--<button id="excel" onclick="grid.exportToExcel();">엑셀</button>-->
	</div>
</div>

<div style="position:absolute; top:150px; left:12px; border:0px solid; width:calc(100% - 24px); height:calc(100% - 150px);background-color:red;">
	<div class="gridArea" style="width:calc(100% - 150px); height:500px;">
		<div id="grid1" style="height:500px; width:100%;"></div>
	</div>
</div>
</body>
</html>