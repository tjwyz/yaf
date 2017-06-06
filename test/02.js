yar.define("woo",["sup"],function(sup){
	console.log(sup);
	function ret(){
		console.log("woooops!");
	}
	return ret
});
yar.define("sup",["woo"],function(woo){
	console.log(woo);
	function ret(){
		console.log("surprise!");
	}
	return ret
});
yar.require(["woo"],function(woo){
	woo()
})