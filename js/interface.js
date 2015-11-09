	var fingerlings = {};
	var handies = {};
	var loop = {};
	var controller = {};

	var info, stats, renderer, scene, camera, controls;
	var actions, ex;
	var numAdded = 0;
	var numRemoved = 0;
	var numMoved = 0;

	init();

	function init() {

		document.body.style.cssText = 'font: 600 12pt monospace; margin: 0; overflow: hidden;' ;

		var info = document.body.appendChild( document.createElement( 'div' ) );

		info.style.cssText = 'left: 20px; position: absolute; ';
		info.innerHTML =
			'<div id=handData ></div>' +
			'<div id=fingerData ></div>' +
			'<div id=actionData ></div>' +
			'<div id=exData ></div>'
		'';
		actions = actionData.appendChild( document.createElement( 'div' ) );
		ex = exData.appendChild( document.createElement( 'div' ));

		stats = new Stats();
		stats.domElement.style.cssText = 'position: absolute; right: 0; top: 50; z-index: 100; ';
		document.body.appendChild( stats.domElement );

		renderer = new THREE.WebGLRenderer( { alpha: 1, antialias: true, clearColor: 0xffffff }  );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );

		camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
		// camera = new THREE.OrthographicCamera(-250, 250, 250, -250, 1, 5000);
		camera.position.set( 0, 500, 500 );

		controls = new THREE.TrackballControls( camera, renderer.domElement );

		scene = new THREE.Scene();

// ground box
		// var geometry = new THREE.BoxGeometry( 500, 2, 500 );
		// material = new THREE.MeshNormalMaterial();
		// var mesh = new THREE.Mesh( geometry, material );
		// mesh.position.set( 0, -1, 0 );
		// scene.add( mesh );

		// mesh = new THREE.GridHelper( 250, 10 );
		// scene.add( mesh );

// axes
		// var axis = new THREE.AxisHelper( 250 );
		// scene.add( axis );

		renderer.render( scene, camera );

		ex.innerHTML = 'Add 10 boxes!';
	}

	function getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	}

	loop.animate = function( frame ) {

		frame.hands.forEach( function( hand, index ) {

			var handy = ( handies[index] || ( handies[index] = new Handy()) );    
			handy.outputData( index, hand );
			var pos = (hand.indexFinger).stabilizedTipPosition;
			var x = (pos[0]+300)*2;
			var y = 600-pos[1]*2;
			var cursors = $(".cursor");
			for (var i = 0; i < cursors.length; i++) {
				var cursor = $(cursors[i]);
				cursor.remove();
			}

			$("body").append("<div class=\"container\"><div class=\"cursor\" style=\"left:" + x.toFixed(0) + "px;top:" + y.toFixed(0) + "px;\"></div></div>");			

			hand.fingers.forEach( function( finger, index ) {

				var fingerling = ( fingerlings[index] || ( fingerlings[index] = new Fingerling() ) );  
				fingerling.outputData( index, finger );

			});

		});

		// renderer.render( scene, camera );
		controls.update();
		stats.update();

	}

	loop = Leap.loop( loop.animate );
	loop.use( 'screenPosition', { scale: 0.10 } ); // use = plugin
	controller = Leap.loop({enableGestures: true}, function(frame){
  if(frame.valid && frame.gestures.length > 0){
	frame.gestures.forEach(function(gesture){
		switch (gesture.type){
		  case "keyTap":
				var handIds = gesture.handIds;
				handIds.forEach(function(handId) {
					var hand = frame.hand(handId);
					if (typeof(hand) !== 'undefined' && typeof(hand.indexFinger) !== 'undefined' && typeof(gesture) !== 'undefined') {
						// var pos = (hand.indexFinger).screenPosition();
						var pos = (hand.indexFinger).stabilizedTipPosition;
						var x = (pos[0]+300)*2;
						var y = 600-pos[1]*2;
						var sB = $("#addSquare");
						var sp = sB.position();
						var sl = sp.left;
						var sw = sB.width();
						var st = sp.top;
						var sh = sB.height();
						var cB = $("#addCircle");
						var cp = cB.position();
						var cl = cp.left;
						var cw = cB.width();
						var ct = cp.top;
						var ch = cB.height();
						if (hand.data('pickedup') === 1) {
							var box = hand.holding();
							hand.data({pickedup: 0});
							console.log("drop");
							box.css("border", "none");
							box.animate({
								left: x.toFixed(0),
								top: y.toFixed(0)
							});
						} else if (x.toFixed(0) > sl-100 && x.toFixed(0) < sl+sw+100 && y.toFixed(0) > st-100 && y.toFixed(0) < st+sh+100) {
							$("body").append("<div class=\"container\"><div class=\"box square\" style=\"background-color:" + getRandomColor() + "; left:" + Math.floor(Math.random() * 800 + 100) + "px; top:" + Math.floor(Math.random() * 400 + 50) + "px;\"></div></div>");
							$(".box").draggable();
							numAdded++;
							if (numAdded == 10) {
							}
						} else if (x.toFixed(0) > cl-100 && x.toFixed(0) < cl+cw+100 && y.toFixed(0) > ct-100 && y.toFixed(0) < ct+ch+100) {
							$("body").append("<div class=\"container\"><div class=\"box circle\" style=\"background-color:" + getRandomColor() + "; left:" + Math.floor(Math.random() * 800 + 100) + "px; top:" + Math.floor(Math.random() * 400 + 50) + "px;\"></div></div>");
							$(".box").draggable();
							numAdded++;
							if (numAdded == 10) {
								
							}
						} else {
							var boxes = $('.box');
							for (var i = 0; i < boxes.length; i++) {
								var box = $(boxes[i]);
								var posistion = box.position();
								var l = posistion.left;
								var w = box.width();
								var t = posistion.top;
								var h = box.height();
								if (x.toFixed(0) > l-100 && x.toFixed(0) < l+w+100 && y.toFixed(0) > t-100 && y.toFixed(0) < t+h+100) {
									console.log('x: ' + x.toFixed(0) + ' y: ' + y.toFixed(0));
									console.log('box: ' + l + ' ' + w + ' ' + t + ' ' + h);
									box.css("border", "5px solid red");
									hand.data({pickedup: 1});
									hand.hold(box);
									console.log("picked up " + x.toFixed(0) + " " + y.toFixed(1));
									break;
								}
							}
						}
						actions.innerHTML = 'You just tapped at position (' + x.toFixed(0) + ', ' + y.toFixed(0) + ').';
						var clicks = $(".clicked");
						for (var i = 0; i < clicks.length; i++) {
							var click = $(clicks[i]);
							click.remove();
						}
						$("body").append("<div class=\"container\"><div class=\"clicked\" style=\"left:" + x.toFixed(0) + "px;top:" + y.toFixed(0) + "px;background-color:red;\"></div></div>");
						// console.log("KEYTAP");
					}
				});
			break;
		  case "swipe":
				var handIds = gesture.handIds;
				handIds.forEach(function(handId) {
					var hand = frame.hand(handId);
					if (typeof(hand) !== 'undefined' && typeof(hand.indexFinger) !== 'undefined' && typeof(gesture) != 'undefined' /*&& gesture.duration > 20000*/) {
						// var pos = (hand.indexFinger).screenPosition();
						var pos = (hand.indexFinger).stabilizedTipPosition;
						// var pos = gesture.position;
						var x = (pos[0]+300)*2;
						var y = 600-pos[1]*2;
						var boxes = $(".box");
						for (var i = 0; i < boxes.length; i++) {
							var box = $(boxes[i]);
							var posistion = box.position();
							var l = posistion.left;
							var w = box.width();
							var t = posistion.top;
							var h = box.height();
							if (x.toFixed(0) > l-100 && x.toFixed(0) < l+w+100) {
								if (y.toFixed(0) > t-100 && y.toFixed(0) < t+h+100) {
									console.log('x: ' + x.toFixed(0) + ' y: ' + y.toFixed(0));
									console.log('box: ' + l + ' ' + w + ' ' + t + ' ' + h);
									box.remove();
									console.log("delete");
									break;
								}
							}
						}
						var clicks = $(".clicked");
						for (var i = 0; i < clicks.length; i++) {
							var click = $(clicks[i]);
							click.remove();
						}
						$("body").append("<div class=\"container\"><div class=\"clicked\" style=\"left:" + x.toFixed(0) + "px;top:" + y.toFixed(0) + "px;background-color:green;\"></div></div>");
						actions.innerHTML = 'You just swiped at position (' + x.toFixed(0) + ', ' + y.toFixed(0) + ').';
						// console.log("SWIPE" + "<div class=\"container\"><div class=\"clicked\" style=\"left:" + x.toFixed(0) + "px;top:" + y.toFixed(0) + "px;\"></div></div>");
					}
					// console.log(x.toFixed(0) + " " + y.toFixed(0));
				});
			break;
		} // switch
	}); // foreach
  } // if
}); // loop
	controller.use( 'screenPosition', { scale : 0.10} );
	controller.use( 'handHold');

	var Handy = function() {
		var handy = this;
		var msg = handData.appendChild( document.createElement( 'div' ) );

		var geometry = new THREE.BoxGeometry( 50, 20, 50 );
		var material = new THREE.MeshNormalMaterial();
		var box = new THREE.Mesh( geometry, material );
		scene.add( box );

		handy.outputData = function( index, hand  ) {

			// msg.innerHTML = 'Hand id:' + index + ' x:' + hand.stabilizedPalmPosition[0].toFixed(0) + 
			// 	' y:' + hand.stabilizedPalmPosition[1].toFixed(0) + ' z:' + hand.stabilizedPalmPosition[2].toFixed(0);

			box.position.set( hand.stabilizedPalmPosition[0], hand.stabilizedPalmPosition[1], hand.stabilizedPalmPosition[2] );

			box.rotation.set( hand.pitch(), -hand.yaw(), hand.roll() );

		};

	};

// Finger Method
	var Fingerling = function() {

		var fingerling = this;
		var msg = fingerData.appendChild( document.createElement( 'div' ) );

		var tip = addPhalange();
		var dip = addPhalange();
		var pip = addPhalange();
		var mcp = addPhalange();
		var carp = addPhalange();

		fingerling.outputData = function( index, finger ) {

			msg.innerHTML = 'Finger Method: ' +
				'finger id:' + index + ' tip x:' + finger.tipPosition[0].toFixed(0) + 
				' y:' + finger.tipPosition[1].toFixed(0) + ' z:' + finger.tipPosition[2].toFixed(0);

			tip.position.set( finger.tipPosition[0], finger.tipPosition[1], finger.tipPosition[2] );
			dip.position.set( finger.dipPosition[0], finger.dipPosition[1], finger.dipPosition[2] );
			pip.position.set( finger.pipPosition[0], finger.pipPosition[1], finger.pipPosition[2] );
			mcp.position.set( finger.mcpPosition[0], finger.mcpPosition[1], finger.mcpPosition[2] );
			carp.position.set( finger.carpPosition[0], finger.carpPosition[1], finger.carpPosition[2] );

			updatePhalange( tip, dip );
			updatePhalange( dip, pip );
			updatePhalange( pip, mcp );

			if ( finger.type > 0 ) {

				updatePhalange( mcp, carp );

			}

		};

	};

// Bone Method
	var Fingerling = function() {

		var fingerling = this;
		var msg = fingerData.appendChild( document.createElement( 'div' ) );

		var phalanges = [];

		for (var i = 0; i < 4; i++) {
			phalange = addPhalange();
			phalanges.push( phalange )
		}

		fingerling.outputData = function( index, finger ) {

			// msg.innerHTML = 'Bone Method ~ ' +
			// 	'finger tip: ' + index + ' x:' + finger.tipPosition[0].toFixed(0) + 
			// 	' y:' + finger.tipPosition[1].toFixed(0) + ' z:' + finger.tipPosition[2].toFixed(0);

//console.log( finger );

			for (var i = 0; i < 4; i++) {
				bone = finger.bones[ i ];
				cen = bone.center();
				len = bone.length;

				phalange = phalanges[ i ];
				phalange.position.set( cen[0], cen[1], cen[2] );
				if ( index > 0 || i > 0 ) {
					phalange.scale.z = len;
				}
			}

// Eventually will look at using bone.basis XYZ-axis data; Will it produce more concise code?
  
			phalanges[3].lookAt( v( finger.tipPosition[0], finger.tipPosition[1], finger.tipPosition[2]  ) );
			phalanges[2].lookAt( v( finger.dipPosition[0], finger.dipPosition[1], finger.dipPosition[2]  ) );
			phalanges[1].lookAt( v( finger.pipPosition[0], finger.pipPosition[1], finger.pipPosition[2]  ) );
			if ( index > 0 ) {
				phalanges[0].lookAt( v( finger.mcpPosition[0], finger.mcpPosition[1], finger.mcpPosition[2]  ) );
			}

		};

	};

	function addPhalange() {

		geometry = new THREE.BoxGeometry( 20, 20, 1 );
		material = new THREE.MeshNormalMaterial();
		phalange = new THREE.Mesh( geometry, material );
		scene.add( phalange );
		return phalange;

	}

	function updatePhalange( phalange, nextPhalange ) {

			phalange.lookAt( nextPhalange.position );
			length = phalange.position.distanceTo( nextPhalange.position );
			phalange.translateZ( 0.5 * length );
			phalange.scale.set( 1, 1, length );

	}

	function v(  x, y, z){ return new THREE.Vector3( x, y, z ); }

// This allows us to move the cat even while in an iFrame.
	Leap.loopController.setBackground(true)