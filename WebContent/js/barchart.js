function barchart(id,width,height,values,parent){
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
				//div.setAttribute("style", "display:inline-block");
				//div.style.height = this.height+"px";
				this.createUL(div);
				var footdiv = document.createElement("div");
				footdiv.setAttribute('style' , 'width:'+Math.round((this.width/values.length)) * values.length+'px');
				div.appendChild(footdiv);
				this.parent.appendChild(div);
			}

			this.createUL = function(parentObject) {
				var ul = document.createElement("ul");
				ul.setAttribute('class' , 'barchart');
				ul.setAttribute('style' , 'width:'+Math.round((this.width/values.length)) * values.length+'px;height:'+this.height+'px');
				for(var i =0;i<this.values.length;i++) {
					this.createLI(ul,i);
				}
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