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

Exceptions:

- 1900-02-29 is a non existing date, but a valid Excel serial number 61
- JS-values are 600 sec off between Excel dates: 1916-04-30 23:40 and 1916-05-01 01:00	(around Excel code 5965 and 5966)
- JS-values are 28 sec off between Excel dates: 1937-06-30 22:50 and 1937-07-01 00:00 (around Excel code 13696 and 13697)
- JS-values are 6000 sec off between Excel dates: 1940-05-15 23:40 and 1940-05-16 01:40 (around Excel code 14746 and 14747)
- JS-range 1970-01-01 01:00:00 to 1970-01-01 01:49:18 will result in Excel serial numbers when you use $date()
- JS-range 1970-01-01 03:46:00 to 1970-02-01 04:46:00 will result in ISO 8601 short numbers when you use $date()


- 1900-02-29 is a non existing date, but a valid Excel serial number 61
- 1916-04-30 23:40 and 1916-05-01 01:00	(around Excel code 5965 and 5966)
- 1937-06-30 22:50 and 1937-07-01 00:00 (around Excel code 13696 and 13697)
- 1940-05-15 23:40 and 1940-05-16 01:40 (around Excel code 14746 and 14747)
- 1970-01-01 01:00:00 to 1970-01-01 01:49:18 
- 1970-01-01 03:46:00 to 1970-02-01 04:46:00
