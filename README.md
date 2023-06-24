# @jalik/form-parser
![GitHub package.json version](https://img.shields.io/github/package-json/v/jalik/js-form-parser.svg)
[![Build Status](https://travis-ci.com/jalik/js-form-parser.svg?branch=master)](https://travis-ci.com/jalik/js-form-parser)
![GitHub](https://img.shields.io/github/license/jalik/js-form-parser.svg)
![GitHub last commit](https://img.shields.io/github/last-commit/jalik/js-form-parser.svg)
[![GitHub issues](https://img.shields.io/github/issues/jalik/js-form-parser.svg)](https://github.com/jalik/js-form-parser/issues)
![npm](https://img.shields.io/npm/dt/@jalik/form-parser.svg)

Parse complex forms with minimum effort.

## Introduction

Parsing forms can be painful, but with this great library you can get all fields from a form, automatically parse values (boolean, number, string, array, object), remove unnecessary spaces from strings and replace empty strings with null, plus you can decide which fields are collected or ignored and even use your own cleaning function.

## Getting started

Let start with a very simple form which produces a flat object :

```html
<form id="my-form">
  <input name="username" value="jalik">
  <input name="email" type="email" value="jalik@mail.com">
  <input name="age" type="number" value="30">
  <input name="subscribeToNewsletter" type="checkbox" data-type="boolean" value="true" checked>
  <input name="phone" type="tel" data-type="string" value="067123456">
  <input name="token" type="hidden" value="aZ7hYkl12mPx">
  <button type="submit">Submit</button>
</form>
```

You can get fields from this form in a single object with minimum effort by using the `parseForm()` method.

**Note:** The form object must be an `HTMLFormElement`.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values with default options
const fields = parseForm(form);
```

The `fields` object will look like this :

```json
{
  "username": "jalik",
  "email": "jalik@mail.com",
  "age": 30,
  "subscribeToNewsletter": true,
  "phone": "067123456",
  "token": "aZ7hYkl12mPx"
}
```

Below is a more complete form example, with a lot of different cases to help you understand the behavior of the parsing function (pay attention to comments, values and attributes).

```html
<form id="my-form">
  <!-- Fields with no name will be ignored -->
  <input type="text" value="aaa">
  
  <!-- These fields will be parsed to booleans -->
  <input name="boolean" type="radio" data-type="boolean" value="true">
  <input name="boolean" type="radio" data-type="boolean" value="false" checked>
  <input name="hidden_boolean" type="hidden" data-type="auto" value="true">
  
  <!-- These fields will be parsed to numbers -->
  <input name="float" type="number" value="09.99">
  <input name="hidden_float" type="hidden" data-type="number" value="09.99">
  <input name="text_integer" type="text" data-type="number" value="01">
  <input name="integer" type="number" value="01">
  <input name="range" type="range" value="0118">
  <select name="select_number" data-type="auto">
    <option value="10"></option>
    <option value="20"></option>
    <option value="30" selected></option>
  </select>
  
  <!-- These fields will be parsed to strings -->
  <input name="date" type="date" value="2017-11-14">
  <input name="file" type="file" value="file://path/to/file.txt">
  <input name="hidden_text" type="hidden" value="shadowed">
  <input name="month" type="month" value="2017-11">
  <input name="number_text" type="number" data-type="string" value="0123">
  <input name="text" type="text" value="Hello">
  <input name="url" type="url" value="http://www.github.com/">
  <input name="week" type="week" value="2017-W16">
  <textarea name="textarea">Hello</textarea>
  
  <!-- Password fields are never altered (trimmed), even by cleanFunction -->
  <input name="password" type="password" value=" s3crEt ">
  
  <!-- These fields will be parsed as array -->
  <input name="array[]" type="checkbox" value="A" checked>
  <input name="array[]" type="checkbox" value="B" checked>
  <select name="select_multiple" data-type="number" multiple>
    <option value="10"></option>
    <option value="20" selected></option>
    <option value="30" selected></option>
  </select>
  
  <!-- Disabled fields are ignored by default -->
  <input name="disabled_field" value="" disabled>
  
  <!-- Buttons are ignored by default -->
  <input name="input_button" type="button" value="Click me">
  <input name="input_reset" type="reset" value="Reset">
  <input name="input_submit" type="submit" value="Submit">
  <button name="button" type="button" value="Click me"></button>
  <button name="reset" type="reset" value="Reset"></button>
  <button name="submit" type="submit" value="Submit"></button>
</form>
```

To get form fields :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
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
  "password": " s3crEt ",
  "array": ["A", "B"],
  "select_multiple": [20, 30]
}
```

## Parsing arrays

To get an array of values from a form, use this syntax :

```html
<form id="my-form">
  <!-- This will create an array with checked values -->
  <input name="array[]" type="checkbox" value="A">
  <input name="array[]" type="checkbox" value="B" checked>
  <input name="array[]" type="checkbox" value="C" checked>
  
  <!-- This will create an array with checked values, but it will keep indexes -->
  <input name="colors[2]" type="checkbox" value="red" checked>
  <input name="colors[1]" type="checkbox" value="blue">
  <input name="colors[0]" type="checkbox" value="white" checked>
</form> 
```

Get fields values :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
```

The `fields` object will look like this :

```
{
  "array": ["B", "C"],
  "colors": ["white", undefined, "red"]
}
```

## Parsing objects

To get an object from a form, use this syntax :

```html
<form id="my-form">
  <!-- This will create an object with those attributes -->
  <input name="address[street]" value="Av. Pouvanaa a Oopa">
  <input name="address[city]" value="Papeete">
</form> 
```

Get fields values :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
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

### Using numbers as object attribute (since v2.0.6)

If you need to create an object with numbers as attributes, use single or double quotes to force the parser to interpret it as a string and then creating an object instead of an array.

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
{"elements": ["Zero", "One", "Two"]}
```

## Forcing fields types

Sometimes you may want to force a number to be parsed as a string for example.
In this case, use the `data-type` attribute on the input. When the parser will get fields values, it will automatically convert them to the given `data-type`.

The `data-type` attribute can have one of the following values : `auto`, `boolean`, `number` or `string`.

**Note:** The `auto` data-type will convert value to the best guess type (ex: `123` => `number`).

**Note:** The `boolean` data-type will convert `"1"` and `"true"` to `true`, all other values are `false`. 

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

If no `data-type` attribute is set, the `type` attribute will be used (for `input` elements at least), this behavior is active by default with the combination of this options `{dynamicTyping: true, smartTyping: true}` in the `parseForm()` function.

## Parsing complex forms with nested fields

This purpose of this lib is to reconstruct an object corresponding to the form structure, so it can parse complex forms containing "unlimited" nested arrays and objects.

```html
<form id="my-form">
  <input name="phones[0][code]" type="number" data-type="string" value="689">
  <input name="phones[0][number]" type="number" data-type="string" value="87218910">
  <input name="phones[1][code]" type="number" data-type="string" value="689">
  <input name="phones[1][number]" type="number" data-type="string" value="87218910">
  
  <!-- A very deep field value -->
  <input name="deep_1[][deep_2][0][][deep_3]" value="DEEP">
</form> 
```

To get fields :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
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
          {"deep_3": "DEEP"}
        ]
      ]
    }
  ]
}
```

## Filtering fields

You can get only the fields you want with `filterFunction(field, parsedValue)` option in the `parseForm()`
method. The filter function will be called with all fields and must return `true` to return the
field.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form, {
  // returns only text fields
  filterFunction: (field, parsedValue) => field.type === 'text'
});
```

## Cleaning parsed values

All string values can be cleaned using the `cleanFunction(value, field)` option in the `parseForm()` method. The clean function will be called with any value that is a string of length > 0.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form, {
  cleanFunction: (value, field) => {
    // Apply uppercase to lastName field
    if (field.name === "lastName" || /name/gi.test(field.name)) {
      value = value.toUpperCase();
    }
    // Remove HTML code from all fields
    return value.replace(/<\/?[^>]+>/gm, "");
  }
});
```

## API

### parseField(field, options)

You can parse a single field with options, it works the same way as `parseForm(form, options)` but with a field.

```js
import { parseField } from "@jalik/form-parser";

// Colors is a select allowing multiple values to be selected
const colorsSelect = document.getElementById("colors-field");

// Get the colors array (ex: colors = ['blue', 'green'])
const colors = parseField(colorsSelect, {
  dynamicTyping: true,
  nullify: true,
  smartTyping: true,
  trim: true,
});
```

### parseForm(form, options)

You can parse a form with options to customize the behavior.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values with custom options
const fields = parseForm(form, {
  // Cleans parsed values
  cleanFunction(value, field) {
    return typeof value === 'string' ? stripTags(value) : value;
  },
  // Only returns fields that matches the condition
  filterFunction(field) {
    return field.type === 'text';
  },
  // Replace empty strings with null
  nullify: true,
  // Parse values to the best guess type (ex: "001" => 1)
  dynamicTyping: true,
  // Parse values based on field type (ex: type="number" will parse to number)
  smartTyping: true,
  // Remove extra spaces
  trim: true
});
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6UA5YELH55WLC)
