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
		};


		this.refresh = function(){
			document.getElementById( this.id+"_footLabel").innerText = this.title + '.. Last Refresh Updated..' +getTime();
			if (this.url){
				this.getReport();
			}
		}

		this.getReport = function(){
			this.requestObject = initXHR(this.requestObject);
			var obj = this;
			var reportName = obj.url;
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

		var sum = getSum(this.yData);
		for ( var int = 0; int < this.yData.length; int++) {
			this.yData[int] =  Math.floor(( parseInt(this.yData[int]) / sum) * 360) ;
		}

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
		var pieChart = new PieChart(this.id+"piechart",
				{
					data: this.yData,
					labels: this.xData
				}
			);
		pieChart.draw();

		var ledgendDiv = document.getElementById(this.id+"ledgendDiv");
		if (ledgendDiv){
			canvasElementDiv.removeChild(ledgendDiv);
		}
		ledgendDiv = document.createElement("div");
		ledgendDiv.id = this.id+"ledgendDiv";
		ledgendDiv.style.height = Math.floor(this.height * 50/100);
		ledgendDiv.style.width = Math.floor(this.width * 30/100);
		ledgendDiv.setAttribute('class' , 'legend');
		var ledgendStr = '<ul>';
		for ( var j = 0; j < this.xData.length; j++) {
			ledgendStr =  ledgendStr + '<li>'+this.xData[j]+'</li>';
		}
		 ledgendStr = ledgendStr + '</ul>';
		ledgendDiv.innerHTML = ledgendStr;
		canvasElementDiv.appendChild(ledgendDiv);
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



		this.buildReport = function(req) {
			var tableObject = document.getElementById(id+"_table");
			for(k = tableObject.rows.length;k> 0; k--){
				 tableObject.deleteRow(k-1);
			}
			tableObject.deleteTHead();
			var header = tableObject.createTHead();
			var headerRow;
			var response=this.requestObject.responseXML;
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


}

extend(TimerPanel, TablePanel);




function PieChart(id, o) {
	this.includeLabels = false;
	if (o.includeLabels == undefined) {
		this.includeLabels = false;
	}
	else {
		this.includeLabels = o.includeLabels;
	}
	this.data = o.data ? o.data : [30, 70, 45, 65, 20, 130]; // in degrees
	this.labels = o.labels ? o.labels : ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
	this.colors = o.colors ? o.colors : [
     	["#0092B9", "#1d8e04"], // green
     	["#86AD00", "#9edd08"], // yellow green
     	["#F2B705", "#faf406"], // yellow
     	["#D97904", "#f2700f"], // orange
     	["#BC3603", "#ea2507"], // red
     	["#e2bcbd", "#9e2126"]  // purple
 	];

	this.canvas = document.getElementById(id);
}

PieChart.prototype = {

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

		isSelected ?
			context.fillStyle = self.colors[i][1] :
			context.fillStyle = self.colors[i][0];

		context.fill();
		context.restore();

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