
const hackerone_re = /hackerone\.com\/[a-zA-Z0-9_-]+\/policy_scopes/
const bugbounty_re = /bugcrowd\.com\/[a-zA-Z0-9_-]+/
const intigriti_re = /intigriti\.com\/programs\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/detail/


// 监听 background 发来的消息
chrome.runtime.onMessage.addListener(function (message, sender, callback) {

  if (message.type == "drawscope"){

      newscope = document.getElementById("newscope")

      if (newscope){
        /* 如果页面已经打开了,则会关闭窗口 */
        newscope.remove()
        callback("ok")
        return
      }

      /** 根据正则判断是哪个站点 */
      var url = location.href.split("?")[0];
      if (hackerone_re.test(url)){
            hackerone(showscopes);
      }
      else if (bugbounty_re.test(url)){
            bugcrowd(showscopes);
      }
      else if (intigriti_re.test(url)){
            intigriti(showscopes);
      } 

      callback("ok")
      return
  }

  callback("fail")
  return
});


function showscopes(inscopes,outscopes){
  // 显示窗口

  var inscopes_content =''
  var outscopes_content =''

  if (inscopes != undefined && inscopes != "" ){
    inscopes_content = "<div class='inline-block font-body text-base font-medium text-black dark:text-white' style='margin-bottom: 10px;'>In Scopes:</div>" +
                      inscopes + "</br></br>"
  }
  

  if (outscopes != undefined && outscopes != "" ){
    outscopes_content = "<div class='inline-block font-body text-base font-medium text-black dark:text-white' style='margin-bottom: 10px;'>Out Scopes:</div>" + 
                        outscopes 
  }                    

  const overlay = document.createElement('div');
  
  overlay.style.position = 'fixed'; 
  overlay .style.top ='20%';     
  overlay.style.minWidth = '300px';                   
  overlay.style.borderRadius = '5px';      
  overlay.style.right = '20px';                      
  overlay.style.background = '#FFF';       
  overlay.style.zIndex = 9999;  
  overlay.style.color = '#3e3e3e';
  
  const content = document.createElement('div');
  content.style.margin = '10%';
  content.innerHTML = inscopes_content + outscopes_content;
  
  overlay.appendChild(content);
  overlay.setAttribute("class","card")
  overlay.setAttribute("id","newscope")

  document.body.appendChild(overlay);


}


function hackerone(callback){
  // hackerone.com 

  var inscopes = []
  var outscopes = []

  target_dom = document.getElementsByClassName("spec-asset-identifier")

  for (var i = 0; i < target_dom.length; i++){
    dom = target_dom[i];

    var target = dom.innerText.toLowerCase();
    var stype = dom.parentNode.nextSibling.innerText.toLowerCase();
    var status = dom.parentNode.nextSibling.nextSibling.innerText.toLowerCase();

    // console.log(target + " --- " + stype + " ---- " + status)
  
    if ((stype.indexOf("domain")>-1 || stype.indexOf("other")>-1 || stype.indexOf("wildcard")>-1) && status.indexOf("in")> -1 ){
      inscopes.push(target)
      
    }else if((stype.indexOf("domain")>-1 || stype.indexOf("other")>-1 || stype.indexOf("wildcard")>-1) && status.indexOf("out")> -1 ){
      outscopes.push(target)
    }
  
  }

  inscopes_content = inscopes.length>0 ? "</br>" + inscopes.join("</br>") : ''

  outscopes_content = outscopes.length>0 ? "</br>" + outscopes.join("</br>"):''

  callback(inscopes_content,outscopes_content )
}



function bugcrowd(callback){
  // bugcrowd.com 

  var inscopes = []
  var outscopes = []

 

  inscopes_dom = document.querySelectorAll("#user-guides__bounty-brief__in-scope")
  outscopes_dom = document.querySelectorAll("#user-guides__bounty-brief__out-of-scope")
  
  
  // in scopes
  for (var i = 0; i < inscopes_dom.length; i++){
    
    dom = inscopes_dom[i].nextSibling;

    targets_dom = dom.querySelectorAll(".cc-rewards-link-table__endpoint")

    for(var i = 0; i < targets_dom.length; i++){
    
      target_dom = targets_dom[i];

      var target = target_dom.innerText.toLowerCase();
      var stype = target_dom.parentNode.getAttribute("data-tip")
    
      // console.log(target + " --- " + stype)
    
      if (stype.indexOf("url")>-1 || stype.indexOf("website")>-1 || stype.indexOf("api")>-1){
        inscopes.push(target)
      }
    }
  
  }


  // out scopes
  for (var i = 0; i < outscopes_dom.length; i++){
    
    dom = outscopes_dom[i].nextSibling;

    targets_dom = dom.querySelectorAll(".cc-rewards-link-table__endpoint")

    for (var i = 0; i < targets_dom.length; i++){
    
     	 target_dom = targets_dom[i];


	    var target = target_dom.innerText.toLowerCase();
	    var stype = target_dom.parentNode.getAttribute("data-tip")
	   
	    console.log(target + " --- " + stype)
	  
	    if (stype.indexOf("url")>-1 || stype.indexOf("website")>-1 || stype.indexOf("api")>-1){
	      outscopes.push(target)
	    }
	}

  }

 
 
  inscopes_content = inscopes.join("</br>")

  outscopes_content = outscopes.join("</br>")


  callback(inscopes_content,outscopes_content)

}

function intigriti(callback){
  // intigriti.com
  var inscopes = []
  var outscopes = []

  target_dom = document.getElementsByClassName("domainSpecification")


  for (var i = 0; i < target_dom.length; i++){
    
    dom = target_dom[i];

    var target = dom.querySelector('.reference').innerText.toLowerCase();
    var stype = dom.nextSibling.innerText.toLowerCase();
    // var status = dom.parentNode.nextSibling.nextSibling.innerText.toLowerCase();

    // console.log(target + " --- " + stype)
  
    if (stype.indexOf("url")>-1 || stype.indexOf("website")>-1 || stype.indexOf("api")>-1){
      inscopes.push(target)
      
    // }else if((stype.indexOf("domain")>-1 || stype.indexOf("other")>-1 || stype.indexOf("wildcard")>-1) && status.indexOf("out")> -1 ){
      // outscopes.push(target)
    }
  
  }
 
  inscopes_content = inscopes.join("</br>")

  outscopes_content = outscopes.join("</br>")

  callback(inscopes_content,outscopes_content)
  
}

