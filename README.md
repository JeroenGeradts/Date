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
- $dateFromExcelSerialCode(excel)
- $dateFromISO8601Short(input)
- $dateFromJS(input)

$date() is a general function that will analyse the input and invoke the most likely of the other functions to do the conversion.
Note that this general function ignores a small range of JS primitive values on January 1st 1970 and January 2nd 1970 in favor of excel and ISO 8601. If your input is only JS primitive values, better use $dataFromJS().

Output. All functions deliver an array with these values:

- year (YYYY)
- JS primitive value of date and time (milisenconds)
- JS primitive value of 1st of the month (miliseconds)
- ISO 8601 short value for date (YYYYMMDD)
- excel code

Examples:

- $date("02-02-2000 12:00:00") = [2000,949489200000,949359600000,20000202,36558.5]
- $date(949489200000) =          [2000,949489200000,949359600000,20000202,36558.5]
- $date(949359600000) =          [2000,949359600000,949359600000,20000201,36557]
- $date(949359600000) =          [2000,949446000000,949359600000,20000202,36558]
