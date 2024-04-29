# Changelog

## v3.1.4 (2024-04-29)

- Fixed `parseForm()` returning radio input value as string instead of boolean or number when the last field does not have a `data-type`

## v3.1.3 (2024-04-26)

- Fixed parsing of textarea element

## v3.1.2 (2024-04-25)

- Fixed returned value of checkboxes without explicit value to be `null` when unchecked instead of `false`
- Fixed returned value of empty (or unchecked) fields to be `null` instead of `undefined`

## v3.1.1 (2024-03-19)

- Fixed option `nullify` in `parseField(element, options)`

## v3.1.0 (2023-06-26)

- Added option `parser: (value, dataType, field)` to `parseForm()` and `parseField()` to handle custom `data-type`
- Do not clean, trim or nullify value of `checkbox`, `radio`, `select`, `password` and `hidden` fields
- Fixed checkbox with `data-type="boolean"` not being `false` when unchecked
- Fixed collecting of checkboxes with the same name to an array value (without `[]` in the name)
- Fixed collecting of array fields (ex: `name="items[]"`)
- Fixed duplicate values in array fields
- Fixed collecting and parsing of radios and checkboxes not working until the last value is checked

## v3.0.0 (2023-06-23)

- **[BREAKING]** Removed option `ignoreButtons` in `parseForm(options)`
- **[BREAKING]** Removed option `ignoreUnchecked` in `parseForm(options)`
- **[BREAKING]** Removed option `ignoreEmpty` in `parseForm(options)`
- **[BREAKING]** Removed option `ignoreDisabled` in `parseForm(options)`
- **[BREAKING]** Removed option `smartTyping` in `parseForm(options)`
- **[BREAKING]** Removed option `dynamicTyping` in `parseForm(options)`
- Changed parsing expression of "true" to `true|1|yes|on` for `data-type="boolean"`
- Changed parsing expression of "false" to `false|0|no|off` for `data-type="boolean"`
- Added field parsed `value` as second argument of `filterFunction` in `parseForm(options)`
- Added option `parsing: 'none' | 'type' | 'data-type' | 'auto'` in `parseForm(options)` and `parseField(options)`
- Fixed `data-type="boolean"` not returning `false` when checkbox is not checked
- Migrated to TypeScript

## v2.0.12 (2022-10-19)

- Fixed parsing of single input to return null if not checked
- Fixed parsing of inputs sharing the same name
- Removed deprecation warnings
- Upgraded dependencies

## v2.0.11 (2021-09-20)

- Upgraded dependencies

## v2.0.10 (2021-05-18)

- Upgraded dependencies

## v2.0.9 (2021-01-18)

- Upgraded dependencies

## v2.0.8 (2020-11-12)

- Fixed parsing of input names containing dashes (and probably other previously special characters)

## v2.0.7 (2020-11-10)

- Renamed form-parser.js to index.js
- Upgraded dependencies

## v2.0.6 (2020-10-01)

- Fixed `cleanFunction` calling on password fields, which must never happen
- Added support to define number as object attribute if surrounded by double quotes or single quotes
- Upgraded dependencies

## v2.0.5 (2020-09-17)

- Upgraded dependencies

## v2.0.4 (2020-08-06)

- Upgraded dependencies

## v2.0.3 (2020-02-18)

- Upgraded dependencies

## v2.0.2 (2019-12-02)

- Upgraded dependencies

## v2.0.1 (2019-07-24)

- Upgraded dependencies

## v2.0.0 (2019-02-26)

- Upgraded dependencies

**BREAKING CHANGES:**

- Export functions using named export instead of default export syntax

## v1.3.0 (2019-02-07)

- Lib available in ES6+ syntax (see `src` folder) to enable auto-completion in IDEs
- Upgraded dependencies

## v1.2.2 (2019-01-17)

- Upgraded dependencies

## v1.2.1 (2018-10-13)

- Upgraded dependencies

## v1.2.0 (2018-10-10)

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

## v1.1.1 (2018-06-07)

- Upgraded dependencies

## v1.1.0 (2018-04-11)

- Added method `nullify(value)`
- Added method `parseField(field, options)`
- Added method `trim(value)`

## v1.0.8 (2018-03-11)

- Does not filter field names anymore

## v1.0.6

- Fixed method `parseForm()` not returning fields with a name that contains dashes (
  ex: `x-custom-field`)

## v1.0.5 (2017-12-05)

- Fixed method `parseForm()` not returning fields with a name that is one character long

## v1.0.4 (2017-12-02)

- Renames option `parseValues` to `dynamicTyping` in `parseForm()` method
- Renames option `smartParsing` to `smartTyping` in `parseForm()` method
- Renames option `trimValues` to `trim` in `parseForm()` method

## v1.0.3

- Fixed error with unchecked fields being parsed
- Changes signature of method `cleanFunction(value, field)` called by `parseForm()`
- Added option `filterFunction: Function(field)` to filter returned fields with `parseForm()`

## v1.0.2 (2017-11-21)

- Updates README.md
- Removed dependency to `underscore`

## v1.0.0 (2017-11-15)

- First public release
