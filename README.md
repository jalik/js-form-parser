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

## Defining fields types

First of all, you have to define fields types in the HTML code using the `data-type` attribute, so when the parser will get fields values, it will automatically convert them to the given type. The `data-type` attribute can have one of the following values : `auto`, `boolean`, `number` or `string`.

**Note:** The `auto` value will analyze value and convert it to the best type automatically.

```html
<!-- This will convert "true" to boolean -->
<input name="boolean" type="text" value="true" data-type="boolean">
<!-- This will convert "01" to number -->
<input name="integer" type="text" value="01" data-type="number">
<!-- This will convert "09.99" to number -->
<input name="float" type="text" value="09.99" data-type="number">
<!-- This will keep "0963" as a string -->
<input name="string" type="text" value="0963" data-type="string">
<!-- This will convert "13.37" to a number using regular expression -->
<input name="anything" type="text" value="13.37" data-type="auto">
<!-- This will convert "false" to a boolean using regular expression -->
<input name="anything_2" type="text" value="false" data-type="auto">
```

If no `data-type` attribute is set, the `type` attribute will be used (for `input` elements at least), this behavior is active by default with the combination of this options `{dynamicTyping: true, smartTyping: true}` in the `parseForm()` function.

## Getting fields from a form

Let start with a very simple form :

```html
<form id="my-form">
    <input type="text" name="username" value="Jalik ">
    <input type="email" name="email" value="jalik26@gmail.com">
    <input type="number" name="age" value="30" data-type="number">
    <input type="checkbox" name="subscribeToNewsletter" value="true" data-type="boolean" checked>
    <input type="hidden" name="token" value="aZ7hYkl12mPx">
    <button type="submit">Submit</button>
</form>
```

You can get fields from this form in a single object with minimum effort by using the `parseForm()` method.

**Note:** The form object must be an `HTMLFormElement`.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values with explicit options, which are optional
const fields = parseForm(form, {
    // Filters returned fields
    cleanFunction(value, field) { return value; },
    // Filters returned fields
    filterFunction(field) { return true; },
    // Don't get buttons
    ignoreButtons: true,
    // Don't get disabled fields
    ignoreDisabled: true,
    // Don't get fields with empty string
    ignoreEmpty: false,
    // Don't get radios or checkboxes that are not checked
    ignoreUnchecked: false,
    // Replace empty strings with null
    nullify: true,
    // Parse values to the best type (ex: "001" => 1)
    dynamicTyping: true,
    // Parse values based on field type (ex: type="number" will parse to number)
    smartTyping: true,
    // Remove extra spaces
    trim: true 
});
```

You will then get the `fields` constant looking like this :

```json
{
  "username": "Jalik",
  "email": "jalik26@gmail.com",
  "age": 30,
  "subscribeToNewsletter": true,
  "token": "aZ7hYkl12mPx"
}
```

Below is a more complete form example (pay attention to comments, values and attributes).

```html
<form id="my-form">
    <!-- Fields with no name will be ignored -->
    <input type="text" value="aaa">
    
    <!-- These fields will be parsed to booleans -->
    <input name="boolean" type="radio" value="true" data-type="boolean">
    <input name="boolean" type="radio" value="false" data-type="boolean" checked>
    <input name="hidden_boolean" type="hidden" value="true" data-type="auto">
    
    <!-- These fields will be parsed to numbers -->
    <input name="float" type="number" value="09.99">
    <input name="hidden_float" type="hidden" value="09.99" data-type="number">
    <input name="text_integer" type="text" value="01" data-type="number">
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
    <input name="number_text" type="number" value="0123" data-type="string">
    <input name="text" type="text" value="Hello">
    <input name="url" type="url" value="http://www.github.com/">
    <input name="week" type="week" value="2017-W16">
    <textarea name="textarea">Hello</textarea>
    
    <!-- Password fields are never parsed and will remain unmodified -->
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

And to get form fields :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
```

The generated `fields` constant will look like this :

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

## Getting arrays from a form

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

To get form fields :

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form);
```

The generated `fields` constant will look like this :

```
{
  "array": ["B", "C"],
  "colors": ["white", undefined, "red"]
}
```

## Getting objects from a form

To get an object from a form, use this syntax :

```html
<form id="my-form">
    <!-- This will create an object with those attributes -->
    <input name="phone[code]" type="number" value="689" data-type="string">
    <input name="phone[number]" type="number" value="87218910" data-type="string">
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

The generated `fields` constant will look like this :

```json
{
  "phone": {
    "code": "689",
    "number": "87218910"
  }
}
```

## Parsing a single field

You can even parse a single field using the same logic of dynamic typing and smart typing based on field type or field dataset... 
This can be useful in a React application with controlled components for example.

```js
import { parseField } from "@jalik/form-parser";

// Age field is an input of type number
const ageField = document.getElementById("age-field");

// Get the age as number (ex: age = 30)
const age = parseField(ageField, {
  dynamicTyping: true,
  nullify: true,
  smartTyping: true,
  trim: true,
});

// Colors is a select allowing multiple values to be selected
const colorsSelect = document.getElementById("colors-select");

// Get the colors as array (ex: colors = ['blue', 'green'])
const colors = parseField(colorsSelect, {
  dynamicTyping: true,
  nullify: true,
  smartTyping: true,
  trim: true,
});

```

## Creating complex forms

You can construct complex and deep objects using a mix of arrays and object attributes.
As far as I know there is no depth limit.

```html
<form id="my-form">
    <input name="phones[0][code]" type="number" value="689" data-type="string">
    <input name="phones[0][number]" type="number" value="87218910" data-type="string">
    <input name="phones[1][code]" type="number" value="689" data-type="string">
    <input name="phones[1][number]" type="number" value="87218910" data-type="string">
    
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

The generated `fields` constant will look like this :

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

## Filtering returned fields

You can get only the fields you want with `filterFunction(field)` option in the `parseForm()` method. The filter function will be called with all fields and must return `true` to return the field.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form, {
    filterFunction(field) {
        // returns only text fields
        return field.type === "text";   
    }
});
```

## Cleaning returned values

All string values can be cleaned using the `cleanFunction(value, field)` option in the `parseForm()` method. The clean function will be called with any value that is a string of length > 0.

```js
import { parseForm } from "@jalik/form-parser";

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = parseForm(form, {
    cleanFunction(value, field) {
        // Apply uppercase to lastName field
        if (field.name === "lastName" || /name/gi.test(field.name)) {
            value = value.toUpperCase();
        }
        
        // Remove HTML code from all fields
        value = value.replace(/<\/?[^>]+>/gm, "");
        
        return value;   
    }
});
```

## Parsing a single field

The lib allows you to parse a single field with the same options you would pass to the `parseForm(form, options)`, using the `parseField(field, options)` method.

```js
import { parseField } from '@jalik/form-parser';

// Define parsing options
const parsingOptions = {
    nullify: true,
    dynamicTyping: true,
    smartTyping: true,
    trim: true 
};

// Get input element
const input = document.getElementById('#customField');

// Parse input value
const value = parseField(input, options);
```

## Changelog

History of releases is in the [changelog](./CHANGELOG.md).

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6UA5YELH55WLC)
