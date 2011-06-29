//firebrowse


/*
 *
 *	jQuery Timer plugin v0.1
 *		Matt Schmidt [http://www.mattptr.net]
 *
 *	Licensed under the BSD License:
 *		http://mattptr.net/license/license.txt
 *
 */

 jQuery.timer = function (interval, callback)
 {
 /**
  *
  * timer() provides a cleaner way to handle intervals  
  *
  *	@usage
  * $.timer(interval, callback);
  *
  *
  * @example
  * $.timer(1000, function (timer) {
  * 	alert("hello");
  * 	timer.stop();
  * });
  * @desc Show an alert box after 1 second and stop
  * 
  * @example
  * var second = false;
  *	$.timer(1000, function (timer) {
  *		if (!second) {
  *			alert('First time!');
  *			second = true;
  *			timer.reset(3000);
  *		}
  *		else {
  *			alert('Second time');
  *			timer.stop();
  *		}
  *	});
  * @desc Show an alert box after 1 second and show another after 3 seconds
  *
  * 
  */

	var interval = interval || 100;

	if (!callback)
		return false;

	_timer = function (interval, callback) {
		this.stop = function () {
			clearInterval(self.id);
		};

		this.internalCallback = function () {
			callback(self);
		};

		this.reset = function (val) {
			if (self.id)
				clearInterval(self.id);

			var val = val || 100;
			this.id = setInterval(this.internalCallback, val);
		};

		this.interval = interval;
		this.id = setInterval(this.internalCallback, this.interval);

		var self = this;
	};

	return new _timer(interval, callback);
 };


$(document).ready(function() {

	
	var thisFB = new firebrowse();
	thisFB.init();
	
});

var firebrowse;

firebrowse = function() {
	this.svg = null;
	this.xy = null;
	
	this.POLL_INTERVAL = 10000;
	this.FIRST_POLL = false;
	this.MAIN_TIMER = null;
	this.POLL_LOCK = false;
	
	this.LAST_CREATED_AT = null;
	
 }

//var svg = null
//var xy = null;

firebrowse.prototype.init = function() {
	
	console.log('init');
	
	var that = this;
	
	this.pollData();
	
	this.drawMap();
	
	$('body').click(function(e) {
		e.stopPropagation();
		
		if (!that.POLL_LOCK) {
			$('#msg').html($('#msg').html()+'stopped<br>');
			that.POLL_LOCK = true;
			that.stopMainTimer();
		} else {
			$('#msg').html($('#msg').html()+'started<br>');
			that.POLL_LOCK = false;
			that.startMainTimer();
		}
		
	})
	
}

firebrowse.prototype.pollData = function() {
	
	var that = this;
	
	if (!this.POLL_LOCK) {
		
		console.log('polling');
		
		$.ajax({
		  url: "/c/pusher.py",
		  success: function(data){
		    that.gotData(data);
		  }, 
		  error: function(data, error) {
				console.log('data error: '+error);
				console.log(data);
			}
		});
	} else {
		console.log('skipping');
	}
}


firebrowse.prototype.getReply = function(thisId) {
		
		var that = this;
		
		$.ajax({
		  url: "/c/id.py?tweetid="+thisId,
		  success: function(data){
		    that.gotReply(data);
		  }, 
		  error: function(data, error) {
				console.log('reply error: '+error);
				console.log(data);
			}
		});

}

firebrowse.prototype.startMainTimer = function() {

	var that = this;
	this.MAIN_TIMER = $.timer(this.POLL_INTERVAL, function() {
		that.pollData();
	});

}

firebrowse.prototype.stopMainTimer = function() {

	var that = this;
	this.MAIN_TIMER.stop();

}


firebrowse.prototype.gotReply = function(data) {

	console.log('** reply **');
	console.log(data);
	
	this.showReply(data);
	
	

}

firebrowse.prototype.gotData = function(data) {

	var that = this;

	//console.log(data)
	
	if (!this.FIRST_POLL) {
		this.FIRST_POLL = true;
		
		this.startMainTimer();
	
	}
	
	
	
	if (data && data.length > 0) {
		
		var helper = function(i) {
			return function(e) {
				e.stop();
				//console.log(i);
				that.showTweet(i);
			}
		}
		
		for (var i = 0; i<data.length; i++) {

			//that.showTweet(data[i]);
			//console.log(data[i])
			
			$.timer(i*100, helper(data[i]));
						
		}
		
		console.log('last '+this.LAST_CREATED_AT);
	}

/*
	if (data.geo && data.geo.coordinates) {	
	
		d3.select("#states").append("svg:circle")
	      .attr("transform", function(d) { 
			return "translate(" +  that.xy([data.geo.coordinates[1], data.geo.coordinates[0]] ) + ")"; 
		})
		.attr("r", 0)
	      .transition()
		      .duration(1000)
		      .delay(function(d, i) { return i * 50; })
		      .attr("r", 100);	

		$('#msg').html('['+data.geo.coordinates[1]+', '+data.geo.coordinates[0]+']');
	} else {
		$('#msg').html('null');
	}
	*/

}

firebrowse.prototype.showReply = function(twit) {

	var that = this;
	
	console.log(twit)

	if (twit.geo && twit.geo.coordinates) {	

		d3.select("#states").append("svg:circle2")
	      .attr("transform", function(d) { 
			return "translate(" +  that.xy([twit.geo.coordinates[1], twit.geo.coordinates[0]] ) + ")"; 
		})
		.attr("r", 0)
	      .transition()
		      .duration(1000)
		      .delay(function(d, i) { return i * 50; })
		      .attr("r", 20);	

			//for (var j=0; j<10; j++) {
				$('#msg').html($('#msg').html()+'['+twit.geo.coordinates[1]+', '+twit.geo.coordinates[0]+']<br>');
				//$("#msg").css({ scrollTop: $("#msg").attr("scrollHeight") });
			//}
					
			
	} else {

		console.log(twit);

		$('#msg').html($('#msg').html()+'null<br>');
	}


}

firebrowse.prototype.showTweet = function(twit) {
	
		var that = this;
		
		
		//var thisMilliseconds = null;
		//var thisTweetIsADuplicate = false;
		
		//if (twit.created_at) {
			
		//	thisMilliseconds = Date.parse(twit.created_at);
						
		//		if (thisMilliseconds < this.LAST_CREATED_AT) {
		//			thisTweetIsADuplicate = true;
		//		}
		
		//	if (this.LAST_CREATED_AT == null || thisMilliseconds > this.LAST_CREATED_AT) {
		//		this.LAST_CREATED_AT = thisMilliseconds;
		//	}
			
		
			
		//}
	
		//if (!thisTweetIsADuplicate) {
	
				if (twit.geo && twit.geo.coordinates) {	
					
					var thisRadius = this.getRadius(twit.user.followers_count);

					d3.select("#states").append("svg:circle")
				      .attr("transform", function(d) { 
						return "translate(" +  that.xy([twit.geo.coordinates[1], twit.geo.coordinates[0]] ) + ")"; 
					})
					.attr("r", 0)
				      .transition()
					      .duration(1000)
					      .delay(function(d, i) { return i * 50; })
					      .attr("r", thisRadius);	

						//for (var j=0; j<10; j++) {
							$('#msg').html($('#msg').html()+'['+twit.geo.coordinates[1]+', '+twit.geo.coordinates[0]+']<br>');
							//$("#msg").css({ scrollTop: $("#msg").attr("scrollHeight") });
						//}
						
					//if (twit.in_reply_to_status_id_str != null) {
					//	that.getReply(twit.in_reply_to_status_id_str);
					//}		
						
				} else {
			
					console.log(twit);
			
					//var d = new Date(twit.created_at);
					//console.log(d);
			
					//console.log(Date.parse(twit.created_at));
			
			
					$('#msg').html($('#msg').html()+'bust<br>');
				}
		//} else {
		//	console.log('** skipping dupe **');
		//}
}

firebrowse.prototype.getRadius = function(followers) {

	var radius = 5;
	
	if (followers > 100 && followers < 300) {
		radius = 10;
	} else if (followers > 300 && followers < 1000) {
		radius = 15;
	} else if (followers > 1000 && followers < 10000) {
		radius = 20;
	} else if (followers < 10000) {
		radius = 25;
	}

	return radius;

}

firebrowse.prototype.drawMap = function() {

	var that = this;

	// Our projection.
	that.xy = d3.geo.albers(),
	    path = d3.geo.path().projection(that.xy);

	that.svg = d3.select("body").append("svg:svg");
	that.svg.append("svg:g").attr("id", "states");

    that.xy.parallels([66.8, 90]).scale(1150).translate([462,290]);

	d3.json("data/us-states.json", function(collection) {
	  d3.select("#states")
	    .selectAll("path")
	      .data(collection.features)
	    .enter().append("svg:path")
	      .attr("d", d3.geo.path().projection(that.xy));
	});
	
	
}
