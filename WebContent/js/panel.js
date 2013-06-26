/*
 * Author : Manikandan Dhandapani
 *
 */

// This is a constructor that is used to setup inheritance without
// invoking the base's constructor. It does nothing, so it doesn't
// create properties on the prototype like our previous example did
function surrogateCtor() {}

function extend(base, sub) {
  // Copy the prototype from the base to setup inheritance
  surrogateCtor.prototype = base.prototype;
  // Tricky huh?
  sub.prototype = new surrogateCtor();
  // Remember the constructor property was set wrong, let's fix it
  sub.prototype.constructor = sub;
}

Array.prototype.getUnique = function(){
	   var u = {}, a = [];
	   for(var i = 0, l = this.length; i < l; ++i){
	      if(u.hasOwnProperty(this[i])) {
	         continue;
	      }
	      a.push(this[i]);
	      u[this[i]] = 1;
	   }
	   return a;
}


getMaxValue = function(values){
	return Math.max.apply( Math, values );
}

getSum = function(values) {
	var sum = 0;
	for ( var int = 0; int < values.length; int++) {
		sum = sum + parseInt(values[int]);
	}
	return sum;
}

//This function initializes XHR
function initXHR(req) {
	if (req == null) {
		if (navigator.appName.indexOf("Microsoft") > -1 ) {
			   try{
			      req=new ActiveXObject("Microsoft.XMLHTTP");
			     }catch(e1){
			      alert("failed to create XHR in IE");
			     }
			   }else{
			       	try{
			            req=new XMLHttpRequest();
			           }catch(error){
			            alert("failed to create XHR in FireFox");
	           }
        }

	}
	return req;
 }

//buildTableFromResponse(this.requestObject,id+"_table");
function loadPreviewData(url,id){
	var reqObj = initXHR(this.requestObject);
	var reportName = url;
	reqObj.open("GET",reportName, true);
	reqObj.onreadystatechange= function() {
		if(reqObj.readyState==4){
			   //response is OK
			if(reqObj.status == 200){
				buildTableFromResponse(reqObj,id);
				reqObj.abort();
			}
		}

	};
	reqObj.send(null);
}
/**
 * Bulid the Table Object from the REST Response.
 * RequestObject - from CallBack Method
 * id in which the table needs to be billed.
 */
function buildTableFromResponse(requestObject,id) {
	var tableObject = document.getElementById(id);
	for(k = tableObject.rows.length;k> 0; k--){
		 tableObject.deleteRow(k-1);
	}
	tableObject.deleteTHead();
	var header = tableObject.createTHead();
	var headerRow;
	var response=requestObject.responseXML;
	var root=response.documentElement;
	for(i=0;i <root.childNodes.length;i++){
    	 var childNode = root.childNodes[i];
    	 for(j=0;j <childNode.childNodes.length;j++){
    		 var record = childNode.childNodes[j];
    		 var rowObject = tableObject.insertRow(j);
    		 if (j == 0) {
    			headerRow=header.insertRow(0);
    		 }
    		 for(k=0;k <record.childNodes.length;k++){
	    		var element = record.childNodes[k];
	    		var td = rowObject.insertCell(k);
  				if (element.childNodes.length > 0) {
  					td.innerHTML = element.childNodes[0].nodeValue;
  				}
  				if ( j == 0) {
  					var headerCell = headerRow.insertCell(k);
  					headerCell.innerHTML = element.nodeName;
  				}
    		 }

    	 }
     }
}

function buildDataFilter(id){
	var comboElement = document.createElement("select");
	comboElement.setAttribute("id",id);
    var opt = document.createElement('option');
    opt.value = '';    
    opt.innerHTML = 'All';
    comboElement.appendChild(opt);
    
    opt = document.createElement('option');
    //opt.value = 'Updated_Date~grt~' + fromDateMinus(1,0,0);    
    opt.value = 'Updated_Date~grt~curdate()-1'
    opt.innerHTML = 'Last Day';
    comboElement.appendChild(opt);
    
    opt = document.createElement('option');
    opt.value = 'Updated_Date~grt~curdate()-30';    
    opt.innerHTML = 'Last Month';
    comboElement.appendChild(opt);
    
    opt = document.createElement('option');
    opt.value = 'Updated_Date~grt~curdate()-365';    
    opt.innerHTML = 'Last Year';
    comboElement.appendChild(opt);
    return comboElement;
}


function fromDateMinus(days,months,years){
	var today = new Date();
	var dd = parseInt(today.getDate()) - days;
	var mm = parseInt(today.getMonth())+1 - months; //January is 0!
	var yyyy = parseInt(today.getFullYear()) - years;
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
	return today;
}






function getTime() {
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	m=checkTime(m);
	s=checkTime(s);
	return h+":"+m+":"+s;
}

function createImage(parent,id,src,height){
	var imgSrc = document.createElement("img");
	imgSrc.setAttribute("id",id);
	imgSrc.setAttribute("src",src);
	imgSrc.setAttribute("height",height);
	imgSrc.setAttribute("align","right");
	parent.appendChild(imgSrc);
	return imgSrc;
}

function createLabel(parent,txt,id){
	var labelObj = document.createElement("label");
	labelObj.setAttribute("id",id);
	labelObj.innerText = txt;
	parent.appendChild(labelObj);
	return labelObj;
}

function checkTime(i)
{
	if (i<10)
	{
		i="0" + i;
	}
return i;
}



var visualObjects = {};

var hash = function(obj){
	return obj.id;
}

function visualObject(id,name,url,type,height,width,desc){
	this.id = id;
	this.url = url;
	this.type = type;
	this.width = width;
	this.height = height;
	this.desc = desc;
	this.name = name;
}

function toggleDiv(id,displayProperty){
	var obj = document.getElementById(id);
	if (obj.style.display == 'none' || obj.style.display =='' ) {
		obj.style.display = 'inline'
	}else{
		obj.style.display = 'none';
	}
}

function getPanels(){
	var reqObj = initXHR(this.requestObject);
	var reportName = window.location.protocol + "//" + window.location.host +"/Report/ReportUI/reports/panels";
	reqObj.open("GET",reportName, true);
	reqObj.onreadystatechange= function() {
		if(reqObj.readyState==4){
			   //response is OK
			if(reqObj.status == 200){
				buildPanel(reqObj);
				reqObj.abort();
			}
		}

	};
	reqObj.send(null);
}




function buildPanel(reqObj) {
	var str="";
	var response=reqObj.responseXML;
	var root=response.documentElement;
	for(i=0;i <root.childNodes.length;i++){
    	 var childNode = root.childNodes[i];
    	 var ulElement = document.createElement("ul");
    	 for(j=0;j <childNode.childNodes.length;j++){
    		 var report = childNode.childNodes[j];
    		 var name = report.getAttribute("name");
    		 var url = report.getAttribute("url");
    		 var id = report.getAttribute("id");
    		 var desc = report.getAttribute("desc");
    		 var height = report.getAttribute("height");
    		 var width = report.getAttribute("width");
    		 var type = report.getAttribute("type");
    		 var liElement = document.createElement("li");
    		 var visualInst = new visualObject(id,name,url,type,width,height,desc);
    		 visualObjects[hash(visualInst)] = visualInst;
    		 liElement.innerHTML = "<input type='checkbox' name=checkBox_"+id+"  value='"+visualInst.id+"' onclick='javaScript:addorRemovePanels(this.value)' >"+name;
    		 ulElement.appendChild(liElement);
    	 }
    	 
    	 
	}
	document.getElementById("settingsPanel").appendChild(ulElement);
	
}

function addorRemovePanels(checkBoxValue) {
	var objs = visualObjects[checkBoxValue];
	var obj = document.body;
	var panelObj;
	if (objs) {
		panelObj = document.getElementById('panel_'+objs.id);
		if (panelObj){
			obj.removeChild(panelObj);
			return;
		}				
		if (objs.type == "chart") {
			panelObj = new ChartPanel('panel_'+objs.id,objs.height,objs.width,obj,objs.name,5,objs.url);
		}else if (objs.type == "pieChart") {
			panelObj = new PieChartPanel('panel_'+objs.id,objs.height,objs.width,obj,objs.name,5,objs.url);
		}else if (objs.type == "table") {
			panelObj = new TablePanel('panel_'+objs.id,objs.height,objs.width,obj,objs.name,10,objs.url);
		}
		panelObj.create();
		panelObj.refresh();
	}
}



function barchart(id,height,width,xValues,values,parent){
	this.id = id;
	this.width = width;
	this.height = height;
	this.values = values;
	this.parent = parent;
	this.xValues = xValues;

	this.getMaxValue = function(){
		return getMaxValue(values);
	}



	this.createBarFooter = function(innerStr,parent) {
		var footdiv = document.createElement("div");
		footdiv.setAttribute('class' , 'Barfooter');
		footdiv.style.width = this.width + "px";
		footdiv.style.height = Math.floor(this.height * 15/100) + "px";
		//createLabel(footdiv, innerStr, this.id+"_barfootLabel");
		footdiv.innerHTML = innerStr;
		parent.appendChild(footdiv)
		return footdiv;
	}

	this.create = function(){
		var div = document.createElement("div");
		div.setAttribute("id",this.id);
		div.style.height = this.height+"px";
		div.style.width = this.width+"px";
		this.createUL(div);
		var tableStr = '<table><tr>';
		for(var i =0;i<this.values.length;i++) {
			tableStr =  tableStr + '<td  width='+(Math.floor( (this.width)/values.length) -2 )+'px'+'>'+ this.xValues[i]  + '</td>';
			'width:'+(Math.floor( (this.width)/values.length) -2 )+'px';
		}
		tableStr =  tableStr + '</tr></table>';
		this.createBarFooter(tableStr,div);
		this.parent.appendChild(div);
	}



	this.createUL = function(parentObject) {
		var ul = document.createElement("ul");
		ul.setAttribute('class' , 'barchart');
		ul.setAttribute('style' , 'width:'+Math.round((this.width/values.length)) * values.length+'px;height:'+this.getChartHeight()+'px');
		for(var i =0;i<this.values.length;i++) {
			this.createLI(ul,i);
		}
		parentObject.appendChild(ul);
	}

	this.getChartHeight = function() {
		return Math.floor(this.height * 85 / 100);
	}

	this.createRule = function(parentObject){
		var ruleValues = this.values.getUnique();
		var len = ruleValues.length;
		var ruleTable = document.createElement("table");
		var ratio = this.height / this.getMaxValue();
		ruleValues.sort(function(a,b){return a-b});
		for (var i =0;i< ruleValues.length;i++){
			var ruleRow = ruleTable.insertRow(i);
			var ruleCol  = ruleRow.insertCell(0);
			ruleCol.innerHTML = ruleValues[ruleValues.length-i-1];
		}
		ruleTable.style.height = "100%";
		ruleTable.style.width = "100%";
		parentObject.appendChild(ruleTable);
	}



	this.createLI = function(parentObject,i) {
		var li = document.createElement("li");
		var spanObj = document.createElement("span");
		var ratio = this.getRatio(i);
		li.setAttribute('style' , 'width:'+(Math.floor( (this.width)/values.length) -2 )+'px;border-top-width:'+(this.getChartHeight()-ratio)+'px;border-right-width:2px;height:'+ratio+'px');
		spanObj.innerHTML = this.values[i];
		li.setAttribute('class' ,'bar');
		li.appendChild(spanObj);
		parentObject.appendChild(li);
	}



	this.getRatio = function(i){
			return  Math.floor(((this.getChartHeight()/this.getMaxValue()) * this.values[i]));
	}
}

function panel(id,width,height,parent,title){
		this.id = id;
		this.width = width;
		this.height = height;
		this.parent = parent;
		this.title = title;
		this.elementObj = null;
		this.footerObj = null;
		this.detailedViewId = 4;
		var className = 'panel'


		this.createMain = function(){
			var div = document.createElement("div");
			div.setAttribute("id",this.id);
			div.setAttribute('class' , 'panel');
			div.style.height = this.height+"px";
			div.style.width = this.width+"px";
			this.elementObj = div;
			this.parent.appendChild(div);
		}

		this.create = function(){
			/** Main Div creation **/
			this.createMain();
			/** Call ContentFunction to create appropriate Content **/
			this.createContent();

			/** Create footer Div **/
			this.createFooter(this.title );
			this.addContent();
		}

		this.createContent = function () {};
		this.addContent = function () {};
		
		

		this.createFooter = function(innerStr) {
			var footdiv = document.createElement("div");
			footdiv.setAttribute('class' , 'footer');
			footdiv.style.width = this.width + "px";			;
			footdiv.style.height = (this.height * 15/100) + "px";
			createLabel(footdiv, innerStr, this.id+"_footLabel");
			this.footerObj = footdiv;
			this.elementObj.appendChild(footdiv)
			return footdiv;
		}
}





function TimerPanel (id,width,height,parent,title,interval){
		panel.call(this, id,width,height,parent,title);
		this.interValTime = interval;
		this.invervalId = null;
		this.isRefresh = false;
		this.requestObject = null;

		this.startRefresh = function() {
			var obj = this;
			obj.refresh();
			return setInterval(function() { return obj.refresh(); }, (this.interValTime * 1000));
		}

		this.addFilters = function () {
		}
		
		this.addContent = function () {
			var imgObj = createImage(this.footerObj,this.id+"_ref_img", "img/refresh_button.png", "100%");
			var self = this;

			 imgObj.addEventListener("click", function(e) {
				 if (self.isRefresh){
					 document.getElementById(self.id+"_ref_img").src = "img/refresh_button.png";
					 clearInterval(self.invervalId);
					 self.isRefresh = false;
				 }else{
					 document.getElementById(self.id+"_ref_img").src = "img/ajax-loader.gif";
					 self.invervalId = self.startRefresh();
					 self.isRefresh = true;
				 }

			 },false);
			 
			 
			 
			 var dateFilterObj = buildDataFilter(this.id+'_dateFilter');
			 this.detailvedView();
			 this.footerObj.appendChild(dateFilterObj);
		};
		
		
		
		this.refresh = function(){
			document.getElementById( this.id+"_footLabel").innerText = this.title + '.. Last Refresh Updated..' +getTime();
			if (this.url){
				this.getReport();
			}
		}
		
		this.buildFilterCondition = function (){
			var filterCondition = '';
			var dateFilterObj = document.getElementById(this.id+'_dateFilter');
			if (dateFilterObj){
				if (!(dateFilterObj.value=='')){
					filterCondition = dateFilterObj.value;
				}
			}
			if (!(filterCondition == '')){
				filterCondition = "?filter=" + filterCondition;
			}
			
			return filterCondition;
			
		}

		this.detailvedView = function () {
			var spanObj = document.createElement("span");
			var self = this;
			var filterCondition = self.buildFilterCondition();
			var url = 'popupView.html';
			if (filterCondition == ''){
				url = url + '?reportId='+this.detailedViewId;
			}else{
				url = url+filterCondition + '&reportId='+this.detailedViewId;
			}
			spanObj.innerHTML = 'DetailedView';
			spanObj.addEventListener("click", function(e) {
				window.open(url,'_popupReportView','menubar=0,location=0,status=0,toolbar=0',true);
			 },false);
			this.footerObj.appendChild(spanObj);
		}


		
		this.getReport = function(){
			this.requestObject = initXHR(this.requestObject);
			var obj = this;
			var reportName = obj.url + obj.buildFilterCondition();
			this.requestObject.open("GET",reportName, true);
			this.requestObject.onreadystatechange= function() {
				if(obj.requestObject.readyState==4){
					   //response is OK
					if(obj.requestObject.status == 200){
						obj.buildReport();
						obj.requestObject.abort();
					}
				}
			};
			this.requestObject.send(null);
		}

		this.buildReport = function() {
		}

}

extend(panel, TimerPanel);

function ChartPanel(id,width,height,parent,title,interval,url){
	TimerPanel.call(this, id,width,height,parent,title,interval);
	this.xData = [];
	this.yData = [];
	this.url = url;


	this.buildReport = function () {
		this.xData = [];
		this.yData = [];
		var response=this.requestObject.responseXML;
		var root=response.documentElement;
		for(i=0;i <root.childNodes.length;i++){
	    	 var childNode = root.childNodes[i];
	    	 for(j=0;j <childNode.childNodes.length;j++){
	    		 var record = childNode.childNodes[j];
	    		 this.xData.push( record.childNodes[0].childNodes[0].nodeValue);
				 this.yData.push(record.childNodes[1].childNodes[0].nodeValue);
	    	 }
		}
		var div = document.getElementById(id+"_barChart");
		if (div){
			this.elementObj.removeChild(div);
		}
		new barchart(id+"_barChart",Math.floor(this.height * 85/100),this.width,this.xData,this.yData,this.elementObj).create();
	}


}

extend(TimerPanel, ChartPanel);


function PieChartPanel(id,width,height,parent,title,interval,url){
	TimerPanel.call(this, id,width,height,parent,title,interval);
	this.xData = [];
	this.yData = [];
	this.url = url;


	this.createContent = function () {
		var canvasElementDiv = document.createElement("div");
		canvasElementDiv.id = this.id+"piechartDiv";
		canvasElementDiv.style.height = Math.floor(this.height * 85/100);
		canvasElementDiv.style.width = this.width;
		canvasElementDiv.setAttribute('class' , 'pieChart');
		this.elementObj.appendChild(canvasElementDiv);

	};

	this.buildReport = function () {
		this.xData = [];
		this.yData = [];
		var response=this.requestObject.responseXML;
		var root=response.documentElement;
		for(i=0;i <root.childNodes.length;i++){
	    	 var childNode = root.childNodes[i];
	    	 for(j=0;j <childNode.childNodes.length;j++){
	    		 var record = childNode.childNodes[j];
	    		 this.xData.push( record.childNodes[0].childNodes[0].nodeValue );
				 this.yData.push(record.childNodes[1].childNodes[0].nodeValue);
	    	 }
		}

		for ( var int = 0; int < this.yData.length; int++) {
			this.yData[int] = parseInt(this.yData[int]) ;
		}

		var pieChart = new PieChart(this.id,
				{
					data: this.yData,
					labels: this.xData,
					height:this.height,
					width:this.width
				}
		);
		
	}
}

extend(TimerPanel, PieChartPanel);


//TimerPanel.prototype = new panel();

function TablePanel (id,width,height,parent,title,interval,url){
		TimerPanel.call(this, id,width,height,parent,title,interval);
		this.url = url;
		var isTableCreated = -1;

		this.createContent = function () {
			var tableDiv = document.createElement("div");
			tableDiv.setAttribute('class' , 'tableDiv');
			var tableObj = document.createElement("table");
			tableObj.setAttribute("id",id+"_table");
			tableObj.setAttribute('class' , 'tableContent');
			tableDiv.appendChild (tableObj);
			this.elementObj.appendChild (tableDiv);
		};



		this.buildReport = function() {
			buildTableFromResponse(this.requestObject,id+"_table");
		}


}

extend(TimerPanel, TablePanel);




function PieChart(id, o) {
	this.id = id;
	this.includeLabels = false;
	if (o.includeLabels == undefined) {
		this.includeLabels = false;
	}
	else {
		this.includeLabels = o.includeLabels;
	}
	this.actualData = o.data;
	this.data = o.data ? this.toDegree(o.data) : [30, 70, 45, 65, 20, 130]; // in degrees
	this.labels = o.labels ? o.labels : ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
	this.colors = o.colors ? o.colors : [
     	"#0092B9", "#1d8e04", // green
     	"#86AD00", "#9edd08", // yellow green
     	"#F2B705", "#faf406", // yellow
     	"#D97904", "#f2700f", // orange
     	"#BC3603", "#ea2507", // red
     	"#e2bcbd", "#9e2126"  // purple
 	];	
	this.height = o.height;
	this.width = o.width;
	this.create();
}

PieChart.prototype = {
		
	create: function() {
		var canvasElementDiv = document.getElementById(this.id+"piechartDiv");
		var canvasElement = document.getElementById(this.id+"piechart");
		if (canvasElement){
			canvasElementDiv.removeChild(canvasElement);
		}
		canvasElement = document.createElement('canvas');
		canvasElement.height = Math.floor(this.height * 75/100);
		canvasElement.width = Math.floor(this.height * 75/100);
		canvasElement.id = this.id+"piechart";
		canvasElementDiv.appendChild(canvasElement);
		this.canvas = canvasElement;
		
		this.draw();
		
		var ledgendDiv = document.getElementById(this.id+"ledgendDiv");
		if (ledgendDiv){
			canvasElementDiv.removeChild(ledgendDiv);
		}
		ledgendDiv = document.createElement("div");
		ledgendDiv.id = this.id+"ledgendDiv";
		ledgendDiv.style.height = Math.floor(this.height * 75/100);
		ledgendDiv.style.width = Math.floor(this.width * 30/100);
		ledgendDiv.setAttribute('class' , 'legend');
		var ledgendStr = '<ul>';
		for ( var j = 0; j < this.labels.length; j++) {
			ledgendStr =  ledgendStr + "<span style='background:"+this.colors[j]+";'></span><li>"+this.labels[j]+"&nbsp;&nbsp;&nbsp;&nbsp;" + this.actualData[j]+"</li>";
		}
		 ledgendStr = ledgendStr + '</ul>';
		ledgendDiv.innerHTML = ledgendStr;
		canvasElementDiv.appendChild(ledgendDiv);
	},	

	draw: function() {
		var self = this;
		var context = this.canvas.getContext("2d");
		for (var i = 0; i < this.data.length; i++) {
			this.drawSegment(this.canvas, context, i, this.data[i], false, this.includeLabels);
		}
	},

	drawSegment: function(canvas, context, i, size, isSelected, includeLabels) {
		var self = this;
		context.save();
		var centerX = Math.floor(canvas.width / 2);
		var centerY = Math.floor(canvas.height / 2);
		radius = Math.floor(canvas.width / 2);

		var startingAngle = self.degreesToRadians(self.sumTo(self.data, i));
		
		var arcSize = self.degreesToRadians(size);
		var endingAngle = startingAngle + arcSize;

		context.beginPath();
		context.moveTo(centerX, centerY);
		context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
		context.closePath();

			context.fillStyle = self.colors[i] ;

		context.fill();
		context.restore();

	},

	toDegree: function(data) {
		var tmpData = [];
		var sum = getSum(data);
		for ( var int = 0; int < data.length; int++) {
			tmpData.push(data[int] / sum * 360 );
		}
		return tmpData; 
	},


	// helper functions
	degreesToRadians: function(degrees) {
		return (degrees * Math.PI)/180;
	},

	sumTo: function(a, i) {
		var sum = 0;
		for (var j = 0; j < i; j++) {
			sum += a[j];
		}
		return sum;
	}


}