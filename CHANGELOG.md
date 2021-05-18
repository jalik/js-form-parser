# Changelog

## v2.0.10
- Upgraded dependencies

## v2.0.9
- Upgraded dependencies

## v2.0.8
- Fixed parsing of input names containing dashes (and probably other previously special characters)

## v2.0.7
- Renamed form-parser.js to index.js
- Upgraded dependencies

## v2.0.6
- Fixed `cleanFunction` calling on password fields, which must never happen
- Added support to define number as object attribute if surrounded by double quotes or single quotes
- Upgraded dependencies

## v2.0.5
- Upgraded dependencies

## v2.0.4
- Upgraded dependencies

## v2.0.3
- Upgraded dependencies

## v2.0.2
- Upgraded dependencies

## v2.0.1
- Upgraded dependencies

## v2.0.0
- Upgraded dependencies

**BREAKING CHANGES:**
- Export functions using named export instead of default export syntax

## v1.3.0
- Lib available in ES6+ syntax (see `src` folder) to enable auto-completion in IDEs
- Upgraded dependencies

## v1.2.2
- Upgraded dependencies

## v1.2.1
- Upgraded dependencies

## v1.2.0
- Upgraded dependencies
- Removed unused devDependencies
- Added support for more patterns in method `buildObject()`:
  - `buildObject('customField', value, context)`
  - `buildObject('customField[attr]', value, context)`
  - `buildObject('customFields[0]', value, context)`
- Changes behavior of method `buildObject()` to remove `undefined` fields:
  - Array index with value `undefined` is removed from the result
    - (ex: calling `buildObject('items[0]', undefined, {items:[1,2]})` returns `{items:[2]}`)
  - Object attribute with value `undefined` is removed from the result
    - (ex: calling `buildObject('obj[a]', undefined, {obj:{a:1,b:2}})` returns `{obj:{b:2}}`)

## v1.1.1
- Upgraded dependencies

## v1.1.0
- Added method `nullify(value)`
- Added method `parseField(field, options)`
- Added method `trim(value)`

## v1.0.8
- Does not filter field names anymore

## v1.0.6
- Fixed method `parseForm()` not returning fields with a name that contains dashes (ex: `x-custom-field`)

## v1.0.5
- Fixed method `parseForm()` not returning fields with a name that is one character long

## v1.0.4
- Renames option `parseValues` to `dynamicTyping` in `parseForm()` method
- Renames option `smartParsing` to `smartTyping` in `parseForm()` method
- Renames option `trimValues` to `trim` in `parseForm()` method

## v1.0.3
- Fixed error with unchecked fields being parsed
- Changes signature of method `cleanFunction(value, field)` called by `parseForm()`
- Added option `filterFunction: Function(field)` to filter returned fields with `parseForm()`

## v1.0.2
- Updates README.md
- Removed dependency to `underscore`

## v1.0.0
- First public release
