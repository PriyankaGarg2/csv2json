const readline=require('readline');
const fs=require('fs');
var result=[];
var tempArray = [];
var header=1;
const rl=readline.createInterface({
	input:fs.createReadStream('Indicators.csv')
});
rl.on('line',(line)=>{
  if(header==1){
    header=0;
  }
  else {
    var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var res=commaRemovedLine.split(",");
    var countryName1=res[0];
		//countryName1=countryName1.replace(/"/g,'');
    var countryCode1=res[1];
    var indicatorName1=res[2];
    var indicatorCode1=res[3];
    var year1=res[4];
    var value1=res[5];
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
