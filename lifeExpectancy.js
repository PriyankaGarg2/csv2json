const readline=require('readline');
const fs=require('fs');
var result=[];
var header=1;
var cindex,iindex,vindex;
var arr=["Arab World","Afghanistan","Armenia","Azerbaijan","Bahrain","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Cyprus","Egypt Arab Rep.","India","Indonesia","Iran Islamic Rep.","Iraq","Israel","Japan","Jordan","Kazakhstan","Korea Dem. Rep.","Korea Rep.","Kuwait","Kyrgyz Republic","Lao PDR","Lebanon","Malaysia","Maldives","Mongolia","Myanmar","Nepal","Oman","Pakistan","Philippines","Qatar","Saudi Arabia","Singapore","Sri Lanka","Syrian Arab Republic","Tajikistan","Thailand","Timor-Leste","Turkmenistan","United Arab Emirates","Uzbekistan","Vietnam","Yemen Rep."];
var tempArray = [];
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
  else{
		var commaRemovedLine = line.replace(/"[^"]+"/g, function (match) {return match.replace(/,/g, '');});
    var res=commaRemovedLine.split(",");
    var countryName1=res[cindex];
    var indicatorCode1=res[iindex];
    var value1=res[vindex];
		countryName1=countryName1.replace(/"/g,'');
  	if(tempArray.indexOf(countryName1)<0 && arr.indexOf(countryName1) >=0 &&(indicatorCode1=="SP.DYN.LE00.FE.IN"||indicatorCode1=="SP.DYN.LE00.MA.IN")){
				var obj={};
				tempArray.push(countryName1);
				obj["countryName"]=countryName1;
				if(!(indicatorCode1 in obj)) {
						obj[indicatorCode1] = 0;
				}
				obj[indicatorCode1] = parseFloat(obj[indicatorCode1]) + parseFloat(value1);
				if(obj!=null){
					result.push(obj);
				}
			}
			else if(tempArray.indexOf(countryName1)>=0 && arr.indexOf(countryName1) >=0 &&(indicatorCode1=="SP.DYN.LE00.FE.IN"||indicatorCode1=="SP.DYN.LE00.MA.IN")){
				for(var i=0;i<result.length;i++){
					if(result[i].countryName==countryName1){
						if(!(indicatorCode1 in result[i])) {
							result[i][indicatorCode1] = 0;
						}
						result[i][indicatorCode1] = parseFloat(result[i][indicatorCode1]) + parseFloat(value1);
					}
				}
			}
		}
});
rl.on('close',()=>{
  fs.writeFile('lifeExpectancyResult.json', JSON.stringify(result), (err) => {
  	if (err)
  	console.log(err);
	});
});
