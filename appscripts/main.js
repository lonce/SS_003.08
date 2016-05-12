require(
    [],  

    function () {

        console.log("Yo, I am alive!");
          // The svg namespace
        var static_xmlns = "http://www.w3.org/2000/svg";

        // Grab the div where we will put our Raphael paper
        var paperDiv = document.getElementById("centerDiv");
        console.log("dive is " + paperDiv.clientWidth + " by " + paperDiv.clientHeight);
        var paper = document.getElementById("paperID");
        paper.setAttributeNS(null, "width", .9*paperDiv.clientWidth);
        paper.setAttributeNS(null, "height", .9*paperDiv.clientHeight);
        // put the width and heigth of the canvas into variables for our own convenience
        var pWidth = paperDiv.clientWidth; // parseInt(paper.offsetWidth);
        var pHeight = paperDiv.clientHeight;//parseInt(paper.offsetHeight);
        console.log("pWidth is " + pWidth + ", and pHeight is " + pHeight);

        window.onresize = function(event) { 
          paper.setAttributeNS(null, "width", .9*paperDiv.clientWidth);
          paper.setAttributeNS(null, "height", .9*paperDiv.clientHeight);
          pWidth = paperDiv.clientWidth;
          pHeight = paperDiv.clientHeight;
        };

        var makeCircle = function(cx, cy, r, color){
          var shape = document.createElementNS(static_xmlns, "circle");
          shape.setAttributeNS(null, "cx", cx);
          shape.setAttributeNS(null, "cy", cy);
          shape.setAttributeNS(null, "r",  r);
          shape.setAttributeNS(null, "fill", color || "none"); 
          shape.setAttributeNS(null, "stroke", "black"); 
          return shape;
        }

        var maxCircleSizeSlider = document.getElementById("maxCircleSize");
        var maxCircleSize=maxCircleSizeSlider.value;
         maxCircleSizeSlider.addEventListener("change", function(){
          maxCircleSize=this.value;
          clearPaper();
          makeDots();
        });
        


        var randInt = function(m,n){
            return m+Math.floor((n-m)*Math.random());
        }
        var randFloat = function(m,n){
            return m+(n-m)*Math.random();
        }
        // A dot for us to play with
        var numDots=10;
        var dot=[];
        var makeDots = function(){
          for (var i=0;i<numDots;i++){
                dot[i] = makeCircle(0, 0, randInt(15, maxCircleSize));
                //console.log("setting radius of dot to "+ dot[i].attr('r'));
                dot[i].xpos=randInt(0,pWidth);
                dot[i].ypos=randInt(0,pHeight);
                dot[i].xrate=randFloat(-1,1);
                dot[i].yrate=randFloat(-1,1);
                alert('test');
                paper.appendChild(dot[i]);
            }
        }

        var clearPaper=function(){
          for (var i=0;i<numDots;i++){
            paper.removeChild(dot[i]);
          }
        }

        // There is only only one raphael path that represents all the lines!!!
        var path="";
        var line=document.createElementNS(static_xmlns,"path");  // there is only one line, and it is recontstruced from a bunch of Mxx Lxx segments for each render. 

        line.setAttributeNS(null, "stroke", "black"); 
        line.setAttributeNS(null, "stroke-width", 1);  
        line.setAttributeNS(null, "opacity", 1);  
        line.setAttributeNS(null, "fill", "none");

        paper.appendChild(line);  

        // our drawing routine, will use as a callback for the interval timer
        var draw = function(){

            for(var i=0; i<numDots;i++){
                // Update the position where we want our dot to be
                //console.log("dot["+i+"] pos is ["+dot[i].xpos + "," + dot[i].ypos + "]");

                dot[i].xpos += dot[i].xrate;
                dot[i].ypos += dot[i].yrate;

                // Now actually move the dot[i] using our 'state' variables
                dot[i].setAttributeNS(null, "cx", dot[i].xpos);
                dot[i].setAttributeNS(null, "cy", dot[i].ypos);
                renderLines();


                //console.log("attribute is " + dot[i].r.baseVal.value);
                if (dot[i].xpos > pWidth+dot[i].r.baseVal.value)  {
                  dot[i].xpos =  -1*dot[i].r.baseVal.value;
                };
                if (dot[i].ypos > pHeight+dot[i].r.baseVal.value) {
                  dot[i].ypos =  -1*dot[i].r.baseVal.value;
                };
                if (dot[i].xpos < -dot[i].r.baseVal.value) {
                  dot[i].xpos =  pWidth+dot[i].r.baseVal.value;
                };
                if (dot[i].ypos < -dot[i].r.baseVal.value) {
                  dot[i].ypos =  pHeight+dot[i].r.baseVal.value;
                };
                
            }
        }

var renderLines=function(){
  path = "";
  var leng = dot.length;
  for (var i = 0; i<leng; i++){
    for (var j = i + 1; j<leng; j++){
      circleIntersection(dot[i], dot[j]);
    }
  }
}

//Sweet!::
// From: http://zreference.com/circle-intersections-w-raphael/
// easy to understand explanation here:
// http://paulbourke.net/geometry/2circle/
var circleIntersection = (function(){
  // private variables created once only
    var h, cx, cy, px, py;
    var ax;
    var ay;
    var bx;
    var by;
    var ra;
    var rb;
   
    var dx;
    var dy;
   
    var d;

    var tx;
    var ty;

    // This is the "real" circleIntersection function
    return function(a, b) {
    ax = a.cx.baseVal.value;
    ay = a.cy.baseVal.value;
    bx = b.cx.baseVal.value;
    by = b.cy.baseVal.value;
    ra = a.r.baseVal.value;
    rb = b.r.baseVal.value;
   
    dx = Math.abs(ax - bx);
    dy = Math.abs(ay - by);
   
    d = Math.sqrt(dx * dx + dy * dy);
   
    //if (true){
    if (d > (ra + rb)) {
      // no solutions
    } else if (d < Math.abs(ra - rb)) {
      // no collisions, one inside other
    } else if (d == 0 && ra == rb) {
      // circles are coincident   
    } else {
      // there is a collision
      a = (ra * ra - rb * rb + d * d) / (2 * d);
      h = Math.sqrt(ra * ra - a * a);
      cx = ax + a * (bx - ax) / d;
      cy = ay + a * (by - ay) / d;
   
      // point c (draw here)
   
      tx = h * (by - ay) / d;
      ty = h * (bx - ax) / d;
      px = cx + tx;
      py = cy - ty;
   
      //var ln = {a:{x:px, y:py}};
   
      path += "M " + px + " " + py + " ";
   
      px = cx - tx;
      py = cy + ty;
   
      //ln.b = {x:px, y:py};
   
      path += "L " + px + " " + py + " ";
   
      //line.attr({path: path});
      line.setAttributeNS(null, "d", path);

    }
  }
})();

  makeDots();
  // call draw() periodically
  setInterval(draw, 40);

});