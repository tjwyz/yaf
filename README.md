# yar

Yet another requireJs

## Usage

```
npm install

npm run build

```

and then 

```
define("woo",function(){
	function ret(){
		console.log("woooops!");
	}
	return ret
});
define("sup",[],function(require, exports, module){
	function ret(){
		console.log("surprise!");
	}
	module.exports = ret
});
require(["woo","sup"],function(woo,sup){
	woo()
	sup()
})

// "woooops!"
// "surprise!"
```

