
riff.extend(
{
	data : {
		//n @_elm {Array} an array of DOM nodes
		increaseBufferIdx : function ( _el ) {
			_el.bufferIdx = riff.global.bufferIdx++;
			return _el.bufferIdx;
		},
		//n Internal function. not for the user.
		bufferInternalSet : function( _el, _key, _value ) {
			if( _el.bufferIdx ) {
				return riff.global.buffer[ _el.bufferIdx ][_key] = _value;
			} else {
				tBufferID = riff.data.increaseBufferIdx( _el );
				riff.global.buffer[ tBufferID ] = {};
				return riff.global.buffer[ tBufferID][_key] = _value;
			};
		},
		//n Internal function. not for the user.
		bufferInternalGet : function ( _el, _key ) {
			if( _el && _el.bufferIdx ) {
				if ( _el.bufferIdx ) return riff.global.buffer[ _el.bufferIdx ][ _key ];
			}
			return "";
		},
		//n @_elm {Array} an array of DOM nodes
		bufferSingle : function ( _el, _key, _value ) {
			if( arguments.length == 3) {				//n set mode
				return riff.data.bufferInternalSet( _el, _key, _value );
			} else if( arguments.length == 2) {			//n get mode
				return riff.data.bufferInternalGet( _el, _key );
			}
		},

		//n @_elm {Array} an array of DOM nodes
		buffer : function ( _elm, _key, _value ) {
			_elm = riff.elmCheck(_elm);
			if( arguments.length == 3) {				//n set mode
				function tFnSetMode ( _el ) {
					riff.data.bufferInternalSet( _el, _key, _value );
				};
				_elm.forEach( tFnSetMode );
				return _elm;
			} else if( arguments.length == 2) {			//n get mode
				var rvArr = [];
				function tFnGetBufferArray( _el )
				{
					rvArr.push( riff.data.bufferInternalGet( _el, _key ) );
				};
				_elm.forEach( tFnGetBufferArray );
				return rvArr;
			}
		},
		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_el {Node} DOM Elements.NOT ARRAY.
		deleteBufferSingle : function( _el ) {
			if( _el.bufferIdx ) {
				delete riff.global.buffer[ _el.bufferIdx ];
				delete _el.bufferIdx;
			};

			var tChildNodes = _el.childNodes;
			for( var k in tChildNodes ) {
				if( tChildNodes[k].nodeType == 1 ) {
					riff.data.deleteBufferSingle( tChildNodes[k] );
				}
			}
			tChildNodes = null;
			return _el;
		},

		//n delete the buffer from node( includes the childNodes) by recursive .
		//n @_elm { queryString } CSS QueryString .
		//n @_elm { Array of NodeList } DOM Elements. ARRAY.
		deleteBuffer : function( _elm ) {
			_elm = riff.elmCheck( _elm );
			function tFn ( _el ) {
				riff.data.deleteBufferSingle( _el );
			}
			_elm.forEach( tFn );
			return _elm;
		},
		//n storage base localStorage(PC)
		storage : function(_key, _value){
			if(!_key){
				return null;
			}
			var tStorageObj = window.localStorage;
			if(tStorageObj){
				if(arguments.length == 1){
					return tStorageObj.getItem(_key);
				} else if(arguments.length == 2) {
					tStorageObj.setItem(_key, _value);
				}
			}
			tStorageObj = null;
		},
		setStorage : function(_key, _value, _opt){
			if(!_key && !_value){
				return null;
			}
			riff.data.storage(_key, riff.util.objToStr(_value));
		},
		getStorage : function(_key, _value){
			if(!_key){
				return null;
			}
			var t = riff.data.storage(_key);
			if(!t){
				return null;
			}
			
			var tData = eval("(" + t + ")");
			if(!_value){
				return tData;
			} else {
				return tData[_value];
			}
		}
	}
});

window.$d = riff.data;

