// 后台脚本


// 监听事件
chrome.commands.onCommand.addListener(async (command)=>{

  if (command ==="drawScope") {

    // background主动给content-scripts发消息
    // {active: true, currentWindow: true} 表示查找当前屏幕下的active状态的tab;
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {'type':'drawscope'}, (res) => {
        
          console.log(res)
      });
    }); 
  }
});



