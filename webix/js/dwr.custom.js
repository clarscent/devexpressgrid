function Callback(callbackFunc) {
	this.callback = callbackFunc;
	
	var isShowLoading = false;
	this.async = true;
	this.cache = false;
	this.timeout = 600000;
	
	this.setShowLoading = function(bool) {
		//console.log("setShowLoading", isShowLoading);
		isShowLoading = bool;
		//console.log("setShowLoading", isShowLoading);
	};
	
	this.preHook = function() {
		//console.log("prehook", this, isShowLoading);
		
		if (isShowLoading) {
			popup.loading.show();
		}
	};
	
	this.postHook = function() { 
		//console.log("posthook", this, isShowLoading);
		
		if (isShowLoading) {
			popup.loading.hide();
		}
	};
	
	this.errorHandler = function(msg, ex) {
		console.log("DWR Error");
		console.log(msg, ex);
		console.log(ex.message);
		console.log(dwr.util.toDescriptiveString(ex, 2));
		
		popup.alert.show(msg);
	};
	
	return this;
}