/*
This script is developed by Jeroen Geradts is licensed under the Creative Commons Attribution 4.0 International License.
It contains a library with functions that convert date and time among several formats.

Input. This script accepts these inputs:

- Dutch date and time string (DD-MM-YYYY hh:mm:ss)
- Excel date (serial number between 1 and 2958101.99999)
- ISO 8601 short (YYYYMMDD)
- JS primitive value of a date object

Functions. You can sent the input to one of these functions:

- $date(input)
- $dateFromDutchDateAndTimeString(input)
- $dateFromExcelSerialNumber(excel)
- $dateFromISO8601Short(input)
- $dateFromJS(input)

$date() is a general function that will analyse the input and invoke the most likely of the other functions to do the conversion.
If you only have JS primitive values as input, use $dateFromJS() instead. 

Output. All functions deliver an array with these values:

- year (YYYY)
- JS primitive value of date and time (milisenconds)
- JS primitive value of 1st of the month (miliseconds)
- ISO 8601 short value for date (YYYYMMDD)
- excel serial number

Examples:

- $date("02-02-2000 12:00:00") = [2000,949489200000,949359600000,20000202,36558.5]
- $date(949489200000) = [2000,949489200000,949359600000,20000202,36558.5]
- $date(949359600000) = [2000,949359600000,949359600000,20000201,36557]
- $date(20000202) = [2000,949446000000,949359600000,20000202,36558]

Attention:

- 1900-02-29: Non existing date in Excel (Excel serial number 60)
- 1916-04-30: JS-values are 600 sec off after 23:40 (around Excel number 5965)
- 1916-05-01: JS-values are 600 sec off before 01:00 (around Excel number 5966)
- 1937-06-30: JS-values are 28 sec off after 22:50 (around Excel number 13696)
- 1937-07-01: JS-values are 28 sec off before 0:00 (around Excel number 13697)
- 1940-05-15: JS-values are 6000 sec off after 23:40 (around Excel number 14746)
- 1940-05-16: JS-values are 6000 sec before 01:40 (around Excel number 14747)
- 1970-01-01: JS-values between 01:00:00 and 01:49:18 are treated as Excel serial numbers in $date()
- 1970-01-01: JS-values after 03:46:00 are treated as ISO 8601 short numbers in $date()

These exceptions are the result of differences between the Excel, ISO 8601 and JS-date systems. 
And because Excel does not account for time corrections in 1916, 1937 and 1940.
The script corrects Excel serial numbers before 61.
*/

function $date(input){
	if (typeof(input) == 'string') return $dateFromDutchDateAndTimeString(input);
	else if (input >= 1 && input <= 2958101.99999) return $dateFromExcelSerialNumber(input);//JS-values between 1970-01-01 01:00:00 and 1970-01-01 01:49:18 are treated as Excel serial numbers
	else if (input >= 10000101 && input <= 99991231) return $dateFromISO8601Short(input);//JS values between 1970-01-01 03:46 and 1970-02-01 04:46 are treated as ISO 8601 short dates
	else return $dateFromJS(input);
}

function $dateFromDutchDateAndTimeString(input){//Validated for input DD-MM-YYYY hh:mm or DD-MM-YYYY hh:mm:ss
	var array = input.split(/-|:| /g);
	var YY = Number(array[2]);
	var MM = Number(array[1]) - 1;//switch day and month in Dutch date string (e.g. 08-11-2017 to 11-08-2017 for November 8th, 2017)
	var DD = Number(array[0]);
	var hh = Number(array[3]) + 1;
	var mm = Number(array[4]);
	var ss = (!array[5] == false)? Number(array[5]) : 0;
	var month = new Date(YY,MM,1,0,0,0,0);
	var date = new Date(YY,MM,DD,hh,mm,ss,0);
	var js = date.valueOf();
	js += $dateLocalTimeOffset(date) * 1000;
	date = new Date(js);
	var iso = $dateNumerical(date);
	var excel = $dateExcel(date);
	return [YY,date.valueOf(),month.valueOf(),iso,excel];
}

function $dateFromExcelSerialNumber(excel){//Some dates before 1940-05-17 have small bugs in Excel, see attention dates at introduction
	var input = excel;
	if (excel < 61) excel += 1;
	if (excel >= 61 && excel < 62 && input >= 60 && input < 61) input += 1;//corrections for Excel-bug (non-existing date February 29th, 1900), avoid Excel serial code 60
	var js = Math.floor((excel - 25569) * 86400000);
	js += $dateLocalTimeOffset(new Date(js)) * 1000;
	var date = new Date(js);
	var YY = date.getFullYear();
	var MM = date.getMonth();
	var month = new Date(YY,MM,1,0,0,0,0);
	var iso = $dateNumerical(date);
	return [YY,date.valueOf(),month.valueOf(),iso,excel];
}

function $dateLocalTimeOffset(date){
	var utc = $time(date.toUTCString().substring(17,25));
	var local = $time(date.toLocaleTimeString().substring(0,8));
	if (local[0] < utc[0]) local[0] += 24;
	return (utc[0] - local[0]) * 3600 + (utc[1] - local[1]) * 60 + utc[2] - local[2];
}

function $time(string){
	var array = string.split(':');
	var hh = Number(array[0]);
	var mm = Number(array[1]);
	var ss = Number(array[2]);
	return [hh,mm,ss];
}

function $dateFromISO8601Short(iso){//Input format: iso, validated for the range 10000101 - 99991231
	var string = iso.toString();
	var YY = Number(string.substring(0,4));
	var MM = Number(string.substring(4,6)) - 1;
	var DD = Number(string.substring(6,8));
	var date = new Date(YY,MM,DD,0,0,0,0);
	var month = new Date(YY,MM,1,0,0,0,0);
	var excel = Math.round($dateExcel(date));
	return [YY,date.valueOf(),month.valueOf(),iso,excel];
}

function $dateFromJS(input){//Validated for all JS time codes
	var date = new Date(input);
	var YY = date.getFullYear();
	var MM = date.getMonth();
	var DD = date.getDate();
	var month = new Date(YY,MM,1,0,0,0,0);
	var iso = $dateNumerical(date);
	var excel = $dateExcel(date);
	return [YY,date.valueOf(),month.valueOf(),iso,excel];
}

function $dateExcel(date){//1420066800000
	var excel = date / 86400000 + 25569 - $dateLocalTimeOffset(date) / 86400;
	excel = Math.round(excel * 1000000) / 1000000;//6 positions after the comma suffice for accurate dates up to seconds
	if (excel < 61) excel -= 1;//correction for Excel-bug (non-existing date February 29th, 1900)
	return (excel < 1 || excel > 2958101)? 'NaN' : excel;
}

function $dateNumerical(date){
	var array = date.toLocaleString().split(/-| /g);//For non-Dutch date formats you may need other separators
	var DD = Number(array[0]);
	var MM = Number(array[1]);
	var YY = Number(array[2]);
	return YY.toString() + $dateAddZero(MM) + $dateAddZero(DD);
}

function $dateAddZero(number){
	return (number > 9)? number.toString() : '0' + number.toString();
}