<%@page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" type="text/css" href="./lib/webix/webix.css" charset="utf-8">
<link rel="stylesheet" type="text/css" href="./lib/webix/webix-custom.css" charset="utf-8">
<script type="text/javascript" src="./lib/jquery/jquery-2.1.4.js"></script>
<script type="text/javascript" src="./lib/jquery-ui/jquery-ui.js"></script>
<script type="text/javascript" src="./lib/webix/webix_debug.min.js"></script>
<script type="text/javascript" src="./lib/webix/xlsx.core.min.js"></script>
<script type="text/javascript" src="./js/webix.custom.js"></script>
<%@include file="./popup.jsp" %>
<script src="sample2Data.js"></script>
<script type="text/javascript" charset="utf-8">
var selectData = {"1": "11", "2": "22"};
webix.ready(function () {
	var columns = [
		new Column("아이디", "ID", "100", "number", {align: "center", maxLength: "20"}),
		new Column("셀렉트1", "SelectBox1", "85", "codeHelp", {align: "center", maxLength: "20", dataSource: sb1, codeNameField: "FirstName"}),
		new Column("이름", "FirstName", "80", "", {align: "left", maxLength: "20"}),
		new Column("성", "LastName", "auto", "text", {align: "center", maxLength: "20"}),
		new Column("성별", "Prefix", "100", "", {editable:false, align: "center", maxLength: "20"}),
		new Column("직위", "Position", "100", "textarea", {align: "center", maxLength: "50", visible:true, cellStyle:"color:blue"}),
		new Column("직위", "Position", "auto", "button", {align: "center", btnTxt:"상세", callBackFn:function(a,b,c,d){console.log("callback", a,b,c,d)}}),
		new Column("확인", "CHK", "40", "check", {align: "center"}),
	]

	var grid = dxGrid.initGrid("grid1", 800, 300, columns, {checkbox: true, editable: true, sortable: true, showRowIndex: false, footer: false});

	dxGrid.setGridData("grid1", sample2);

	var footer = [
		new Footer("FirstName", "count", "CNT:"),
		new Footer("SelectBox1", "count", "갯수: "),
	];

	dxGrid.setFooter("grid1", footer);

	grid.attachEvent("onHeaderClick", function (id, e, target) {
		if (grid.config.sortable !== true) {
			return;
		}

		var  state = grid.getState().sort;

		if (state !== null && state !== undefined) {
			if (id.column === state.id) {
				console.log("똑같은거 클릭");

				if (state.dir === "desc") {
					grid.sort("id", "asc");
					grid.markSorting();
					return false;
				}
			}
		}
	})
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

	$("#showFilter").click(function () {
		dxGrid.setFilter("grid1", true);
	});

	$("#hideFilter").click(function () {
		dxGrid.setFilter("grid1", false);
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
<button id="showFilter">showFilter</button>
<button id="hideFilter">hideFilter</button>
<div class="gridArea">
	<div id="grid1" style="height:350px"></div>
</div>
</body>
</html>