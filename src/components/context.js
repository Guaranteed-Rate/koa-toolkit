'use strict';
var $context;

function Context() {
	return function* (next) {
		$context = this.state;
		yield next;
	};
}

Context.set = function (key, value) {
	$context[key] = value;
	return $context[key];
};

Context.get = function (key) {
    if ($context && $context[key]) {
        return $context[key];
    }	
};

module.exports = exports = Context;