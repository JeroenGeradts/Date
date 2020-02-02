# Date
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
