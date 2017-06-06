yar.define("woo",function(){
	function ret(){
		console.log("woooops!");
	}
	return ret
});
yar.define("sup",[],function(require, exports, module){
	function ret(){
		console.log("surprise!");
	}
	module.exports = ret
});
yar.require(["woo","sup"],function(woo,sup){
	woo()
	sup()
})