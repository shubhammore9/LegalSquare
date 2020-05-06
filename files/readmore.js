function readm(){
	var dots=document.getElementById("dots");
	var rm  =document.getElementById("rm");
	var btn =document.getElementById("btn");

	if(dots.style.display === "none"){
		dots.style.display="inline";
		 btn.innerHTML = "Read more";
    	rm.style.display = "none";
	}
	else {
    	dots.style.display = "none";
    	btn.innerHTML = "Read less";
    	rm.style.display = "inline";
  }
}

function readm2(){
	var dots=document.getElementById("dots2");
	var rm  =document.getElementById("rm2");
	var btn =document.getElementById("btn2");

	if(dots.style.display === "none"){
		dots.style.display="inline";
		 btn.innerHTML = "Read more";
    	rm.style.display = "none";
	}
	else {
    	dots.style.display = "none";
    	btn.innerHTML = "Read less";
    	rm.style.display = "inline";
  }
}

function readm3(){
	var dots= document.getElementById("dots3");
	var rm= document.getElementById("rm3");
	var btn=document.getElementById("btn3");

	if(dots.style.display === "none")
	{
		dots.style.display="inline";
		btn.innerHTML="Read More";
		rm.style.display="none";
	}
	else{
		dots.style.display="none";
		btn.innerHTML="Read Less";
		rm.style.display="inline";
			}
}