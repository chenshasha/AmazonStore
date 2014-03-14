var MicroCache	= function(){
    var _values	= {};

    function now() { return (new Date).getTime(); }

    return {
        get	: function(key){ return _values[key];	},
        contains: function(key){ return key in _values;	},
        remove	: function(key){ delete _values[key];	},
        set	: function(key, value){	_values[key] = value;},
        values	: function(){ return _values;	},
        getSet	: function(key, value){
            if( !this.contains(key) ){
                this.set(key, typeof value == 'function' ? value() : value )
            }
            return this.get(key);
        },
        clear    : function() { _values = {}; },
        isEmpty  : function() { return (Object.keys(_values).length === 0);},
        getAll   : function() {
            for (var propt in _values) {
                var values = [];

                for (var propt in _values) {
                    values.push(_values[propt])
                }
                return values;
            }
        }
    }
}


// export in common js
if( typeof module !== "undefined" && ('exports' in module)){
    module.exports	= MicroCache;
}