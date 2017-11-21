/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import FormUtils from "../src/jk-form-parser";
import TestUtils from "./lib";

// Define constants
const FALSE = "false";
const TRUE = "true";
const FLOAT = 9.99;
const FLOAT_STRING = "09.99";
const FLOAT_STRING_COMMA = "09,99";
const INTEGER = 100;
const INTEGER_STRING = "0100";
const STRING = "hello";

describe(`FormUtils`, () => {

    it(`should be importable from package`, () => {
        expect(typeof FormUtils.parseForm).toEqual("function");
    });
});

describe("buildObject()", () => {

    // Testing with arrays

    test(`buildObject("[]", "${STRING}", null) should return ["${STRING}"]`, () => {
        const r = FormUtils.buildObject("[]", STRING, null);
        expect(r).toEqual([STRING]);
    });

    test(`buildObject("[0]", "${STRING}", null) should return ["${STRING}"]`, () => {
        const r = FormUtils.buildObject("[0]", STRING, null);
        expect(r).toEqual([STRING]);
    });

    test(`buildObject("[2]", "${STRING}", null) should return [undefined, undefined, "${STRING}"]`, () => {
        const r = FormUtils.buildObject("[2]", STRING, null);
        expect(r).toEqual([undefined, undefined, STRING]);
    });

    test(`buildObject("[][]", "${STRING}", null) should return [["${STRING}"]]`, () => {
        const r = FormUtils.buildObject("[][]", STRING, null);
        expect(r).toEqual([[STRING]]);
    });

    test(`buildObject("[][0]", "${STRING}", null) should return [["${STRING}"]]`, () => {
        const r = FormUtils.buildObject("[][0]", STRING, null);
        expect(r).toEqual([[STRING]]);
    });

    test(`buildObject("[][2]", "${STRING}", null) should return [[undefined,undefined,${STRING}]]`, () => {
        const r = FormUtils.buildObject("[][2]", STRING, null);
        expect(r).toEqual([[undefined, undefined, STRING]]);
    });

    test(`buildObject("[2][]", "${STRING}", null) should return [undefined,undefined,[${STRING}]]`, () => {
        const r = FormUtils.buildObject("[2][]", STRING, null);
        expect(r).toEqual([undefined, undefined, [STRING]]);
    });

    test(`buildObject("[2][2]", "${STRING}", null) should return [undefined,undefined,[undefined,undefined, ${STRING}]]`, () => {
        const r = FormUtils.buildObject("[2][2]", STRING, null);
        expect(r).toEqual([undefined, undefined, [undefined, undefined, STRING]]);
    });

    // Testing with object

    test(`buildObject("[a]", ${INTEGER}, null) should return {a: ${INTEGER}}`, () => {
        const r = FormUtils.buildObject("[a]", INTEGER, null);
        expect(r).toEqual({a: INTEGER});
    });

    test(`buildObject("[a]", "${STRING}", null) should return {a: "${STRING}"}`, () => {
        const r = FormUtils.buildObject("[a]", STRING, null);
        expect(r).toEqual({a: STRING});
    });

    // Testing with array and object

    test(`buildObject("[a][]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
        const r = FormUtils.buildObject("[a][]", STRING, null);
        expect(r).toEqual({a: [STRING]});
    });

    test(`buildObject("[a][0]", "${STRING}", null) should return {a:["${STRING}"]}`, () => {
        const r = FormUtils.buildObject("[a][0]", STRING, null);
        expect(r).toEqual({a: [STRING]});
    });

    test(`buildObject("[a][2]", "${STRING}", null) should return {a:[undefined,undefined,"${STRING}"]}`, () => {
        const r = FormUtils.buildObject("[a][2]", STRING, null);
        expect(r).toEqual({a: [undefined, undefined, STRING]});
    });

    test(`buildObject("[a][][b][][text]", "${STRING}", null) should return {a:[{b:[{text:"${STRING}"]}]}`, () => {
        const r = FormUtils.buildObject("[a][][b][][text]", STRING, null);
        expect(r).toEqual({a: [{b: [{text: STRING}]}]});
    });

    test(`buildObject("[a][][b][0][c][2][text]", "${STRING}", null) should return {a:[{b:[{c:[undefined,undefined,{text:"${STRING}"}]}]}]}`, () => {
        const r = FormUtils.buildObject("[a][][b][0][c][2][text]", STRING, null);
        expect(r).toEqual({a: [{b: [{c: [undefined, undefined, {text: STRING}]}]}]});
    });

    let obj = {a: [0, 1, 2]};
    test(`buildObject("[a][]", "${STRING}", ${JSON.stringify(obj)}) should return {a:[0,1,2,"${STRING}"]}`, () => {
        const r = FormUtils.buildObject("[a][]", STRING, obj);
        expect(r).toEqual({a: [0, 1, 2, STRING]});
    });

    let obj1 = {a: [0, 1, 2]};
    test(`buildObject("[a][1]", "${STRING}", ${JSON.stringify(obj1)}) should return {a:[0,"${STRING}",2]}`, () => {
        const r = FormUtils.buildObject("[a][1]", STRING, obj1);
        expect(r).toEqual({a: [0, STRING, 2]});
    });

    let obj2 = {a: [0, 1, 2]};
    test(`buildObject("[b][text]", "${STRING}", ${JSON.stringify(obj2)}) should return {a:[0,1,2],b:{text:"${STRING}"}}`, () => {
        const r = FormUtils.buildObject("[b][text]", STRING, obj2);
        expect(r).toEqual({a: [0, 1, 2], b: {text: STRING}});
    });
});

describe("contains()", () => {

    it(`contains([], null) should return false`, () => {
        expect(FormUtils.contains([], null)).toEqual(false);
    });

    it(`contains([null], null) should return true`, () => {
        expect(FormUtils.contains([null], null)).toEqual(true);
    });

    it(`contains(["a"], null) should return false`, () => {
        expect(FormUtils.contains(["a"], null)).toEqual(false);
    });

    it(`contains(["a", null], "a") should return true`, () => {
        expect(FormUtils.contains(["a", null], "a")).toEqual(true);
    });

    it(`contains([true], true) should return true`, () => {
        expect(FormUtils.contains([true], true)).toEqual(true);
    });

    it(`contains([false], false) should return true`, () => {
        expect(FormUtils.contains([false], false)).toEqual(true);
    });

    it(`contains([1], "1") should return false`, () => {
        expect(FormUtils.contains([1], "1")).toEqual(false);
    });

    it(`contains([1], 1) should return true`, () => {
        expect(FormUtils.contains([1], 1)).toEqual(true);
    });
});

describe("extend()", () => {

    it(`extend(null, null) should return null`, () => {
        expect(FormUtils.extend(null, null)).toEqual(null);
    });

    it(`extend(null, {a: true}) should return an object`, () => {
        expect(FormUtils.extend(null, {a: true})).toEqual({a: true});
    });

    it(`extend({a: true}, null) should return an object`, () => {
        expect(FormUtils.extend({a: true}, null)).toEqual({a: true});
    });

    it(`extend({a: true}, {a: false}) should merge objects`, () => {
        expect(FormUtils.extend({a: true}, {a: false})).toEqual({a: false});
        expect(FormUtils.extend({a: true}, {b: false})).toEqual({a: true, b: false});
    });

    it(`extend({a: true}, {b: {c: false}}) should merge objects recursively`, () => {
        expect(FormUtils.extend({a: true}, {b: {c: false}})).toEqual({a: true, b: {c: false}});
    });
});

describe("parseBoolean()", () => {

    test(`parseBoolean(null) should return null`, () => {
        expect(FormUtils.parseBoolean(null)).toEqual(null);
    });

    test(`parseBoolean(undefined) should return null`, () => {
        expect(FormUtils.parseBoolean(undefined)).toEqual(null);
    });

    test(`parseBoolean(true) should return true`, () => {
        expect(FormUtils.parseBoolean(true)).toEqual(true);
    });

    test(`parseBoolean("${TRUE}") should return true`, () => {
        expect(FormUtils.parseBoolean(TRUE)).toEqual(true);
    });

    test(`parseBoolean(false) should return false`, () => {
        expect(FormUtils.parseBoolean(false)).toEqual(false);
    });

    test(`parseBoolean("${FALSE}") should return false`, () => {
        expect(FormUtils.parseBoolean(FALSE)).toEqual(false);
    });
});

describe("parseForm()", () => {

    describe("Parsing fields with options {parseValues: true, smartParsing: true}", () => {

        test(`parseForm(form, options) should not return values of unknown fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({});
        });

        test(`parseForm(form, options) should parse values based on data-type attribute if present`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createNumberInput({
                dataset: {type: "string"},
                name: "number",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({number: INTEGER_STRING});
        });

        test(`parseForm(form, options) should return values of checked checkboxes`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createCheckbox({
                checked: true,
                name: "checkboxes[]",
                value: "A"
            }));
            form.appendChild(TestUtils.createCheckbox({
                checked: false,
                name: "checkboxes[]",
                value: "B"
            }));
            form.appendChild(TestUtils.createCheckbox({
                checked: true,
                name: "checkboxes[]",
                value: "C"
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({
                checkboxes: [
                    form.elements["0"].value,
                    form.elements["2"].value,
                ]
            });
        });

        test(`parseForm(form, options) should return values of checked radios`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createRadio({
                checked: false,
                name: "radio",
                value: "A"
            }));
            form.appendChild(TestUtils.createRadio({
                checked: true,
                name: "radio",
                value: "B"
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({radio: form.elements["1"].value});
        });

        test(`parseForm(form, options) should return values of file inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createFileInput({
                name: "file",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({file: STRING});
        });

        test(`parseForm(form, options) should return values of hidden inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createHiddenInput({
                name: "hidden",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({hidden: STRING});
        });

        test(`parseForm(form, options) should return values of number inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createNumberInput({
                name: "number",
                value: INTEGER
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({number: INTEGER});
        });

        test(`parseForm(form, options) should return values of email inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "email",
                type: "email",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({email: STRING});
        });

        test(`parseForm(form, options) should return values of password inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createPasswordInput({
                name: "password",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({password: STRING});
        });

        test(`parseForm(form, options) should return values of single select lists`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createSelect({
                name: "select",
                options: [
                    {value: "A"},
                    {value: "B", selected: true}
                ]
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({select: "B"});
        });

        test(`parseForm(form, options) should return values of multiple select lists`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createSelect({
                multiple: true,
                name: "select",
                options: [
                    {value: "A"},
                    {value: "B", selected: true},
                    {value: "C", selected: true}
                ]
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({select: ["B", "C"]});
        });

        test(`parseForm(form, options) should return values of text inputs`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "text",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({text: STRING});
        });

        test(`parseForm(form, options) should return values of textarea fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextarea({
                name: "textarea",
                value: STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
            expect(r).toEqual({textarea: STRING});
        });
    });

    describe("Parsing options", () => {

        describe("cleanFunction option", () => {

            test(`parseForm(form, {cleanFunction: Function}) should execute clean function on string values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: "<script src=\"http://hacked.net\"></script>"
                }));

                const r = FormUtils.parseForm(form, {
                    cleanFunction: function (value) {
                        return value.replace(/<\/?[^>]+>/gm, "");
                    }
                });
                expect(r).toEqual({text: ""});
            });

            test(`parseForm(form, {cleanFunction: null}) should not execute clean function on string values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: "<script src=\"http://hacked.net\"></script>"
                }));

                const r = FormUtils.parseForm(form, {
                    cleanFunction: null
                });
                expect(r).toEqual({text: "<script src=\"http://hacked.net\"></script>"});
            });
        });

        describe("ignoreButtons option", () => {

            test(`parseForm(form, {ignoreButtons: true}) should not return values of buttons`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createButton({
                    name: "button",
                    type: "button",
                    value: "button"
                }));
                form.appendChild(TestUtils.createButton({
                    name: "reset",
                    type: "reset",
                    value: "reset"
                }));
                form.appendChild(TestUtils.createButton({
                    name: "submit",
                    type: "submit",
                    value: "submit"
                }));

                const r = FormUtils.parseForm(form, {ignoreButtons: true});
                expect(r).toEqual({});
            });

            test(`parseForm(form, {ignoreButtons: false}) should return values of buttons`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createButton({
                    name: "button",
                    type: "button",
                    value: "button"
                }));
                form.appendChild(TestUtils.createButton({
                    name: "reset",
                    type: "reset",
                    value: "reset"
                }));
                form.appendChild(TestUtils.createButton({
                    name: "submit",
                    type: "submit",
                    value: "submit"
                }));

                const r = FormUtils.parseForm(form, {ignoreButtons: false});
                expect(r).toEqual({
                    button: "button",
                    reset: "reset",
                    submit: "submit"
                });
            });
        });

        describe("ignoreDisabled option", () => {

            test(`parseForm(form, {ignoreDisabled: true}) should not return disabled fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    disabled: true,
                    name: "disabled",
                    value: STRING
                }));

                const r = FormUtils.parseForm(form, {ignoreDisabled: true});
                expect(r).toEqual({});
            });

            test(`parseForm(form, {ignoreDisabled: false}) should return disabled fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    disabled: true,
                    name: "disabled",
                    value: STRING
                }));

                const r = FormUtils.parseForm(form, {ignoreDisabled: false});
                expect(r).toEqual({disabled: STRING});
            });
        });

        describe("ignoreEmpty option", () => {

            test(`parseForm(form, {ignoreEmpty: true}) should not return empty fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "empty",
                    value: ""
                }));

                const r = FormUtils.parseForm(form, {ignoreEmpty: true});
                expect(r).toEqual({});
            });

            test(`parseForm(form, {ignoreEmpty: false}) should return empty fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "empty",
                    value: ""
                }));

                const r = FormUtils.parseForm(form, {ignoreEmpty: false});
                expect(r).toEqual({empty: null});
            });
        });

        describe("ignoreUnchecked option", () => {

            test(`parseForm(form, {ignoreUnchecked: true}) should not return unchecked fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createCheckbox({
                    checked: false,
                    name: "checkbox",
                    value: STRING
                }));

                const r = FormUtils.parseForm(form, {ignoreUnchecked: true});
                expect(r).toEqual({});
            });

            test(`parseForm(form, {ignoreUnchecked: false}) should return unchecked fields`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createCheckbox({
                    checked: false,
                    name: "checkbox",
                    value: STRING
                }));

                const r = FormUtils.parseForm(form, {ignoreUnchecked: false});
                expect(r).toEqual({checkbox: null});
            });
        });

        describe("nullify option", () => {

            test(`parseForm(form, {nullify: true}) should replace empty string with null`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: " "
                }));

                const r = FormUtils.parseForm(form, {nullify: true, trimValues: true});
                expect(r).toEqual({text: null});
            });

            test(`parseForm(form, {nullify: false}) should not replace empty string with null`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: " "
                }));

                const r = FormUtils.parseForm(form, {nullify: false, trimValues: true});
                expect(r).toEqual({text: ""});
            });
        });

        describe("parseValues option", () => {

            test(`parseForm(form, {parseValues: true, smartParsing: false}) should parse all values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    dataset: {type: "boolean"},
                    name: "bool_true",
                    value: TRUE
                }));
                form.appendChild(TestUtils.createTextInput({
                    dataset: {type: "boolean"},
                    name: "bool_false",
                    value: FALSE
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "float",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "integer",
                    value: INTEGER_STRING
                }));

                const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: false});
                expect(r).toEqual({
                    bool_true: true,
                    bool_false: false,
                    float: FLOAT,
                    integer: INTEGER
                });
            });

            test(`parseForm(form, {parseValues: false}) should not parse any value`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    dataset: {type: "boolean"},
                    name: "bool_true",
                    value: TRUE
                }));
                form.appendChild(TestUtils.createTextInput({
                    name: "bool_false",
                    value: FALSE
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "float",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createNumberInput({
                    dataset: {type: "number"},
                    name: "integer",
                    value: INTEGER_STRING
                }));

                const r = FormUtils.parseForm(form, {parseValues: false});
                expect(r).toEqual({
                    bool_true: TRUE,
                    bool_false: FALSE,
                    float: FLOAT_STRING,
                    integer: INTEGER_STRING
                });
            });
        });

        describe("smartParsing option", () => {

            test(`parseForm(form, {smartParsing: true}) should parse values using type attribute`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "bool_true",
                    value: TRUE
                }));
                form.appendChild(TestUtils.createTextInput({
                    dataset: {type: "boolean"},
                    name: "bool_false",
                    value: FALSE
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "float",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createTextInput({
                    name: "float_text",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "integer",
                    value: INTEGER_STRING
                }));
                form.appendChild(TestUtils.createTextInput({
                    name: "integer_text",
                    value: INTEGER_STRING
                }));

                const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: true});
                expect(r).toEqual({
                    bool_true: TRUE,
                    bool_false: false,
                    float: FLOAT,
                    float_text: FLOAT_STRING,
                    integer: INTEGER,
                    integer_text: INTEGER_STRING
                });
            });

            test(`parseForm(form, {smartParsing: false}) should not parse values using type attribute`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "bool_true",
                    value: TRUE
                }));
                form.appendChild(TestUtils.createTextInput({
                    dataset: {type: "boolean"},
                    name: "bool_false",
                    value: FALSE
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "float",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createTextInput({
                    name: "float_text",
                    value: FLOAT_STRING
                }));
                form.appendChild(TestUtils.createNumberInput({
                    name: "integer",
                    value: INTEGER_STRING
                }));
                form.appendChild(TestUtils.createTextInput({
                    name: "integer_text",
                    value: INTEGER_STRING
                }));

                const r = FormUtils.parseForm(form, {parseValues: true, smartParsing: false});
                expect(r).toEqual({
                    bool_true: true,
                    bool_false: false,
                    float: FLOAT,
                    float_text: FLOAT,
                    integer: INTEGER,
                    integer_text: INTEGER
                });
            });
        });

        describe("trimValues option", () => {

            test(`parseForm(form, {trimValues: true}) should trim text values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: ` ${STRING} `
                }));

                const r = FormUtils.parseForm(form, {trimValues: true});
                expect(r).toEqual({text: STRING});
            });

            test(`parseForm(form, {trimValues: false}) should not trim text values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createTextInput({
                    name: "text",
                    value: ` ${STRING} `
                }));

                const r = FormUtils.parseForm(form, {trimValues: false});
                expect(r).toEqual({text: ` ${STRING} `});
            });

            test(`parseForm(form, {trimValues: true}) should not trim password values`, () => {
                const form = TestUtils.createForm();
                form.appendChild(TestUtils.createPasswordInput({
                    name: "password",
                    value: ` ${STRING} `
                }));

                const r = FormUtils.parseForm(form, {trimValues: true});
                expect(r).toEqual({password: ` ${STRING} `});
            });
        });
    });

    describe("Fields excluded from parsing", () => {

        test(`parseForm(form) should not parse email fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "email",
                type: "email",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({email: INTEGER_STRING});
        });

        test(`parseForm(form) should not parse file fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "file",
                type: "file",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({file: INTEGER_STRING});
        });

        test(`parseForm(form) should not parse password fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createPasswordInput({
                name: "password",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({password: INTEGER_STRING});
        });

        test(`parseForm(form) should not parse search fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "search",
                type: "search",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({search: INTEGER_STRING});
        });

        test(`parseForm(form) should not parse URL fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextInput({
                name: "url",
                type: "url",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({url: INTEGER_STRING});
        });

        test(`parseForm(form) should not parse textarea fields`, () => {
            const form = TestUtils.createForm();
            form.appendChild(TestUtils.createTextarea({
                name: "textarea",
                value: INTEGER_STRING
            }));

            const r = FormUtils.parseForm(form, {parseValues: true});
            expect(r).toEqual({textarea: INTEGER_STRING});
        });
    });
});

describe("parseNumber()", () => {

    test(`parseNumber(null) should return null`, () => {
        expect(FormUtils.parseNumber(null)).toEqual(null);
    });

    test(`parseNumber(undefined) should return null`, () => {
        expect(FormUtils.parseNumber(undefined)).toEqual(null);
    });

    test(`parseNumber(${FLOAT}) should return a float`, () => {
        expect(FormUtils.parseNumber(FLOAT)).toEqual(FLOAT);
    });

    test(`parseNumber("${FLOAT_STRING}") should return a float`, () => {
        expect(FormUtils.parseNumber(FLOAT_STRING)).toEqual(FLOAT);
    });

    test(`parseNumber("-${FLOAT_STRING}") should return a negative float`, () => {
        expect(FormUtils.parseNumber(`-${FLOAT_STRING}`)).toEqual(-FLOAT);
    });

    test(`parseNumber("+${FLOAT_STRING}") should return a positive float`, () => {
        expect(FormUtils.parseNumber(`+${FLOAT_STRING}`)).toEqual(FLOAT);
    });

    test(`parseNumber("${FLOAT_STRING_COMMA}") should return a float`, () => {
        expect(FormUtils.parseNumber(FLOAT_STRING_COMMA)).toEqual(FLOAT);
    });

    test(`parseNumber(${INTEGER}) should return an integer`, () => {
        expect(FormUtils.parseNumber(INTEGER)).toEqual(INTEGER);
    });

    test(`parseNumber("${INTEGER_STRING}") should return an integer`, () => {
        expect(FormUtils.parseNumber(INTEGER_STRING)).toEqual(INTEGER);
    });

    test(`parseNumber("-${INTEGER_STRING}") should return a negative integer`, () => {
        expect(FormUtils.parseNumber(`-${INTEGER_STRING}`)).toEqual(-INTEGER);
    });

    test(`parseNumber("+${INTEGER_STRING}") should return a positive integer`, () => {
        expect(FormUtils.parseNumber(`+${INTEGER_STRING}`)).toEqual(INTEGER);
    });
});

describe("parseValue()", () => {

    test(`parseValue() should return undefined`, () => {
        expect(FormUtils.parseValue()).toEqual(undefined);
    });

    test(`parseValue(null) should return null`, () => {
        expect(FormUtils.parseValue(null)).toEqual(null);
    });

    test(`parseValue('') should return ''`, () => {
        expect(FormUtils.parseValue("")).toEqual("");
    });

    test(`parseValue("${TRUE}") should return true`, () => {
        expect(FormUtils.parseValue(TRUE)).toEqual(true);
    });

    test(`parseValue("${TRUE}", "auto") should return true`, () => {
        expect(FormUtils.parseValue(TRUE, "auto")).toEqual(true);
    });

    test(`parseValue("${TRUE}", "boolean") should return true`, () => {
        expect(FormUtils.parseValue(TRUE, "boolean")).toEqual(true);
    });

    test(`parseValue("${TRUE}", "number") should return null`, () => {
        expect(FormUtils.parseValue(TRUE, "number")).toEqual(null);
    });

    test(`parseValue("${TRUE}", "string") should return "true"`, () => {
        expect(FormUtils.parseValue(TRUE, "string")).toEqual(TRUE);
    });

    test(`parseValue("${FALSE}") should return false`, () => {
        expect(FormUtils.parseValue(FALSE)).toEqual(false);
    });

    test(`parseValue("${FALSE}", "auto") should return false`, () => {
        expect(FormUtils.parseValue(FALSE, "auto")).toEqual(false);
    });

    test(`parseValue("${FALSE}", "boolean") should return false`, () => {
        expect(FormUtils.parseValue(FALSE, "boolean")).toEqual(false);
    });

    test(`parseValue("${FALSE}", "number") should return null`, () => {
        expect(FormUtils.parseValue(FALSE, "number")).toEqual(null);
    });

    test(`parseValue("${FALSE}", "string") should return "false"`, () => {
        expect(FormUtils.parseValue(FALSE, "string")).toEqual(FALSE);
    });

    test(`parseValue("${FLOAT_STRING}") should return ${FLOAT}`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING)).toEqual(FLOAT);
    });

    test(`parseValue("${FLOAT_STRING}", "auto") should return ${FLOAT}`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING, "auto")).toEqual(FLOAT);
    });

    test(`parseValue("${FLOAT_STRING}", "boolean") should return null`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING, "boolean")).toEqual(null);
    });

    test(`parseValue("${FLOAT_STRING}", "number") should return ${FLOAT}`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING, "number")).toEqual(FLOAT);
    });

    test(`parseValue("${FLOAT_STRING}", "string") should return "${FLOAT}"`, () => {
        expect(FormUtils.parseValue(FLOAT_STRING, "string")).toEqual(FLOAT_STRING);
    });

    test(`parseValue("${INTEGER_STRING}") should return ${INTEGER}`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING)).toEqual(INTEGER);
    });

    test(`parseValue("${INTEGER_STRING}", "auto") should return ${INTEGER}`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING, "auto")).toEqual(INTEGER);
    });

    test(`parseValue("${INTEGER_STRING}", "boolean") should return null`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING, "boolean")).toEqual(null);
    });

    test(`parseValue("${INTEGER_STRING}", "number") should return ${INTEGER}`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING, "number")).toEqual(INTEGER);
    });

    test(`parseValue("${INTEGER_STRING}", "string") should return "${INTEGER}"`, () => {
        expect(FormUtils.parseValue(INTEGER_STRING, "string")).toEqual(INTEGER_STRING);
    });

    test(`parseValue("${STRING}") should return "${STRING}"`, () => {
        expect(FormUtils.parseValue(STRING)).toEqual(STRING);
    });

    test(`parseValue("${STRING}", "auto") should return "${STRING}"`, () => {
        expect(FormUtils.parseValue(STRING, "auto")).toEqual(STRING);
    });

    test(`parseValue("${STRING}", "boolean") should return null`, () => {
        expect(FormUtils.parseValue(STRING, "boolean")).toEqual(null);
    });

    test(`parseValue("${STRING}", "number") should return null`, () => {
        expect(FormUtils.parseValue(STRING, "number")).toEqual(null);
    });

    test(`parseValue("${STRING}", "string") should return "${STRING}"`, () => {
        expect(FormUtils.parseValue(STRING, "string")).toEqual(STRING);
    });

    describe("Parsing value with extra spaces", () => {

        test(`parseValue(" ${FALSE} ", "boolean") should return false`, () => {
            expect(FormUtils.parseValue(` ${FALSE} `, "boolean")).toEqual(false);
        });

        test(`parseValue(" ${TRUE} ", "boolean") should return true`, () => {
            expect(FormUtils.parseValue(` ${TRUE} `, "boolean")).toEqual(true);
        });

        test(`parseValue(" ${FLOAT_STRING} ", "number") should return "${FLOAT}"`, () => {
            expect(FormUtils.parseValue(` ${FLOAT_STRING} `, "number")).toEqual(FLOAT);
        });

        test(`parseValue(" ${FLOAT_STRING_COMMA} ", "number") should return "${FLOAT}"`, () => {
            expect(FormUtils.parseValue(` ${FLOAT_STRING_COMMA} `, "number")).toEqual(FLOAT);
        });

        test(`parseValue(" ${INTEGER_STRING} ", "number") should return "${INTEGER}"`, () => {
            expect(FormUtils.parseValue(` ${INTEGER_STRING} `, "number")).toEqual(INTEGER);
        });

        test(`parseValue(" ${STRING} ", "string") should return " ${STRING} "`, () => {
            expect(FormUtils.parseValue(` ${STRING} `, "string")).toEqual(` ${STRING} `);
        });
    });
});

