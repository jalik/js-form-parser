# @jalik/form-parser

![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-form-parser.svg)
![Build Status](https://github.com/jalik/js-form-parser/actions/workflows/node.js.yml/badge.svg)
![Last commit](https://img.shields.io/github/last-commit/jalik/js-form-parser.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-form-parser.svg)](https://github.com/jalik/js-form-parser/issues)
![GitHub](https://img.shields.io/github/license/jalik/js-form-parser.svg)
![npm](https://img.shields.io/npm/dt/@jalik/form-parser.svg)

## Features

- Collect and parse form values in one line
- Parse values based on field type (ex: `type="number"`) or data-type (ex: `data-type="boolean"`)
- Use custom parser with `data-type`
- Build arrays and objects based on field name
- Trim and nullify values
- Filter values using a custom function
- Clean values using a custom function
- TypeScript declarations ♥

## Sandbox

Play with the lib here: https://codesandbox.io/s/jalik-form-parser-demo-r29grh?file=/src/index.js

## Installing

```shell
npm i -P @jalik/form-parser
```
```shell
yarn add @jalik/form-parser
```

## Getting started

Let's start with the form below :

```html
<form id="my-form">
  <input name="username" value="jalik">
  <input name="password" value="secret">
  <input name="age" type="number" value="35">
  <input name="gender" type="radio" value="male" checked>
  <input name="gender" type="radio" value="female">
  <input name="email" type="email" value="jalik@mail.com">
  <input name="phone" type="tel" data-type="string" value="067123456">
  <input name="subscribe" type="checkbox" data-type="boolean" value="true" checked>
  <input name="token" type="hidden" value="aZ7hYkl12mPx">
  <button type="submit">Submit</button>
</form>
```

You can collect and parse fields with `parseForm(form, options)`.

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values with default options
const fields = parseForm(form)
```

The `fields` object will look like this :

```json
{
  "username": "jalik",
  "password": "secret",
  "age": 35,
  "gender": "male",
  "email": "jalik@mail.com",
  "phone": "067123456",
  "subscribe": true,
  "token": "aZ7hYkl12mPx"
}
```

Below is a more complete form example, with a lot of different cases to help you understand the
behavior of the parsing function (pay attention to comments, values and attributes).

```html

<form id="my-form">
  <!-- Fields without name are ignored -->
  <input type="text" value="aaa">

  <!-- Disabled fields are always ignored -->
  <input name="disabled_field" value="hello" disabled>

  <!-- Buttons are always ignored -->
  <input name="input_button" type="button" value="Click me">
  <input name="input_reset" type="reset" value="Reset">
  <input name="input_submit" type="submit" value="Submit">
  <button name="button" type="button" value="Click me"></button>
  <button name="reset" type="reset" value="Reset"></button>
  <button name="submit" type="submit" value="Submit"></button>

  <!-- These fields will be parsed to booleans -->
  
  <!-- boolean = false -->
  <input name="boolean" type="radio" data-type="boolean" value="true">
  <input name="boolean" type="radio" data-type="boolean" value="false" checked>
  <!-- hidden_boolean = true -->
  <input name="hidden_boolean" type="hidden" data-type="auto" value="true">

  <!-- These fields will be parsed to numbers -->
  
  <!-- hidden_float = 9.99 -->
  <input name="hidden_float" type="hidden" data-type="number" value="09.99">
  <!-- text_integer = 1 -->
  <input name="text_integer" type="text" data-type="number" value="01">
  <!-- select_number = 30 -->
  <select name="select_number" data-type="number">
    <option>10</option>
    <option>20</option>
    <option selected>30</option>
  </select>
  <!-- float = 9.99 -->
  <input name="float" type="number" value="09.99">
  <!-- integer = 1 -->
  <input name="integer" type="number" value="01">
  <!-- range = 0118 -->
  <input name="range" type="range" value="0118">

  <!-- These fields will be parsed to strings -->
  
  <!-- number_text = '0123' -->
  <input name="number_text" type="number" data-type="string" value="0123">
  <!-- date = '2017-11-14' -->
  <input name="date" type="date" value="2017-11-14">
  <!-- file = 'file://path/to/file.txt' -->
  <input name="file" type="file" value="file://path/to/file.txt">
  <!-- hidden_text = 'shadowed' -->
  <input name="hidden_text" type="hidden" value="shadowed">
  <!-- month = '2017-11' -->
  <input name="month" type="month" value="2017-11">
  <!-- text = 'Hello' -->
  <input name="text" type="text" value="Hello">
  <!-- url = 'http://www.github.com/' -->
  <input name="url" type="url" value="http://www.github.com/">
  <!-- week = '2017-W16' -->
  <input name="week" type="week" value="2017-W16">
  <!-- textarea = 'Hello' -->
  <textarea name="textarea">Hello</textarea>

  <!-- Passwords are never altered or parsed ("data-type" is ignored) -->
  
  <!-- password = ' 1337 ' -->
  <input name="password" type="password" data-type="number" value=" 1337 ">

  <!-- These fields will be parsed as array -->
  
  <!-- select_multiple = [20, 30] -->
  <select name="select_multiple" data-type="number" multiple>
    <option>10</option>
    <option selected>20</option>
    <option selected>30</option>
  </select>
  <!-- array = ['A', 'B'] -->
  <input name="array[]" type="checkbox" value="A" checked>
  <input name="array[]" type="checkbox" value="B" checked>
</form>
```

To get form fields :

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values using default options
const fields = parseForm(form)
```

The `fields` object will look like this :

```json
{
  "boolean": false,
  "hidden_boolean": true,
  "float": 9.99,
  "hidden_float": 9.99,
  "text_integer": 1,
  "integer": 1,
  "range": 118,
  "select_number": 30,
  "date": "2017-11-14",
  "file": "file://path/to/file.txt",
  "hidden_text": "shadowed",
  "month": "2017-11",
  "number_text": "0123",
  "text": "Hello",
  "url": "http://www.github.com/",
  "textarea": "Hello",
  "password": " 1337 ",
  "array": [
    "A",
    "B"
  ],
  "select_multiple": [
    20,
    30
  ]
}
```

## Building arrays

To get an array of values, append `[]` to a field name:

```html
<form id="my-form">
  <!-- This will create an array with checked values -->
  <input name="array[]" type="checkbox" value="A">
  <input name="array[]" type="checkbox" value="B" checked>
  <input name="array[]" type="checkbox" value="C" checked>

  <!-- This will create an array with checked values (indexed) -->
  <input name="colors[2]" type="checkbox" value="red" checked>
  <input name="colors[1]" type="checkbox" value="blue">
  <input name="colors[0]" type="checkbox" value="white" checked>
</form> 
```

Get fields values :

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values using default options
const fields = parseForm(form)
```

The `fields` object will look like this :

```json
{
  "array": [
    "B",
    "C"
  ],
  "colors": [
    "white",
    undefined,
    "red"
  ]
}
```

## Building objects

To get an object, write attributes like `[attribute]`:

```html
<form id="my-form">
  <!-- This will create an object with those attributes -->
  <input name="address[street]" value="Av. Pouvanaa a Oopa">
  <input name="address[city]" value="Papeete">
</form> 
```

Get fields values :

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values using default options
const fields = parseForm(form)
```

The `fields` object will look like this :

```json
{
  "address": {
    "street": "Av. Pouvanaa a Oopa",
    "city": "Papeete"
  }
}
```

### Using numbers as keys in objects (since v2.0.6)

If you need to create an object with numbers as attributes, use single or double quotes to force the
parser to interpret it as a string and then creating an object instead of an array.

```html
<form id="my-form">
  <!-- This will create an object with those attributes -->
  <input name="elements['0']" value="Zero">
  <input name="elements['1']" value="One">
  <input name="elements['2']" value="Two">
</form> 
```

Will give this :

```json
{
  "elements": {
    "0": "Zero",
    "1": "One",
    "2": "Two"
  }
}
```

Instead of :

```json
{
  "elements": [
    "Zero",
    "One",
    "Two"
  ]
}
```

## Parsing fields

To define the type of field, you can use the attribute `data-type` or `type`.  
The attribute `data-type` takes precedence over `type` if both of are defined.

When using `data-type` attribute, the value can be:
* `auto` to convert the value to the best guess type (ex: `123` => `number`, `true` => `boolean`)
* `boolean` to convert the value to a boolean (ex: `true`, `1`, `yes`, `on`, `false`, `0`, `no`, `off`)
* `number` to convert the value to a number

When using `type` attribute on `<input>`, only `number` and `range` are parsed to numbers.

```html
<!-- This will parse "true" as a boolean -->
<input name="boolean" type="text" data-type="boolean" value="true">

<!-- This will parse "01" as a number -->
<input name="integer" type="text" data-type="number" value="01">
<!-- This will parse "09.99" as a number -->
<input name="float" type="text" data-type="number" value="09.99">

<!-- This will parse "0963" as a string -->
<input name="string" type="text" data-type="string" value="0963">

<!-- This will parse "13.37" as a number -->
<input name="anything" type="text" data-type="auto" value="13.37">
<!-- This will parse "false" as a boolean -->
<input name="anything_2" type="text" data-type="auto" value="false">
```

## Using a custom parser

You may want to create your own `data-type`, it is possible since the `v3.1.0` by passing the `parser` option to `parseForm()` or `parseField()`.

```html
<form id="my-form">
  <input name="phone" data-type="phone" value="689.12345678" />
</form>
```

```js
import { parseForm } from '@jalik/form-parser'

const form = document.getElementById('my-form')
const fields = parseForm(form, {
  parser: (value, dataType, field) => {
    if (dataType === 'phone') {
      const [code, number] = value.split(/\./)
      return {
        code,
        number,
      }
    }
    return null
  },
})
```

```json
{
  "phone": {
    "code": "689",
    "number": "12345678"
  }
}
```

## Parsing complex forms with nested fields

It is possible to reconstruct an object corresponding to the form structure, so it can
parse complex forms containing nested arrays and objects.

```html
<form id="my-form">
  <input name="phones[0][code]" type="number" data-type="string" value="689">
  <input name="phones[0][number]" type="number" data-type="string" value="87218910">
  <input name="phones[1][code]" type="number" data-type="string" value="689">
  <input name="phones[1][number]" type="number" data-type="string" value="87218910">
  
  <!-- A useless deep nested field value -->
  <input name="deep_1[][deep_2][0][][deep_3]" value="DEEP">
</form> 
```

To get fields :

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values using default options
const fields = parseForm(form)
```

The `fields` object will look like this :

```json
{
  "phones": [
    {
      "code": "689",
      "number": "87218910"
    },
    {
      "code": "689",
      "number": "87218910"
    }
  ],
  "deep_1": [
    {
      "deep_2": [
        [
          {
            "deep_3": "DEEP"
          }
        ]
      ]
    }
  ]
}
```

## Filtering

When parsing a form, you can filter values with `filterFunction(field, parsedValue)` option in the `parseForm(form, options)`.  
The filter function must return `true` to return the field.

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

const fields = parseForm(form, {
  // returns only text fields
  filterFunction: (field, parsedValue) => field.type === 'text'
});
```

## Cleaning

Values can be cleaned by passing `cleanFunction(value, field)` to `parseForm(form, options)`.  
Note that only strings are passed to this function and that password fields are ignored.

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

// Parse form values using default options
const fields = parseForm(form, {
  cleanFunction: (value, field) => {
    // Apply uppercase to lastName field
    if (field.name === 'lastName' || /name/gi.test(field.name)) {
      value = value.toUpperCase()
    }
    // Remove HTML code from all fields
    return value.replace(/<\/?[^>]+>/gm, '')
  }
})
```

## API

### parseField(field, options)

To parse a single field.

```html
<form>
  <select data-type="number" name="values" multiple>
    <option>1</option>
    <option selected>2</option>
    <option selected>3</option>
  </select>
</form>
```

```js
import { parseField } from '@jalik/form-parser'

const field = document.getElementById('values')
const values = parseField(field)
// values = [2, 3]
```

### parseForm(form, options)

To parse a form with all fields.

```html
<form id="my-form">
  <input type="number" name="age" value="35" />
  <select data-type="number" name="values" multiple>
    <option>1</option>
    <option selected>2</option>
    <option selected>3</option>
  </select>
</form>
```

```js
import { parseForm } from '@jalik/form-parser'

// Get an existing HTML form element
const form = document.getElementById('my-form')

const fields = parseForm(form, {
  // Cleans parsed values
  cleanFunction(value, field) {
    return typeof value === 'string' ? stripTags(value) : value
  },
  // Only returns fields that matches the condition
  filterFunction(field) {
    return field.type === 'text'
  },
  // Replace empty strings with null
  nullify: true,
  // Set parsing mode.
  // - none: disable parsing
  // - type: enable parsing based on "type" attribute (ex: type="number")
  // - data-type: enable parsing based on "data-type" attribute (ex: data-type="number")
  // - auto: enable parsing based on data-type and type (in this order)
  parsing: 'none' | 'type' | 'data-type' | 'auto',
  // Remove extra spaces
  trim: true
})
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).
