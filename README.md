# jk-form-parser

This package allows you to parse form fields.

## Introduction

Parsing forms can be painful, but with this great library you can get all fields from a form, automatically parse values (boolean, number, string, array, object), remove unnecessary spaces from strings and replace empty strings with null, plus you can decide which fields are collected or ignored and even use your own cleaning function.

**This library is well tested with more than 90+ unit tests.**

## Defining field types

You can force field type when parsing using the `data-type` attribute on any form element. This attribute can have one of the following values : `boolean`, `number`, `string`.

```html
<input name="boolean" type="text" value="true" data-type="boolean">
<input name="integer" type="text" value="01" data-type="numeric">
<input name="float" type="text" value="09.99" data-type="numeric">
<input name="string" type="text" value="hello" data-type="string">
```

If no `data-type` attribute is set, the `type` attribute will be used (for `input` elements at least), this behavior is active by default with the combination of this options `{parseValues: true, smartTyping: true}` in the `parseForm` function.

## Getting fields from a form

Let say you have a form like the one below (pay attention to values and attributes), this one is very complete but omit some aspects that you will see after.

```html
<form id="my-form">
    <!-- Fields with no name will be ignored -->
    <input type="text" value="aaa">
    
    <!-- These fields will be parsed to boolean -->
    <input name="hidden_boolean" type="hidden" value="true">
    <input name="boolean" type="radio" value="true" data-type="boolean">
    <input name="boolean" type="radio" value="false" data-type="boolean" checked>
    
    <!-- These fields will be parsed to number -->
    <input name="hidden_float" type="hidden" value="09.99" data-type="number">
    <input name="hidden_integer" type="hidden" value="01" data-type="number">
    <input name="float" type="number" value="09.99">
    <input name="integer" type="number" value="01">
    <select name="select_number">
        <option value="10"></option>
        <option value="20"></option>
        <option value="30" selected></option>
    </select>
    
    <!-- These fields will be parsed to string -->
    <input name="hidden_text" type="hidden" value="0123" data-type="string">
    <input name="file" type="file" value="file://path/to/file.txt">
    <input name="text" type="text" value="Hello">
    <input name="url" type="url" value="http://www.github.com/">
    <textarea name="textarea">Hello world</textarea>
    
    <!-- Password fields are never parsed and will remain unmodified -->
    <input name="password" type="password" value=" s3crEt ">
    
    <!-- These fields will be parsed as array -->
    <input name="array[]" type="checkbox" value="A" checked>
    <input name="array[]" type="checkbox" value="B" checked>
    <select name="select_multiple" multiple>
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

You can get fields from this form in a single object with minimum effort by using the `parseForm` method with options.

**Note:** The form object must be an `HTMLFormElement`.

```js
const FormUtils = require("jk-form-parser");

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values
const fields = FormUtils.parseForm(form, {
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
    parseValues: true,
    // Parse values based on field type (ex: type="number" will parse to number)
    smartTyping: true,
    // Remove extra spaces
    trimValues: true 
});
```

The generated `fields` constant will look like this :

```json
{
  "hidden_boolean": true,
  "boolean": false,
  "hidden_float": 9.99,
  "hidden_integer": 1,
  "float": 9.99,
  "integer": 1,
  "select_number": 30,
  "hidden_text": "0123",
  "file": "file://path/to/file.txt",
  "text": "Hello",
  "url": "http://www.github.com/",
  "textarea": "Hello world",
  "password": " s3crEt ",
  "array": ["A", "B"],
  "select_multiple": [20, 30]
}
```

## Getting arrays from a form

To get an array of values from a form, have a look at this code.

```html
<form id="my-form">
    <!-- This will create an array with checked values -->
    <input name="array[]" type="checkbox" value="A">
    <input name="array[]" type="checkbox" value="B" checked>
    <input name="array[]" type="checkbox" value="C" checked>
    
    <!-- This will create an array with checked values, but it will keep indexes -->
    <input name="colors[1]" type="checkbox" value="red">
    <input name="colors[3]" type="checkbox" value="white" checked>
    <input name="colors[5]" type="checkbox" value="red" checked>
</form> 
```

To get fields :

```js
const FormUtils = require("jk-form-parser");

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = FormUtils.parseForm(form);
```

The generated `fields` constant will look like this :

```json
{
  "array": ["B", "C"],
  "colors": [undefined, "red", undefined, "white", undefined, "red"]
}
```

## Getting objects from a form

To get an object from a form, have a look at this code.

```html
<form id="my-form">
    <!-- This will create an object with given attributes -->
    <input name="phone[code]" type="number" value="689" data-type="string">
    <input name="phone[number]" type="number" value="87218910" data-type="string">
</form> 
```

To get fields :

```js
const FormUtils = require("jk-form-parser");

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = FormUtils.parseForm(form);
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
const FormUtils = require("jk-form-parser");

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = FormUtils.parseForm(form);
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

## Using a custom clean function

All text values can be cleaned using the `cleanFunction(value, field)` custom function.
This function is called with any value that is a string of length > 0.

```js
const FormUtils = require("jk-form-parser");

// Get an existing HTML form element
const form = document.getElementById("my-form");

// Parse form values using default options
const fields = FormUtils.parseForm(form, {
    cleanFunction(value, fieldName) {
        // Apply uppercase to lastName field
        if (fieldName === "lastName") {
            value = value.toUpperCase();
        }
        
        // Remove HTML code from all fields
        value = value.replace(/<\/?[^>]+>/gm, "");
        
        return value;   
    }
});
```

## Changelog

### v0.1.0
- First public release

## License

This project is released under the [MIT License](http://www.opensource.org/licenses/MIT).
