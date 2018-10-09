# Changelog

## CURRENT
- Adds support for more patterns in method `buildObject()`:
  - `buildObject('customField', value, context)`
  - `buildObject('customField[attr]', value, context)`

## v1.1.1
- Updates dependencies

## v1.1.0
- Adds method `nullify(value)`
- Adds method `parseField(field, options)`
- Adds method `trim(value)`

## v1.0.8
- Does not filter field names anymore

## v1.0.6
- Fixes method `parseForm()` not returning fields with a name that contains dashes (ex: `x-custom-field`)

## v1.0.5
- Fixes method `parseForm()` not returning fields with a name that is one character long

## v1.0.4
- Renames option `parseValues` to `dynamicTyping` in `parseForm()` method
- Renames option `smartParsing` to `smartTyping` in `parseForm()` method
- Renames option `trimValues` to `trim` in `parseForm()` method

## v1.0.3
- Fixes error with unchecked fields being parsed
- Changes signature of method `cleanFunction(value, field)` called by `parseForm()`
- Adds option `filterFunction: Function(field)` to filter returned fields with `parseForm()`

## v1.0.2
- Updates documentation
- Removes dependency to `underscore`

## v1.0.0
- First public release
