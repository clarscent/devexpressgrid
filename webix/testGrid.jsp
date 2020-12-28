<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%
	request.setCharacterEncoding("utf-8");

	int size = 2000;
%>
<!DOCTYPE html>
<html>
<head>
<style>
button.btnCodeHelp, button.btnCodeHelpGrid {
	background-image: url('/img/img_search.png') !important;
	background-repeat: no-repeat;
	background-position: center;

	background-color: #ecedef;

	border: 1px solid #c8c8c8;
	border-left: 0px;
	height: 25px;
	width: 25px;
	line-height: 21px;
	line-height: 22 px\9 \0;
	vertical-align: middle;
}
</style>
<link rel="stylesheet" type="text/css" href="./lib/webix/webix.css" charset="utf-8">
<link rel="stylesheet" type="text/css" href="./lib/webix/webix-custom.css" charset="utf-8">
<script type="text/javascript" src="./lib/jquery/jquery-2.1.4.js"></script>
<script type="text/javascript" src="./lib/webix/webix_debug.min.js"></script>
<script type="text/javascript" src="./lib/webix/xlsx.core.min.js"></script>
<script type="text/javascript" src="./js/webix.custom.js"></script>
<script src="sample2Data.js"></script>

<script type="text/javascript" charset="utf-8">
if (!window['console']) {
	window['console'] = {
		log: function () {
		}
	};
}

var grida;

var selectData = {"1": "11", "2": "22"};

webix.ready(function () {
	var columns = [
		new Column("아이디", "ID", "50", "number", {align: "center", maxLength: "20"}),
		new Column("이름", "FirstName", "80", "text", {align: "left", maxLength: "20"}),
		new Column("성", "LastName", "150", "text", {align: "center", maxLength: "20"}),
		new Column("성별", "Prefix", "150", "", {editable:false, align: "center", maxLength: "20"}),
		new Column("직위", "Position", "150", "textarea", {align: "center", maxLength: "50", visible:true, cellStyle:"color:blue"}),
		new Column("직위", "Position", "150", "button", {align: "center", btnTxt:"상 세", callBackFn:function(a,b,c,d){console.log("callback", a,b,c,d)}}),
		new Column("셀렉트1", "SelectBox1", "auto", "selectBox", {align: "center", maxLength: "20", dataSource: sb1}),
	]

	var grid = dxGrid.initGrid("grid1", 800, 300, columns, {
		checkbox: false,
		editable: true,
		sortable: true,
		showRowIndex: false,
		footer: false,
	});
	dxGrid.setGridData("grid1", sample2);


	var footer = [
		new Footer("FirstName", "count", "CNT:"),
		new Footer("SelectBox1", "count", "갯수: "),
	];

	//dxGrid.setFooter("grid1", footer);

	console.log(grid.config.columns);

	//grid.config.columns[1].header.push({content:"multiComboFilter"});
	//grid.refreshColumns();
});
</script>
<script>
$(document).ready(function() {
	$("#updateCell").click(function() {
		$$("grid1").updateCell(1, "FirstName", "kjasdfadfadsfasdfasdfadsfh");
	});

	$("#exportToExcel").click(function() {
		dxGrid.exportToExcel("grid1");
	});

	$("#setFocus").click(function () {
		dxGrid.setFocus("grid1", 1, "FirstName");
	});

	$("#getRowIndex").click(function () {
		var rowIndex = dxGrid.getRowIndex("grid1");

		console.log("rowIndex", rowIndex);
	});

	$("#getCellValue").click(function () {
		var value = dxGrid.getCellValue("grid1", 1, "FirstName");

		console.log("cellValue", value);
	});

	$("#addRow").click(function () {
		dxGrid.addRow("grid1");
	});

	$("#checkedData").click(function () {
		var data = dxGrid.getCheckedData("grid1");

		console.log(data);
	});
})
</script>
</head>
<body onload="">
<button id="updateCell">UPDATE CELL</button>
<button id="exportToExcel">EXCEL</button>
<button id="setFocus">FOCUS</button>
<button id="getRowIndex">getRowIndex</button>
<button id="getCellValue">getCellValue</button>
<button id="addRow">addRow</button>
<button id="checkedData">checkedData</button>
<div class="gridArea">
	<div id="grid1" style="height:350px"></div>
</div>
</body>
</html>