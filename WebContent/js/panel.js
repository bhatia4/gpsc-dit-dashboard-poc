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


var req=null;
//This function initializes XHR
function initXHR() {
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


function barchart(id,height,width,values,parent){
	this.id = id;
	this.width = width;
	this.height = height;
	this.values = values;
	this.parent = parent;

	this.getMaxValue = function(){
		return Math.max.apply( Math, values );
	}
	


	this.create = function(){
		var div = document.createElement("div");
		div.setAttribute("id",this.id);
		div.style.height = this.height+"px";
		div.style.width = this.width+"px";
		this.createUL(div);
		
		this.parent.appendChild(div);
	}
	
	
	
	this.createRule = function(parentObject){
		var ruleValues = this.values.getUnique();
		var len = ruleValues.length;
		var ratio = this.height / this.getMaxValue();
		for (var i =0;i< ruleValues.length;i++){
			var ruleDiv = document.createElement("div");
			ruleDiv.setAttribute('class' , 'rulesVert');
			ruleDiv.style.bottom =  Math.round(ratio * ruleValues[i] ) + "px";
			ruleDiv.innerHTML = ruleValues[i];
			parentObject.appendChild(ruleDiv);
		}
	}

	this.createUL = function(parentObject) {
		var ul = document.createElement("ul");
		ul.setAttribute('class' , 'barchart');
		ul.setAttribute('style' , 'width:'+Math.round((this.width/values.length)) * values.length+'px;height:'+this.height+'px');
		for(var i =0;i<this.values.length;i++) {
			this.createLI(ul,i);
		}
		this.createRule(ul);
		parentObject.appendChild(ul);
	}

	this.createLI = function(parentObject,i) {
		var li = document.createElement("li");
		li.setAttribute('style' , 'width:'+Math.round((this.width/values.length)-2)+'px;border-top-width:'+(this.height-this.getRatio(i))+'px;border-right-width:2px;height:'+this.getRatio(i)+'px');
		var spanObj = document.createElement("span");
		spanObj.innerHTML = this.values[i];
		li.appendChild(spanObj);
		parentObject.appendChild(li);
	}

	
	
	this.getRatio = function(i){
		return  Math.round(((this.height/this.getMaxValue()) * this.values[i]));
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


function ChartPanel(id,width,height,parent,title,chartValues){
	panel.call(this, id,width,height,parent,title);
	this.chartValues = chartValues;
	
	this.createContent = function () {
		new barchart(id+"_barChart",(this.height * 50/100),this.width,this.chartValues,this.elementObj).create();
	};
}

extend(panel, ChartPanel);


function TimerPanel (id,width,height,parent,title,interval){
		panel.call(this, id,width,height,parent,title);
		this.interValTime = interval;
		this.invervalId = null;
		this.isRefresh = false;

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
		}
}

extend(panel, TimerPanel);

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
			tableDiv.appendChild (tableObj);			 
			this.elementObj.appendChild (tableDiv);
		};
				
		this.refresh = function(){
					document.getElementById( this.id+"_footLabel").innerText = this.title + '.. Last Refresh Updated..' +getTime();
					this.getReport();
		}
		
		this.buildTableReport = function() {
			var tableObject = document.getElementById(id+"_table");
			for(k = tableObject.rows.length;k> 0; k--){
				 tableObject.deleteRow(k-1);
			}
			tableObject.deleteTHead();
			var header = tableObject.createTHead();
			var headerRow;
			var response=req.responseXML;
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
		
		this.getReport = function(){
			initXHR();
			var obj = this;
			var reportName = obj.url;
			req.open("GET",reportName, true);
			req.onreadystatechange= function() { 
				if(req.readyState==4){
					   //response is OK
					if(req.status == 200){
						obj.buildTableReport();
						req.abort();
					}
				}

			};
			req.send(null);
		}
		
}

extend(TimerPanel, TablePanel);