(function($, NS, SuperClass, SubClass) {
	window[NS][SubClass] = window[NS][SubClass] || window[NS][SuperClass].extend({
		toString : function() {
			return NS + '.' + SubClass;
		},
		socket: $.atmosphere,
		subSocket: null,
		fruits:['apple','pear','plum','nut','coconut','pineapple','grapes','cherry','strawberry','banana','grapefruit','chestnut','walnut','peanut'],
		/** Constructor. */
		init : function(cfg) {
			console.log('Atm loaded...');
			this.handleAtmosphere("streaming");
			this.bindBehavior();
		},
		
		removeActive: function () {
			$('#websockets-item').toggleClass("active", false);
			$('#streaming-item').toggleClass("active", false);
			$('#polling-item').toggleClass("active", false);
			$('#long-polling-item').toggleClass("active", false);
		},
		bindBehavior: function(){
			var that=this;
			$('#btnSendClientMsg').click(function(){
				var v=$('#txtClientMsg').val();
				that.subSocket.push(v);
			});
			$('#btnAutoSender').click(function(){
				var lngTimer,/*that=this,*/t= Number.random(1000,6000), sender=function(){
					var v=that.fruits.choose();
					that.subSocket.push(v);
					t= Number.random(1000,6000);
					window.clearTimeout(lngTimer);
					lngTimer=window.setTimeout(sender,t);
				};
				window.clearTimeout(lngTimer);
				lngTimer=window.setTimeout(sender,t);
			});
			$("#streaming-item").click(function() {
				this.removeActive();
				this.socket.unsubscribe();
				handleAtmosphere("streaming");
				$('#streaming-item').toggleClass("active");
			});
			$("#websockets-item").click(function() {
				this.removeActive();
				this.socket.unsubscribe();
				handleAtmosphere("websocket");
				$('#websockets-item').toggleClass("active");
			});
			$("#polling-item").click(function() {
				this.removeActive();
				this.socket.unsubscribe();
				handleAtmosphere('polling');
				$('#polling-item').toggleClass("active");
			});
			$("#long-polling-item").click(function() {
				this.removeActive();
				this.socket.unsubscribe();
				handleAtmosphere('long-polling');
				$('#long-polling-item').toggleClass("active");
			});
		},
		
		handleAtmosphere: function (transport) {
			var asyncHttpStatistics = {
				transportType : 'N/A',
				responseState : 'N/A',
				numberOfCallbackInvocations : 0,
				numberOfTweets : 0,
				numberOfErrors : 0
			};

			function refresh() {
				console.log("Refreshing data tables...");
				$('#responseState').html(asyncHttpStatistics.responseState);
				$('#numberOfCallbackInvocations').html(asyncHttpStatistics.numberOfCallbackInvocations);
				$('#numberOfTweets').html(asyncHttpStatistics.numberOfTweets);
				$('#numberOfErrors').html(asyncHttpStatistics.numberOfErrors);
			}
			var request = new $.atmosphere.AtmosphereRequest();
			request.transport = transport;
			request.url = $('body').data('search-url');
			request.contentType = "application/json";
			request.fallbackTransport = null;
			// request.callback = buildTemplate;

			request.onMessage = function(response) {
//				buildTemplate(response);
				$('<div>'+ response.responseBody +'</div>').prependTo('#twitterMessages');
			};

			request.onMessagePublished = function(response) {

			};

			request.onOpen = function() {
				$.atmosphere.log('info', [ 'socket open' ]);
			};
			request.onError = function() {
				$.atmosphere.log('info', [ 'socket error' ]);
			};
			request.onReconnect = function() {
				$.atmosphere.log('info', [ 'socket reconnect' ]);
			};

			this.subSocket = this.socket.subscribe(request);

			function buildTemplate(response) {
				asyncHttpStatistics.numberOfCallbackInvocations++;
				asyncHttpStatistics.transportType = response.transport;
				asyncHttpStatistics.responseState = response.responseState;

				$.atmosphere.log('info', [ "response.state: " + response.state ]);
				$.atmosphere.log('info', [ "response.transport: " + response.transport ]);
				$.atmosphere.log('info', [ "response.responseBody: " + response.responseBody ]);

				if (response.state = "messageReceived") {

					var data = response.responseBody;

					if (data) {

						try {
							var result = $.parseJSON(data);

							var visible = $('#placeHolder').is(':visible');

							if (result.length > 0 && visible) {
								$("#placeHolder").fadeOut();
							}

							asyncHttpStatistics.numberOfTweets = asyncHttpStatistics.numberOfTweets + result.length;

							$("#template").tmpl(result).hide().prependTo("#twitterMessages").fadeIn();

						} catch (error) {
							asyncHttpStatistics.numberOfErrors++;
							console.log("An error ocurred: " + error);
						}
					} else {
						console.log("response.responseBody is null - ignoring.");
					}

					refresh();
				}
			}
		}
		
	});

	/* Attach page specific behavior on page load */
	$(function() {
		return new window[NS][SubClass]();
	});
}(window.jQuery, "WMC", "Base", "SearchPage"));
