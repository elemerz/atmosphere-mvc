(function($, NS, SuperClass, SubClass) {
	window[NS][SubClass] = window[NS][SubClass] || window[NS][SuperClass].extend({
		toString : function() {
			return NS + '.' + SubClass;
		},
		socket: $.atmosphere,
		subSocket: null,
		isSending:false,
		stopSignaled:false,
		
		fruits:['apple','pear','plum','nut','coconut','pineapple','grapes','cherry','strawberry','banana','grapefruit','chestnut','walnut','peanut'],
		/** Constructor. */
		init : function(cfg) {
			this.openChannel("streaming");
			this.bindBehavior();
		},
		
		bindBehavior: function(){
			var that=this;
			
			$('#btnSend').click(function(){
				var v=$('#txtFromClient').val();
				if(jQuery.atmosphere.requests.length===0){
					that.openChannel("streaming");
				}
				that.subSocket.push(v);
			});
			$('#btnAutoSend').click(function(){
				var lngTimer,t= 20, sender=function(){
					var v=that.fruits.choose();
					that.subSocket.push(v);
					
					window.clearTimeout(lngTimer);
					t= Number.random(1000,6000);
					if(!that.stopSignaled){
						lngTimer=window.setTimeout(sender,t);
					}
				};
				if(jQuery.atmosphere.requests.length===0){
					that.openChannel("streaming");
				}
				
				that.isSending=true;
				$('#btnAutoSend').attr('disabled','disabled');
				$('#btnStop').removeAttr('disabled');
				
				window.clearTimeout(lngTimer);
				lngTimer=window.setTimeout(sender,t);
			});
			$('#btnStop').click(function(){
				that.stopSignaled=true;
				that.isSending=false;
				that.socket.unsubscribe();
				that.isSending=true;
				$('#btnAutoSend').removeAttr('disabled','disabled');
				$('#btnStop').attr('disabled','disabled');
				
			});
		},
		/**Open a bi-directional communication channel between the browser and the specified server.*/
		openChannel: function (transport) {
			var that=this,
				request = new $.atmosphere.AtmosphereRequest();
			
			$.extend(request,{
				url:$('body').data('search-url'),
				contentType:"application/json",
				transport:transport,
				fallbackTransport:"long-polling",
				onOpen:that.onChannelOpen,	
				onMessage:that.onMessageReceived,
				onMessagePublished: that.onMessagePublished,
				onError:that.onError,
				onReconnect: that.onReconnect
			});
			this.subSocket = this.socket.subscribe(request);
		},
		
		/**On Channel open*/
		onChannelOpen: function(){
			$.atmosphere.log('info', ['onChannelOpen']);
		},
		
		/**On Message From server.*/
		onMessageReceived: function(response){
			$.atmosphere.log('info', ['onMessageReceived',]);
			var v=$('#txaFromServer').val();
			$('#txaFromServer').val(v + (/^\s*$/.test(v) ? '' : '\n') + response.responseBody).scrollTop(100000);
		},
		
		/**On Message Published*/
		onMessagePublished: function(response){
			$.atmosphere.log('info', ['onMessagePublished.', response]);
		},
		
		/**On Channel Error*/
		onError: function(){
			$.atmosphere.log('info', ['onError']);
		},
		/**On Channel Reconnected*/
		onReconnect: function(){
			$.atmosphere.log('info', ['onReconnect']);
		}
	});

	/* Attach page specific behavior on page load */
	$(function() {
		return new window[NS][SubClass]();
	});
}(window.jQuery, "WMC", "Base", "Home"));
