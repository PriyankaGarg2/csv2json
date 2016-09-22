const readline=require('readline');
const fs=require('fs');
var country={};
var name=[];
var life=[];
var result=[];
var tempArray = [];
var header=1;
const rl=readline.createInterface({
	input:fs.createReadStream('Indicators.csv')
});
rl.on('line',(line)=>{
  if(header==1){
		var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var res=commaRemovedLine.split(",");
    for(var i=0;i<res.length;i++){
      if(res[i]=="CountryName"){
        cindex=i;
      }
      else if (res[i]=="IndicatorCode") {
          iindex=i;
      }
      else if (res[i]=="Value") {
          vindex=i;
      }
    }
    header=0;
  }
  else {
    var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var res=commaRemovedLine.split(",");
    var countryName1=res[cindex];
    var indicatorCode1=res[iindex];
    var value1=res[vindex];
		countryName1=countryName1.replace(/"/g,'');
    if((tempArray.indexOf(countryName1)<0) &&(indicatorCode1=="SP.DYN.LE00.IN")){
			var obj={};
      tempArray.push(countryName1);
      obj["countryName"]=countryName1;
      if(!(indicatorCode1 in obj)) {
        obj[indicatorCode1] = 0;
      }
      obj[indicatorCode1] = parseFloat(obj[indicatorCode1]) + parseFloat(value1);
    }
		else if ((tempArray.indexOf(countryName1)>0) &&(indicatorCode1=="SP.DYN.LE00.IN")) {
			for(var i=0;i<result.length;i++){
				if(result[i].countryName==countryName1){
					if(!(indicatorCode1 in result[i])) {
						result[i][indicatorCode1] = 0;
					}
					result[i][indicatorCode1] = parseFloat(result[i][indicatorCode1]) + parseFloat(value1);
				}
			}
		}
		if(obj!=null){
      result.push(obj);
  	}
	}
});
rl.on('close',()=>{
	var y="SP.DYN.LE00.IN";
	result.sort(function(a,b){return b["SP.DYN.LE00.IN"]- a["SP.DYN.LE00.IN"]});
	result.splice(5,((result.length)-5));
  fs.writeFile('top5Result.json', JSON.stringify(result), (err) => {
  	if (err)
  	console.log(err);
	});
});
