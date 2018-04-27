/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.inputBase
 * @augments oj.editableValue
 * @abstract
 * @ojsignature [{
 *                target: "Type",
 *                value: "abstract class inputBase<V, SP extends inputBaseSettableProperties<V, SV>, SV= V, RV= V> extends editableValue<V, SP, SV, RV>"
 *               },
 *               {
 *                target: "Type",
 *                value: "inputBaseSettableProperties<V, SV=V, RV= V> extends editableValueSettableProperties<V, SV, RV>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojshortdesc Abstract InputBase element
 * @ojrole input
 * @hideconstructor
 * @ojtsimport ojvalidation-base
 * @ojtsimport ojvalidation-datetime
 * @ojtsimport ojvalidation-number
 *
 * @classdesc
 * <h3 id="inputBaseOverview-section">
 *   Abstract inputBase component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputBaseOverview-section"></a>
 * </h3>
 * 
 * <p>Description: The inputBase component takes care of general needs of other input components [i.e. text + password]
 * 
 * @param {Object=} options a map of option-value pairs to set on the component
 */
oj.__registerWidget("oj.inputBase", $['oj']['editableValue'], 
{
  version : "1.0.0", 
  widgetEventPrefix : "oj",
  
  /**
   * Convenience Array which one can extend to set the attribute to a mandatory value if it doesn't exist or is set to something else 
   * [
   * {
   *    "attr"              : string - attribute associated to the task
   *    "setMandatory"      : value it must be set to [i.e. type="text"]
   * }
   * ]
   * 
   * Examples:
   * 1) [{"attr": "type", "setMandatory": "text"}]
   * 
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _ATTR_CHECK : [],
  
  /** 
   * Class names to be applied to this.element()
   * 
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _CLASS_NAMES : "",
  
  /** 
   * Class names to be applied to this.widget()
   * 
   * Note that if this value is defined then the this.element will be wrapped with a root dom element
   * 
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _WIDGET_CLASS_NAMES : "",
  
  /** 
   * Class names to be applied to the dom that wraps the input and trigger elements. It is a child
   * of the root dom element - this.widget().
   * 
   * An element can be wrapped by a root dom element OR by both a root dom element and this extra
   * wrapper dom. the time and date pickers have two wrappers since we want to do an extra
   * wrapping when an input has trigger elements (date icon, for example). This is needed so we
   * can add extra dom to the root dom element for inline messaging.
   * 
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES : "",
  
  /** 
   * Array to be used for oj.EditableValueUtils.initializeOptionsFromDom attribute is the html-5 dom attribute name.
   * If option is different, like in the case of readonly (readonly html vs readOnly 
   * (camelcase) component option), specify both attribute and option.
   * NOTE: This is for the widget components only. Do not add custom element attributes here.
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _GET_INIT_OPTIONS_PROPS_FOR_WIDGET: [{attribute: 'disabled', validateOption: true},
                            {attribute: 'pattern'},
                            {attribute: 'placeholder'},
                            {attribute: 'value'},
                            {attribute: 'readonly', option: 'readOnly', 
                             validateOption: true},
                            {attribute: 'required', coerceDomValue: true, validateOption: true},
                            {attribute: 'title'}],
  /**
   * If defined will append a div element containing text to be read out by Jaws when focus is placed on the input element 
   * and the value will be used to locate the translated text to be read out by Jaws.
   * 
   * Note the component must also be wrapped
   * 
   * @expose
   * @memberof! oj.inputBase
   * @private
   */
  _INPUT_HELPER_KEY: "",
  
  _BLUR_HANDLER_KEY: "blur",
  _KEYDOWN_HANDLER_KEY: "keydown",
  _KEYUP_HANDLER_KEY: "keyup",
  _INPUT_HANDLER_KEY: "input",
  _DROP_HANDLER_KEY: "drop",
  
  options : 
  {
    /**
     * <p>
     * When <code class="prettyprint">converter</code> property changes due to programmatic
     * intervention, the element performs various tasks based on the current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>Any cached converter instance is cleared and new converter created. The converter hint is
     * pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when <code class="prettyprint">converter</code> property changes, the
     * display value is refreshed.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">converter</code> property changes then all element messages are
     * cleared and full validation run using the current display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated, and the error is shown. 
     *   The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">onValueChanged</code>
     *   event to clear custom errors. The
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when converter property changes, the
     *   display value is again refreshed with the formatted value provided by converter.</li>
     * </ul>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.
     * Page authors can 
     * choose to clear it explicitly when setting the converter option.</li>
     * </ul>
     * </p>
     * @ojfragment inputBaseConverterOptionDoc
     * @memberof oj.inputBase
     **/
    /** 
     * Dictates component's autocomplete state. 
     * This attribute indicates whether the value of the control can be automatically 
     * completed by the browser.
     * 
     * @example <caption>Initialize component with <code class="prettyprint">autocomplete</code> attribute:</caption>
     * &lt;oj-some-element autocomplete="on">&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">autocomplete</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.autocomplete;
     *
     * // setter
     * myComp.autocomplete = "on";
     * 
     * @expose 
     * @type {string}
     * @ojvalue {string} "on" enable autofill
     * @ojvalue {string} "off" disable autofill
     * @alias autocomplete
     * @default "on"
     * @instance
     * @since 4.0.0
     * @memberof oj.inputBase
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    autocomplete: undefined,
     /** 
     * Autofocus is a Boolean that reflects the autofocus attribute, If it is set to true 
     * then the associated component  will get input focus when the page is loaded.
     * Setting this property doesn't set the focus to the component: 
     * it tells the browser to focus to it when the element is inserted in the document. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">autofocus</code> attribute:</caption>
     * &lt;oj-some-element autofocus>&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">autofocus</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.autofocus;
     *
     * // setter
     * myComp.autofocus = false;
     * 
     * @expose 
     * @type {boolean}
     * @alias autofocus
     * @default false
     * @instance
     * @since 4.0.0
     * @memberof oj.inputBase
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    autofocus: false,    
    /** 
     * It indicates the name of the component. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">name</code> attribute:</caption>
     * &lt;oj-some-element name="myName">&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">name</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.name;
     *
     * // setter
     * myComp.name = myName;
     * 
     * @expose 
     * @type {string}
     * @default ""
     * @alias name
     * @instance
     * @since 4.0.0
     * @memberof oj.inputBase
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    name: "",
    /**
     * The placeholder text to set on the element.
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> attribute:</caption>
     * &lt;oj-some-element placeholder="User Name">&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
     * // getter
     * var myPh = myComp.placeholder;
     *
     * // setter
     * myComp.placeholder = myPlaceholder;
     * 
     * If the attribute is not set and if a converter is set then the
     * converter hint is used. See displayOptions for details.
     * 
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.inputBase
     * @type {string}
     */    
    placeholder: "",    
     /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving 
     * the current value from the input field in string form. The main consumer of
     * <code class="prettyprint">rawValue</code> is a converter.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event, 
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed. 
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2', 
     * ..., and finally '1,200'. Then when the user blurs or presses 
     * Enter the <code class="prettyprint">value</code> property gets converted and validated
     * (if there is a converter or validators) and then gets updated if valid.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.inputBase
     * @type {string}
     * @ojsignature {target: "Type", value: "RV"}
     * @since 1.2.0
     * @readonly
     * @ojwriteback
     */
    rawValue: "",     
    /** 
     * Dictates component's readonly state. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">readonly</code> attribute:</caption>
     * &lt;oj-some-element readonly>&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.readonly;
     *
     * // setter
     * myComp.readonly = false;
     * 
     * @expose 
     * @type {boolean}
     * @alias readonly
     * @default false
     * @instance
     * @memberof! oj.inputBase
     */
    readOnly: false,
    /** 
     * Whether the component is required or optional. When required is set to true, an implicit 
     * required validator is created using the validator factory - 
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED).createValidator()</code>.
     * 
     * Translations specified using the <code class="prettyprint">translations.required</code> attribute 
     * and the label associated with the component, are passed through to the options parameter of the 
     * createValidator method. 
     * 
     * <p>
     * When <code class="prettyprint">required</code> property changes due to programmatic intervention, 
     * the component may clear messages and run validation, based on the current state it's in. </br>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on 
     * the value property. This is to ensure errors are not flagged unnecessarily.
     * </li>
     * <li>if component is invalid and has deferred messages when required is set to false, then 
     * component messages are cleared but no deferred validation is run.
     * </li>
     * <li>if component is invalid and currently showing invalid messages when required is set, then 
     * component messages are cleared and normal validation is run using the current display value. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   property is not updated and the error is shown. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code> 
     *   event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * 
     * </p>
     * 
     * @ojvalue {boolean} false - implies a value is not required to be provided by the user. 
     * This is the default.
     * @ojvalue {boolean} true - implies a value is required to be provided by user and the 
     * input's label will render a required icon. Additionally a required validator - 
     * {@link oj.RequiredValidator} - is implicitly used if no explicit required validator is set. 
     * An explicit required validator can be set by page authors using the validators attribute. 
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">required</code> attribute:</caption>
     * &lt;oj-some-element required>&lt;/oj-some-element><br/>
     * 
     * @example <caption>Customize messages and hints used by implicit required validator when 
     * <code class="prettyprint">required</code> attribute is set:</caption> 
     * &lt;oj-some-element required translations='{"required": {
     *                 "hint": "custom: enter at least 3 alphabets",
     *                 "messageSummary": "custom: \'{label}\' is Required", 
     *                 "messageDetail": "custom: please enter a valid value for \'{label}\'"}}'>
     * &lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
     * // getter
     * var rq = myComp.required;
     *
     * // setter
     * myComp.required = false;
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.inputBase
     * @type {boolean}
     * @default false
     * @since 0.7
     * @see #translations
     */
    required: false,

    /** 
     * List of validators used by component when performing validation. Each item is either an 
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the 
     * properties listed below. Implicit validators created by a component when certain attributes 
     * are present (e.g. <code class="prettyprint">required</code> attribute), are separate from 
     * validators specified through this attribute. At runtime when the component runs validation, it 
     * combines the implicit validators with the list specified through this attribute. 
     * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the 
     * 'validatorHint' property set on the <code class="prettyprint">display-options</code> 
     * attribute. 
     * </p>
     * 
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic 
     * intervention, the component may decide to clear messages and run validation, based on the 
     * current state it is in. </br>
     * 
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to 
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when validators changes, component does nothing other than the 
     * steps it always performs.</li>
     * <li>if component is invalid and is showing messages when 
     * <code class="prettyprint">validators</code> changes then all component messages are cleared 
     * and full validation run using the display value on the component. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   property is not updated and the error is shown. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code> 
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when validators changes, it does 
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     * 
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can 
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer 
     * to {@link oj.ValidatorFactory}. <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp'}]}</code>
     * @property {Object=} options - optional Object literal of options that the validator expects. 
     * <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp', options: {pattern: '[a-zA-Z0-9]{3,}'}}]}</code>

     * 
     * @example <caption>Initialize the component with validator object literal:</caption>
     * &lt;oj-some-element validators='[{"type": "regExp", "options": {
     *                     "pattern": "[a-zA-Z0-9]{3,}", 
     *                     "messageDetail": "You must enter at least 3 letters or numbers"}}]'>
     * &lt;/oj-some-element>      
     * 
     * NOTE: oj.Validation.validatorFactory('numberRange') returns the validator factory that is used 
     * to instantiate a range validator for numbers.
     * 
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'}); 
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * var validators = [validator1, validator2]<br/>
     * ...
     * &lt;oj-some-element validators='[[validators]]'>
     * &lt;/oj-some-element>      
     * 
     * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
     * // getter
     * var validators = myComp.validators;
     *
     * // setter
     * myComp.validators = myValidators;
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.inputBase
     * @ojsignature  { target: "Type", value: "Array<oj.Validator<V>|oj.Validation.FactoryRegisteredValidatorOrConverter>|null"}
     * @type {Array|null}
     */    
    validators: undefined
  },
  
  /**
   * The base method needs to be overriden so that one can perform attribute check/set [i.e. ojInputText can only have type="text"] 
   * 
   * @protected
   * @override
   * @param {Object} element - jQuery selection to save attributes for
   * @instance
   * @memberof! oj.inputBase
   */
  _SaveAttributes : function (element)
  {
    var ret = this._superApply(arguments);
    
    this._processAttrCheck();
    
    return ret;
  },
  
  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _InitOptions: function(originalDefaults, constructorOptions)
  {
    this._super(originalDefaults, constructorOptions);
    if (!this._IsCustomElement())
    {
      oj.EditableValueUtils.initializeOptionsFromDom(
        this._GET_INIT_OPTIONS_PROPS_FOR_WIDGET, constructorOptions, this);
    }
  },

  /**
   * 1) Initializes the options
   * 2) If needed wraps the input element, 
   * 
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _ComponentCreate : function()
  {
    var node = this.element, 
        ret = this._superApply(arguments),
        savedAttributes = this._GetSavedAttributes(node),
        readOnly = this.options['readOnly'];
    
    this._rtl = this._GetReadingDirection() === "rtl";
    
    // update element state using options
    if (typeof readOnly === "boolean") 
    {
      this.element.prop("readonly", readOnly);
    }
    
    if (this._DoWrapElement())
    {
      this._wrapElementInRootDomElement();
      // may need to do an extra wrapping if the element has triggers
      if (this._DoWrapElementAndTriggers())
      {
        this._WrapElement();
      }
      this._focusable({
        'element': this._wrapper, 
        'applyHighlight': true
      });
    }
    else
    {
      this._focusable({
        'element': this.element, 
        'applyHighlight': true
      });
    }

    
    // remove pattern attribute to not trigger html5 validation + inline bubble
//    if ('pattern' in savedAttributes)
//    {
//      node.removeAttr('pattern');
//    }
    
    this._defaultRegExpValidator = {};
    this._eventHandlers = null;
    return ret;
  },
  
  /**
   * 1) Updates component state based on the option values
   * 2) Adds the classname to the element [intentionally postponing till this process since the component might need to 
   *    reset this.element for some reason]
   * 3) Hooks up the blur handler
   * 4) If necessary appends an input helper to be read out by Jaws accessibility reader
   * 
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */        
  _AfterCreate : function () 
  {
    var ret = this._superApply(arguments),
        options = ["disabled", "readOnly"],
        self = this;
    var widgetId;
    
    this._refreshRequired(this.options['required']);
    
    if(this._CLASS_NAMES) 
    {
      this.element.addClass(this._CLASS_NAMES);
    }
    
    //attach handlers such as blur, keydown, and drop. placed in a function so to detach the handlers as well
    //when the options change
    this._attachDetachEventHandlers();
    
    this._AppendInputHelper();
    
    $.each(options, function(index, ele)
    {
      if(self.options[ele]) 
      {
        self._processDisabledReadOnly(ele, self.options[ele]);
      }
    });
    
    if (this._IsCustomElement())
    {
      // if it is a custom element, then set the sub-id on the input so if they have a oj-label
      // pointing to it with the 'for' attrbiute, JAWS will read the label.
      widgetId = this.widget().attr("id");
      if (widgetId)
        oj.EditableValueUtils.setSubIdForCustomLabelFor(this._GetContentElement()[0], widgetId);
    }
    return ret;
  },
  /**
   * Whether the component is required.
   * 
   * @return {boolean} true if required; false
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   * @override
   */
  _IsRequired : function () 
  {
    return this.options['required'];
  },
  /**
   * Performs post processing after required option is set by taking the following steps.
   * 
   * - if component is invalid and has messgesShown -> required: false/true -> clear component errors; 
   * run full validation with UI value (we don't know if the UI error is from a required validator 
   * or something else);<br/>
   * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is 
   * updated<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to valueChanged to clear custom errors.<br/>
   * 
   * - if component is invalid and has messagesHidden -> required: false -> clear component 
   * errors; no deferred validation is run.<br/>
   * - if component has no error -> required: true -> run deferred validation (we don't want to flag 
   * errors unnecessarily)<br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @param {string} option
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionRequired : oj.EditableValueUtils._AfterSetOptionRequired,
  
  /**
   * When validators option changes, take the following steps.
   * 
   * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
   * - if component is valid -> validators changes -> no change<br/>
   * - if component is invalid has messagesShown -> validators changes -> clear all component 
   * messages and re-run full validation on displayValue. if there are no errors push value to 
   * model;<br/>
   * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change 
   * the required-ness of component <br/>
   * - messagesCustom is not cleared.<br/>
   * 
   * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern, 
   * etc. Components can call this method when these options change.
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionValidators : oj.EditableValueUtils._AfterSetOptionValidators,
  /**
   * Performs post processing after converter option changes by taking the following steps.
   * 
   * - always push new converter hint to messaging <br/>
   * - if component has no errors -> refresh UI value<br/>
   * - if component is invalid has messagesShown -> clear all component errors and run full 
   * validation using display value. <br/>
   * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is 
   * updated.<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to valueChanged to clear custom errors.<br/>
   * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred 
   * validations. <br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AfterSetOptionConverter : oj.EditableValueUtils._AfterSetOptionConverter, 
  /**
   * Clears the cached converter stored in _converter and pushes new converter hint to messaging.
   * Called when convterer option changes 
   * @memberof! oj.inputBase
   * @instance
   * @protected 
   */
  _ResetConverter : oj.EditableValueUtils._ResetConverter,  
  /**
   * Returns the normalized converter instance.
   * 
   * @return {Object} a converter instance or null
   * @memberof! oj.inputBase
   * @instance
   * @protected 
   */
  _GetConverter : oj.EditableValueUtils._GetConverter,    
  /**
   * This returns an array of all validators 
   * normalized from the validators option set on the component. <br/>
   * @return {Array} of validators. 
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _GetNormalizedValidatorsFromOption : oj.EditableValueUtils._GetNormalizedValidatorsFromOption,
  
  _processDisabledReadOnly : function (key, value) 
  {
    if (key === "disabled")
    {
      this.element.prop("disabled", value);
    }
    
    if (key === "readOnly")
    {
      this.element.prop("readonly", value);
      this._refreshStateTheming("readOnly", value);
    }
    
    if(key === "disabled" || key === "readOnly") 
    {
      this._attachDetachEventHandlers();
    }
  },
  
  /**
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @override
   */
  _setOption : function (key, value, flags)
  {
    var retVal = this._superApply(arguments);
    
    if(key === "disabled" || key === "readOnly") 
    {
      this._processDisabledReadOnly(key, value);
    }

    if (key === "pattern")
    {
      this._defaultRegExpValidator[oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP] = this._getImplicitRegExpValidator();
      this._AfterSetOptionValidators();
    }
    

    
    return retVal;
  },
  /**
   * Performs post processing after _SetOption() is called. Different options when changed perform
   * different tasks. See _AfterSetOption[OptionName] method for details.
   *
   * @param {string} option
   * @param {Object|string=} previous
   * @param {Object=} flags
   * @protected
   * @memberof! oj.inputBase
   * @instance
   */
  _AfterSetOption : function (option, previous, flags)
  {
    this._superApply(arguments);
    switch (option)
    {         
      case "readOnly":
        this._AfterSetOptionDisabledReadOnly(option, oj.EditableValueUtils.readOnlyOptionOptions);
        break;
      case "required":
        this._AfterSetOptionRequired(option);
        break;
      case "validators":
        this._AfterSetOptionValidators(option);
        break;
      case "converter":
        this._AfterSetOptionConverter(option);
        break;           
      default:
        break;
    }
  },
  /**
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @override
   */
  _destroy : function ()
  {
    var ret = this._superApply(arguments);

    this.element.off("blur drop keydown keyup input");
    
    if(this._inputHelper) 
    {
      this._inputHelper.remove();
    }
    
    //unwrap only for non custom elements.
    // for custom elements, the wrapper is created by apps. So no need to replace it with input.
    if(this._DoWrapElement() && !this._IsCustomElement())
    {
      //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
      if (this._DoWrapElementAndTriggers())
        oj.DomUtils.unwrap(this.element, this._wrapper);
      else
        oj.DomUtils.unwrap(this.element);
    }
 
    return ret;
  },
  
  _attachDetachEventHandlers: function () 
  {
    
    if(!this.options["readOnly"] && !this.options["disabled"]) {
      
      this._eventHandlers = {};
      
      var blurHandler = $.proxy(this._onBlurHandler, this),
          keyDownHandler = $.proxy(this._onKeyDownHandler, this),
          keyUpHandler = $.proxy(this._onKeyUpHandler, this),
          inputHandler = $.proxy(this._onInputHandler, this),
          dropHandler = function() 
                        {
                          this.focus();
                        };
      
      this.element.on(this._BLUR_HANDLER_KEY, blurHandler);
      this.element.on(this._KEYDOWN_HANDLER_KEY, keyDownHandler);
      this.element.on(this._KEYUP_HANDLER_KEY, keyUpHandler);
      this.element.on(this._INPUT_HANDLER_KEY, inputHandler);
      
      //other than FF when a drop is dispatched focus is placed back on the element
      //this would cause difference in behavior of the observable change [as set within blur], so in order to provide
      //consisteny placing the focus on the element after the drop
      this.element.on(this._DROP_HANDLER_KEY, dropHandler);
      
      this._eventHandlers[this._BLUR_HANDLER_KEY] = blurHandler;
      this._eventHandlers[this._KEYDOWN_HANDLER_KEY] = keyDownHandler;
      this._eventHandlers[this._KEYUP_HANDLER_KEY] = keyUpHandler;
      this._eventHandlers[this._INPUT_HANDLER_KEY] = inputHandler;
      this._eventHandlers[this._DROP_HANDLER_KEY] = dropHandler;
    }
    else 
    {
      
      //meaning either it is readOnly or is disabled, remove the handlers if they were attached previously
      if(this._eventHandlers) 
      {
        var eventEntries = [this._BLUR_HANDLER_KEY, this._KEYDOWN_HANDLER_KEY, this._KEYUP_HANDLER_KEY,
          this._INPUT_HANDLER_KEY, this._DROP_HANDLER_KEY];
        
        for(var i=0, j=eventEntries.length; i < j; i++) 
        {
          if(this._eventHandlers[eventEntries[i]]) 
          {
            this.element.off(eventEntries[i], this._eventHandlers[eventEntries[i]]);
            delete this._eventHandlers[eventEntries[i]];
          }
        }
      }
    }
    
  },
  
   /**
   * when below listed options are passed to the component, corresponding CSS will be toggled
   * @private
   * @memberof! oj.inputBase
   * @const
   * @type {Object}
   */
  _OPTION_TO_CSS_MAPPING: {
    "readOnly": "oj-read-only"
  }, 
  
  /**
   * Performs the attribute check/set by using _ATTR_CHECK variable [i.e. ojInputText must have type be set to "text"].
   * 
   * @private
   * @memberof! oj.inputBase
   */
  _processAttrCheck : function ()
  {
    
    var attrCheck = this._ATTR_CHECK;
    
    for(var i=0, j=attrCheck.length; i < j; i++) 
    {
      var attr = attrCheck[i]["attr"],
          setMandatoryExists = "setMandatory" in attrCheck[i];
      
      //if it doesn't exist just have to check whether one should set it to a mandatory value
      if(setMandatoryExists)
      {
        this.element.attr(attr, attrCheck[i]["setMandatory"]);
      }
    }
  },
  
  /**
   * Invoked when blur is triggered of the this.element
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @param {Event} event
   */
  _onBlurHandler : function (event) 
  {
    this._SetValue(this._GetDisplayValue(), event);
  },
  
  /**
   * Invoked when keydown is triggered of the this.element
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @param {Event} event
   */
  _onKeyDownHandler : function (event) 
  {
  },

  /**
   * Invoked when keydown is triggered of the this.element
   * 
   * When of keyCode is of Enter, invoke _SetValue on it
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @param {Event} event
   */
  _onKeyUpHandler : function (event) 
  {
    if(event.keyCode === $.ui.keyCode.ENTER) 
    {
      this._SetValue(this._GetDisplayValue(), event);
    }
  },
    
  /**
   * Invoked when the input event happens
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @param {Event} event
   */
  _onInputHandler : function (event) 
  {
    this._SetRawValue(this._GetContentElement().val(), event);
  },
  
  /**
   * Whether the this.element should be wrapped in a root dom element. 
   * Method so that additional conditions can be placed
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @return {boolean}
   */
  _DoWrapElement : function ()
  {
    return this._WIDGET_CLASS_NAMES;
  },

  /**
   * Whether the this.element and triggers should be wrapped. 
   * Method so that additional conditions can be placed
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputBase
   * @return {boolean}
   */
  _DoWrapElementAndTriggers : function ()
  {
    return this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES;
  },
  
  /**
   * Wraps the this.element and adds _WIDGET_CLASS_NAMES classes to the wrapped element
   * 
   * @private
   * @memberof! oj.inputBase
   */
  _wrapElementInRootDomElement : function () 
  {
    if (this.OuterWrapper) {
      this._wrapper = $(this.OuterWrapper).addClass(this._WIDGET_CLASS_NAMES);
      this._wrapper.append(this.element); //@HTMLUpdateOK this is the original input element so ok, nothing special
    } else {
      $(this.element).wrap( $("<div>").addClass(this._WIDGET_CLASS_NAMES) ); //@HTMLUpdateOK original input element so ok, nothing special
      this._wrapper = this.element.parent();
    }
  },
          
  /**
   * Wraps the this.element and adds _ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES classes to the wrapped element.
   * We might need this extra wrapper if the component has input+triggers (like inputDate).
   * 
   * @protected
   * @ignore
   * @memberof! oj.inputBase
   * @return {jQuery}
   */
  _WrapElement : function () 
  {
    return $(this.element).wrap( $("<div>").addClass(this._ELEMENT_TRIGGER_WRAPPER_CLASS_NAMES) ).parent(); //@HTMLUpdateOK original input element so ok, nothing special
  },
  
  /**
   * In some complex components [i.e. datepicker], when the input element receives focus we wish to have Jaws read 
   * out some content.
   * 
   * For those case does this method exist.
   *  
   * @protected
   * @instance
   * @memberof! oj.inputBase
   */
  _AppendInputHelper : function ()
  {
    if(this._INPUT_HELPER_KEY && this._DoWrapElement()) 
    {
      var describedBy = this.element.attr("aria-describedby") || "",
          helperDescribedById = this._GetSubId(this._INPUT_HELPER_KEY);
      
      describedBy += " " + helperDescribedById;
      this.element.attr("aria-describedby", describedBy);
      this._inputHelper = $("<div class='oj-helper-hidden-accessible' aria-hidden='true' id='" + helperDescribedById + "'>" + this._EscapeXSS(this.getTranslatedString(this._INPUT_HELPER_KEY)) + "</div>");
      
      this._AppendInputHelperParent().append(this._inputHelper);//@HTMLUpdateOK append action of the div element created with escaped translated text, so ok
    }
  },
  
  /** 
   * Helper function to escape Cross site script text
   * 
   * @param {string} escapeMe
   * @return {jQuery|string}
   * @memberof! oj.inputBase
   * @ignore
   */
  _EscapeXSS : function (escapeMe) 
  {
    return $("<span>" + escapeMe + "</span>").text();
  },
  
  /**
   * Which parent node the inputHelper should be appended to. Usually do not need to override.
   *  
   * @protected
   * @instance
   * @memberof! oj.inputBase
   */
  _AppendInputHelperParent : function () 
  {
    return this.widget();
  },
  
  /**
   * Sets up the default regExp validator.
   * 
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof! oj.inputBase
   */
  _GetImplicitValidators : function ()
  {
    var ret = this._superApply(arguments);

    // register a default RegExp validator if we have a valid pattern
    if (this.options['pattern'])
    {
      // add validator to the special internalValidators list. These are validators created by 
      // the framework. We don't want these cleared using the option - 'validators'
      this._defaultRegExpValidator[oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP] = this._getImplicitRegExpValidator();
    }
    
    return $.extend(this._defaultRegExpValidator, ret);
  },
  /**
   * Whether the a value can be set on the component. For example, if the component is 
   * disabled or readOnly then setting value on component is a no-op. 
   * 
   * @see #_SetValue
   * @return {boolean}
   * @memberof! oj.inputBase
   * @override
   * @instance
   * @protected
   */
    _CanSetValue: function ()
    {
      var readOnly;
      var superCanSetValue = this._super();

      if (!superCanSetValue)
        return false;

      readOnly = this.options['readOnly'] || false;
      return (readOnly) ? false : true;
    },
    /**
   * Toggles css selector on the widget. E.g., when readonly property changes, 
   * the oj-read-only selector needs to be toggled.
   * @param {string} option
   * @param {Object|string} value 
   * @memberof! oj.inputBase
   * @private
   */        
  _refreshStateTheming : function (option, value)
  {
    if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) != -1) 
    {
      // value is a boolean
      this.widget().toggleClass(this._OPTION_TO_CSS_MAPPING[option], !!value);
    }
  },
  
  /**
   * Returns the regexp validator instance or creates it if needed and caches it.
   * @private
   * @memberof! oj.inputBase
   */
  _getImplicitRegExpValidator : function ()
  {
    if (!this.options['pattern']) 
    {
      return null;
    }
    var regexpOptions = {'pattern': this.options['pattern'], 
                                   'label': this._getLabelText()};
    
    $.extend(regexpOptions, this.options['translations']['regexp'] || {});
    return oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator(regexpOptions);
  },
  
  /**
   * This helper function will generate ids using widget's uuid as unique identifier for 
   * wai-aria and other necessary ids
   * 
   * @ignore
   * @protected
   * @param {string} sub
   * @return {string}
   * @memberof! oj.inputBase
   */
  _GetSubId : function (sub)
  {
    return this["uuid"] + "_" + sub;
  },
  
  /**
   * @ignore
   * @protected
   * @return {boolean}
   * @memberof! oj.inputBase
   */
  _IsRTL : function ()
  {
    return this._rtl;
  },
  
  /**
   * <p>Refreshes the component.  Usually called after dom changes have been made.
   *
   * @example <caption>Refresh component after dome changes have been made.</caption>
   * // refresh component. 
   * myComp.refresh();

   * @expose
   * @memberof oj.inputBase
   * @public
   * @return {void}
   * @instance
   */
  refresh: function()
  {
    var retVal = this._superApply(arguments);
    
    this._rtl = this._GetReadingDirection() === "rtl";
    
    this._refreshRequired(this.options['required']);
     
    return retVal;
  },
  /**
   * @memberof! oj.inputBase
   * @instance
   * @private
   */
  _refreshRequired : oj.EditableValueUtils._refreshRequired,
  /**
   * the validate method from v3.x that returns a boolean
   * @memberof! oj.inputBase
   * @instance
   * @protected
   * @ignore
   */
  _ValidateReturnBoolean: oj.EditableValueUtils._ValidateReturnBoolean,

  getNodeBySubId: function(locator)
  {
    return this._super(locator);
  },

    
  /**
   * Validates the component's display value using the converter and all validators registered on 
   * the component and updates the <code class="prettyprint">value</code> option by performing the 
   * following steps. 
   * 
   * <p>
   * <ol> 
   * <li>All messages are cleared, including custom messages added by the app. </li>
   * <li>If no converter is present then processing continues to next step. If a converter is 
   * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
   * the messages are shown.</li>
   * <li>If there are no validators setup for the component the <code class="prettyprint">value</code> 
   * option is updated using the display value. Otherwise all 
   * validators are run in sequence using the parsed value from the previous step. The implicit 
   * required validator is run first if the component is marked required. When a validation error is 
   * encountered it is remembered and the next validator in the sequence is run. </li>
   * <li>At the end of validation if there are errors, the messages are shown. 
   * If there were no errors, then the 
   * <code class="prettyprint">value</code> option is updated.</li>
   * </ol>
   * 
   * @example <caption>Validate component using its current value.</caption>
   * // validate display value and shows messages if there are any to be shown.
   * myComp.validate();
   * @example <caption>Validate component and use the Promise's resolved state.</caption>
   * myComp.validate().then(
   *  function(result) {
   *    if(result === "valid")
   *    {
   *      submitForm();
   *    }
   *  });
   * @return {Promise.<string>} Promise resolves to "valid" if there were no converter parse errors and
   * the component passed all validations. 
   * The Promise resolves to "invalid" if there were converter parse errors or 
   * if there were validation errors.
   * @ojsignature {target: "Type", value: "Promise<'valid'|'invalid'>", for : "returns"}
   * 
   * 
   * @method
   * @access public
   * @expose
   * @memberof oj.inputBase
   * @instance
   * @since 4.0.0
   * @ojstatus preview
   */
  validate : oj.EditableValueUtils.validate,

  /**
   * Called to find out if aria-required is unsupported.
   * @memberof! oj.inputBase
   * @instance
   * @protected
   */
  _AriaRequiredUnsupported : function()
  {
    return false;
  },
  /**
   * Returns a <code class="prettyprint">jQuery</code> object containing the element visually 
   * representing the component, excluding the label associated with the it. 
   * 
   * <p>This method does not accept any arguments.</p>
   * 
   * @expose
   * @memberof! oj.inputBase
   * @instance
   * @return {jQuery} the root of the component
   * @ignore
   * 
   * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
   * var widget = $( ".selector" ).ojFoo( "widget" ); // Foo is InputText, InputPassword, TextArea
   */       
  widget : function () 
  {
    return this._DoWrapElement() ? this._wrapper : this.element;
  }

}, true);

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojInputPassword
 * @augments oj.inputBase
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputPassword extends inputBase<string, ojInputPasswordSettableProperties>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojInputPasswordSettableProperties extends inputBaseSettableProperties<string>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojshortdesc Provides basic support for specifying a text value of type 'password'.
 * @ojrole textbox
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="inputPasswordOverview-section">
 *   JET InputPassword Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputPasswordOverview-section"></a>
 * </h3>
 *
 * <p>Description: The oj-input-password component enhances a browser input type="password" element.
 *
 * <pre class="prettyprint"><code>&lt;oj-input-password>&lt;/oj-input-password></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <h3 id="label-section">
 *   Label and InputPassword
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label to the oj-input-password component.
 * For accessibility, you should associate an oj-label element with the oj-input-password component
 * by putting an <code>id</code> on the oj-input-password element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
 * </p>
 *
 * @example <caption>Initialize the oj-input-password element with no attributess specified:</caption>
 * &lt;oj-input-password>&lt;/oj-input-password>
 *
 * @example <caption>Initialize the oj-input-password element with some attributes:</caption>
 * &lt;oj-input-password id="pwdId" disabled>&lt;/oj-input-password>
 *
 * @example <caption>Initialize a component attribute via component binding:</caption>
 * &lt;oj-input-password id="pwdId" value="{{currentValue}}">&lt;/oj-input-password>
 */
oj.__registerWidget("oj.ojInputPassword", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<input>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   * @memberof! oj.ojInputPassword
   */
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "password"}],

  /**
   * @expose
   * @private
   * @memberof! oj.ojInputPassword
   */
  _CLASS_NAMES : "oj-inputpassword-input",

  /**
   * @expose
   * @private
   * @memberof! oj.ojInputPassword
   */
  _WIDGET_CLASS_NAMES : "oj-inputpassword oj-form-control oj-component",

  options :
  {
    /**
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.ojInputPassword
     * @type {Object|undefined}
     * @ignore
     */    
    converter: undefined,
    /**
     * Regular expression pattern which will be used to validate the component's value. 
     * <p>
     * When pattern is set to true, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
     * &lt;oj-input-password pattern="[a-zA-Z0-9]{3,}">&lt;/oj-input-password><br/>
     *
     * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
     * // getter
     * var pattern = myComp.pattern;
     *
     * // setter
     * myComp.pattern = "[0-9]{3,}";
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputPassword
     * @type {string|undefined}
     * @ignore
     */
    pattern: ""

    // Events

    /**
     * Triggered when the ojInputPassword is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputPassword
     * @instance
     * @property {Event} event event object
     * @property {Object} ui Currently empty
     * @ignore
     *
     * @example <caption>Initialize the ojInputPassword with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputPassword({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-inputpassword-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputPassword
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputpassword";
  }

});

// Fragments:

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *    <tr>
 *       <td>Input</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to input. If hints, help.instruction or messages exist in a notewindow,
 *       popup the notewindow.</td>
 *     </tr>
 *   </tbody>
 *  </table>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputPassword
 */

 /**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Input element</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to the input. 
 *       If hints, help.instruction or messages exist in a notewindow, 
 *        pop up the notewindow.</td>
 *     </tr> 
 *   </tbody>
 * </table>
 *
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojInputPassword
 */


//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojInputPassword component's input element.</p>
 *
 * @ojsubid oj-inputpassword-input
 * @ignore
 * @memberof oj.ojInputPassword
 * @deprecated 4.0.0 Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myComp.getNodeBySubId("oj-inputpassword-input");
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojInputText
 * @augments oj.inputBase
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputText extends inputBase<any, ojInputTextSettableProperties>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojInputTextSettableProperties extends inputBaseSettableProperties<any>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojshortdesc Provides basic support for specifying a text value.
 * @ojrole textbox
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="inputTextOverview-section">
 *   JET InputText Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTextOverview-section"></a>
 * </h3>
 *
 * <p>Description: The oj-input-text component enhances a browser input type="text" element.
 * 
 * <pre class="prettyprint"><code>&lt;oj-input-text>&lt;/oj-input-text></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * <h3 id="label-section">
 *   Label and InputText
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label with the oj-input-text component.
 * For accessibility, you should associate an oj-label element to the oj-input-text component
 * by putting an <code>id</code> on the oj-input-text element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
 * </p>
 *
 * @example <caption>Declare the oj-input-text component with no attributes specified:</caption>
 * &lt;oj-input-text>&lt;/oj-input-text>
 *
 * @example <caption>Initialize the component with some attributes:</caption>
 * &lt;oj-input-text id="textId" disabled>&lt;/oj-input-text>
 *
 * @example <caption>Initialize a component attribute via component binding:</caption>
 * &lt;oj-input-text id="textId" value="{{currentValue}}">&lt;/oj-input-text>
 */
oj.__registerWidget("oj.ojInputText", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<input>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   */
  _ATTR_CHECK : [{"attr": "type", "setMandatory": "text"}],

  /**
   * @expose
   * @private
   */
  _CLASS_NAMES : "oj-inputtext-input",

  /**
   * @expose
   * @private
   */
  _WIDGET_CLASS_NAMES : "oj-inputtext oj-form-control oj-component",
  
  /**
   * @private
   */
  _ALLOWED_TYPES : ['email', 'number', 'search', 'tel', 'text', 'url'],

  _CLICK_HANDLER_KEY: "click",

  options :
  {
    /**
     * @expose
     * @memberof! oj.ojInputText
     * @instance
     * @type {string}
     * @ojvalue {string} "never" The clear icon is never visible
     * @ojvalue {string} "always" The clear icon is always visible
     * @ojvalue {string} "conditional" The clear icon is visible under the following conditions:
     * if the component has a non-empty value AND it either has focus OR the mouse is over the field.
     * @default "never"
     * @desc Specifies if the clear icon should be visible.
     *
     * @example <caption>Initialize the oj-input-text with the <code class="prettyprint">clear-icon</code> attribute specified:</caption>
     * &lt;oj-input-text clear-icon="conditional" id="inputcontrol">&lt;/oj-input-text>
     *
     * @example <caption>Get or set the <code class="prettyprint">clearIcon</code> property after initialization:</caption>
     * // getter
     * var clearIcon = myInputText.clearIcon;
     *
     * // setter
     * myInputText.clearIcon = 'conditional';
     */
    clearIcon: "never",
    /**
     * a converter instance that duck types {@link oj.Converter}. Or an object literal containing 
     * the following properties.
     * {@ojinclude "name":"inputBaseConverterOptionDoc"} 
     * 
     * @property {string} type - the converter type registered with the oj.ConverterFactory. 
     * Supported types are 'number' and 'datetime'. See {@link oj.ConverterFactory} for details. 
     * <br/>
     * E.g., <code class="prettyprint">converter='{"type": "number"}'</code>
     * @property {Object=} options - optional Object literal of options that the converter expects. 
     * See {@link oj.IntlNumberConverter} for options supported by the number converter. See 
     * {@link oj.IntlDateTimeConverter} for options supported by the date time converter. <br/>
     * E.g., <code class="prettyprint">converter='{"type": "number", "options": {"style": "decimal"}}'</code>
     * 
     * @example <caption>Initialize the component with a number converter instance:</caption>
     * &lt;oj-input-text converter="[[salaryConverter]]">&lt;/oj-input-text><br/>
     * // Initialize converter instance using currency options
     * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);
     * 
     * @example <caption>Initialize the component with converter object literal:</caption>
     * &lt;oj-input-text converter='{"type": "number", "options": {"style": "decimal"}}'>&lt;/oj-input-text>
     * 
     * @example <caption>Get or set the <code class="prettyprint">converter</code>
     *  property after initialization:</caption>
     * // getter
     * var converter = myComp.converter;
     *
     * // setter
     * myComp.converter = myConverter;
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.ojInputText
     * @ojsignature {
     *    target: "Type",
     *    value: "oj.Converter<any>|oj.Validation.FactoryRegisteredValidatorOrConverter|null"}
     * @type {Object|undefined}
     */    
    converter: undefined,
    /** 
     * Indicates a list of pre-defined options to suggest to the user. 
     * The value must be the id of a &lt;datalist> element in the same page.
     * This attribute is ignored when the type attribute's value is hidden. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">list</code> attribute:</caption>
     * &lt;oj-some-element list="sampleDataList">&lt;/oj-some-element>
     * 
     * <p>Example for datalist:
     * <pre class="prettyprint">
     * <code>
     * &lt;datalist id="sampleDataList">
     *   &lt;option value="item 1">item 1&lt;/option>
     *   &lt;option value="item 2">item 2&lt;/option>
     *   &lt;option value="item 3">item 3&lt;/option>
     *   &lt;option value="item 4">item 4&lt;/option>
     * &lt;/datalist> 
     * </code></pre>
     *
     * @example <caption>Get or set the <code class="prettyprint">list</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.list;
     *
     * // setter
     * myComp.list = "myDataList";
     * 
     * @expose
     * @instance
     * @memberof! oj.ojInputText
     * @type {string}
     * @public
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    list: "",
    /**
     * Regular expression pattern which will be used to validate the component's value.
     * <p>
     * When pattern is set to a non-empty string value, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
     * &lt;oj-input-text pattern="[a-zA-Z0-9]{3,}">&lt;/oj-input-text><br/>
     * 
     * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
     * // getter
     * var pattern = myComp.pattern;
     *
     * // setter
     * myComp.pattern = "[0-9]{3,}";
     *
     * @expose
     * @instance
     * @memberof! oj.ojInputText
     * @type {string|undefined}
     * @ignore
     */
    pattern: "",
    /** 
     * Setting the value of this attribute to true indicates that the element needs to have its 
     * spelling and grammar checked. The value default indicates that the element is to act according
     * to a default behavior, possibly based on the parent element's own spellcheck value. 
     * The value false indicates that the element should not be checked.
     * 
     * @example <caption>Initialize component with <code class="prettyprint">spellcheck</code> attribute:</caption>
     * &lt;oj-some-element spellcheck>&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">spellcheck</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.spellcheck;
     *
     * // setter
     * myComp.spellcheck = false;
     * 
     * @expose
     * @instance
     * @memberof! oj.ojInputText
     * @default false
     * @type {boolean}
     * @public
     * @ojextension {_ATTRIBUTE_ONLY: true, _COPY_TO_INNER_ELEM: true}
     */
    spellcheck: false,
    /**
     * The type of virtual keyboard to display for entering value on mobile browsers.  This attribute has no effect on desktop browsers.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">virtual-keyboard</code> attribute:</caption>
     * &lt;oj-input-text virtual-keyboard="number">&lt;/oj-input-text>
     * 
     * @example <caption>Get or set the <code class="prettyprint">virtualKeyboard</code> property after initialization:</caption>
     * // Getter
     * var virtualKeyboard = myComp.virtualKeyboard;
     * 
     * // Setter
     * myComp.virtualKeyboard = "number";
     *
     * @expose
     * @instance
     * @memberof oj.ojInputText
     * @type {string}
     * @ojvalue {string} "auto" The component will determine the best virtual keyboard to use.
     *                          <p>This is always "text" for this release but may change in future
     *                          releases.</p>
     * @ojvalue {string} "email" Use a virtual keyboard for entering email.
     * @ojvalue {string} "number" Use a virtual keyboard for entering number.
     *                            <p>Note that on Android and Windows Mobile, the "number" keyboard does
     *                            not contain the minus sign.  This value should not be used on fields that
     *                            accept negative values.</p>
     * @ojvalue {string} "search" Use a virtual keyboard for entering search terms.
     * @ojvalue {string} "tel" Use a virtual keyboard for entering telephone number.
     * @ojvalue {string} "text" Use a virtual keyboard for entering text.
     * @ojvalue {string} "url" Use a virtual keyboard for entering URL.
     * @default "auto"
     * @since 5.0.0
     */
    virtualKeyboard: "auto"

    // Events

    /**
     * Triggered when the ojInputText is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputText
     * @instance
     * @property {Event} event event object
     * @property {Object} ui Currently empty
     * @ignore
     *
     * @example <caption>Initialize the ojInputText with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputText({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputText
   */
  _ComponentCreate : function ()
  {
    var retVal = this._super();

    // add in the clear icon if needed
    var clearIconAttr = this.options["clearIcon"];
    
    this._processClearIconAttr(clearIconAttr);
    
    this._AddHoverable(this._wrapper);

    // Set the input type attribute based on virtualKeyboard property
    this._SetInputType(this._ALLOWED_TYPES);

    return retVal;
  },
  /**
   * Render or remove the clear icon
   * @ignore
   * @private
   * @param {string} clearIconAttr
   * @memberof oj.ojInputText
   * @instance
   */
  _processClearIconAttr : function (clearIconAttr)
  {
    var wrapperElem = this._wrapper[0];
    var clearIconBtn = wrapperElem.querySelector("a.oj-inputtext-clear-icon-btn");

    if (clearIconAttr === "never" || this.options["disabled"] || this.options["readOnly"])
    {
      // remove the icon if it is there
      if (clearIconBtn)
      {
        wrapperElem.removeChild(clearIconBtn);
      }
      
      // if the clearIcon is not rendered, we shouldn't have these classes
      wrapperElem.classList.remove('oj-inputtext-clearicon-visible');
      wrapperElem.classList.remove("oj-inputtext-clearicon-conditional");
    }
    else
    {
      if (clearIconBtn === null)
      {
        var clearIcon;
        clearIconBtn = document.createElement('a');
        clearIconBtn.className = "oj-inputtext-clear-icon-btn oj-component-icon oj-clickable-icon-nocontext";
        clearIconBtn.setAttribute("tabindex", "-1");
        clearIconBtn.setAttribute("target", "_blank");
        clearIcon = document.createElement('span');
        clearIcon.className =
                            "oj-inputtext-clear-icon";
   
        clearIconBtn.appendChild(clearIcon);
        wrapperElem.appendChild(clearIconBtn);

        clearIconBtn.addEventListener(this._CLICK_HANDLER_KEY, this._onClearIconClickHandler.bind(this));
      }
      
      // If clear-icon = "always", we want the icon visible all the time
      if (clearIconAttr === "always")
        wrapperElem.classList.add('oj-inputtext-clearicon-visible');
      else
      {
        wrapperElem.classList.remove('oj-inputtext-clearicon-visible');
      
        // for the conditional case, we add oj-inputtext-clearicon-hidden
        if (clearIconAttr === "conditional")
        {
          // For the conditional case, we render oj-form-control-empty-clearicon if the input doesn't
          // have a value, as we always want the clear icon hidden for this case.  When the input does
          // have a value, then we use oj-inputtext-clearicon-conditional, which has selectors for
          // oj-hover and oj-focus to determine when the icon is visible.
          wrapperElem.classList.add("oj-inputtext-clearicon-conditional");
          
          var val;
          
          // if the component is not fully rendered, then we need to use the value option's value
          // instead of the input element's value
          if (wrapperElem.classList.contains("oj-complete"))
            val = this.element[0].value;
          else
            val = this.options["value"];
          
          if (val !== "")
          {
            wrapperElem.classList.remove("oj-form-control-empty-clearicon");
          }
          else
          {
            wrapperElem.classList.add("oj-form-control-empty-clearicon");
          }
        }
        else
        {
          wrapperElem.classList.remove("oj-inputtext-clearicon-conditional");
          wrapperElem.classList.remove("oj-form-control-empty-clearicon");
        }
      }
    }
  },
  /**
   * Performs post processing after _SetOption() calls _superApply(). Different options, when changed, perform
   * different tasks. 
   * 
   * @param {string} option
   * @param {Object=} flags 
   * @protected
   * @memberof oj.ojInputText
   * @instance
   */
  _AfterSetOption : function (option, flags)
  {
    this._super(option, flags);
    
    switch (option)
    {
      // all of these options potentially affect the visiblity and/or rendering of the icon
      // so we need to process the icon if any of these change.
      case "clearIcon" :
      case "value" :
      case "disabled" :
      case "readOnly" :
        this._processClearIconAttr(this.options["clearIcon"]);
        break;
      
      case "virtualKeyboard":
        this._SetInputType(this._ALLOWED_TYPES);
        break;

      default:
        break;
    }
  },
  /**
   * Invoked when the input event happens
   * 
   * @ignore
   * @protected
   * @memberof! oj.ojInputText
   * @param {Event} event
   */
  _onInputHandler : function (event) 
  {
    this._super(event);
    var inputNode = event.target;
    var wrapperNode = this._wrapper[0];
    var clearIconAttr = this.options["clearIcon"];
    
    if (clearIconAttr === "conditional")
    {
      if (inputNode.value !== "")
      {
        wrapperNode.classList.remove("oj-form-control-empty-clearicon");
      }
      else
      {
        wrapperNode.classList.add("oj-form-control-empty-clearicon");
      }
    }
  },  
  /**
   * The handler clears the value of the input element and sets the focus on the element
   * NOTE: this handler expects the input text component to be bound to this via .bind()
   * 
   * @ignore
   * @private
   * @memberof! oj.ojInputText
   * @param {Event} event
   */
  _onClearIconClickHandler : function (event)
  {
    var elem = this.element[0];

    elem.value = "";
    // we need to update the raw value to keep it in sync
    this._SetRawValue(elem.value, event);
    elem.focus();
    this._wrapper[0].classList.add("oj-form-control-empty-clearicon");
  },
  /**
   * Invoked when blur is triggered of the this.element
   * We don't want to set the value if the event.relatedTarget is the clear icon button
   * 
   * @ignore
   * @protected
   * @memberof! oj.inputText
   * @param {Event} event
   */
  _onBlurHandler : function (event) 
  {
    var wrapperNode = this._wrapper[0];
    var target = event.relatedTarget;

    // if this is the clear icon, skip the blur handler if it is an ancestor of the input text
    if (!(target && 
          target.classList.contains("oj-inputtext-clear-icon-btn") &&
          target.parentElement &&
          oj.DomUtils.isAncestorOrSelf(wrapperNode, target.parentElement)))
    {
      this._super(event);
    }
    else
    {
      // We need to put the oj-focus back on the wrapperNode so that the icon
      // doesn't disappear on iOS and make it so that the click handler will fire.
      wrapperNode.classList.add("oj-focus");
    }
  },
  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-inputtext-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @override
   * @instance
   * @memberof! oj.ojInputText
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-inputtext";
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojInputText
   */
  _GetTranslationsSectionName: function()
  {
    return "oj-inputBase";
  },
  
  /**
   * Set the type of the input element based on virtualKeyboard option.
   * @memberof oj.ojInputText
   * @instance
   * @protected
   * @ignore
   */
  _SetInputType: oj.EditableValueUtils._SetInputType

});

  // Fragments:

  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Gesture</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *    <tr>
   *       <td>Input</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Sets focus to input. If hints, help.instruction or messages exist in a notewindow,
   *       popup the notewindow.</td>
   *     </tr>
   *   </tbody>
   *  </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputText
   */

   /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Input</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the input. 
   *       If hints, help.instruction or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojInputText
   */
  /**
   * {@ojinclude "name":"ojStylingDocIntro"}
   * 
   * <table class="generic-table styling-table">
   *   <thead>
   *     <tr>
   *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
   *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>oj-form-control-text-align-right</td>
   *       <td>Aligns the text to the right regardless of the reading direction,
               this is normally used for right aligning numbers 
   *     </td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
   * @memberof oj.ojInputText
   */

//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojInputText component's input element.</p>
 * 
 * @ojsubid oj-inputtext-input
 * @memberof oj.ojInputText
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myComp.getNodeBySubId("oj-input-text-input");
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojTextArea
 * @augments oj.inputBase
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojTextArea extends inputBase<any, ojTextAreaSettableProperties>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojTextAreaSettableProperties extends inputBaseSettableProperties<any>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojshortdesc Provides basic support for specifying a multi-line text value.
 * @ojrole textbox
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="textAreaOverview-section">
 *   JET TextArea Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#textAreaOverview-section"></a>
 * </h3>
 *
 * <p>Description: The oj-text-area component enhances a browser textarea element.
 *
 * <pre class="prettyprint"><code>&lt;oj-text-area>&lt;/oj-text-area></code></pre>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <h3 id="label-section">
 *   Label and TextArea
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate an oj-label to the oj-text-area component.
 * For accessibility, you should associate an oj-label element with the oj-text-area component
 * by putting an <code>id</code> on the oj-text-area element, and then setting the
 * <code>for</code> attribute on the oj-label to be the component's id.
 * </p>
 * <h3 id="binding-section">
 *   Declarative Binding
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#binding-section"></a>
 * </h3>
 *
 * @example <caption>Initialize the textarea with no attributes specified:</caption>
 * &lt;oj-text-area>&lt;/oj-text-area>
 *
 * * @example <caption>Initialize the textarea with some attributes:</caption>
 * &lt;oj-text-area id="txtAreaId" disabled>&lt;/oj-text-area>
 *
 * @example <caption>Initialize the textarea via the JET component binding:</caption>
 * &lt;oj-text-area id="txtAreaId" value="{{currentValue}}">&lt;/oj-text-area>
 */
oj.__registerWidget("oj.ojTextArea", $['oj']['inputBase'],
{
  version : "1.0.0",
  defaultElement : "<textarea>",
  widgetEventPrefix : "oj",

  /**
   * @expose
   * @private
   * @memberof! oj.ojTextArea
   */
  _ATTR_CHECK : [],

  /**
   * @expose
   * @private
   * @memberof! oj.ojTextArea
   */
  _CLASS_NAMES : "oj-textarea-input",

  /**
   * @expose
   * @private
   * @memberof! oj.ojTextArea
   */
  _WIDGET_CLASS_NAMES : "oj-textarea oj-form-control oj-component",

  options :
  {
    /**
     * a converter instance that duck types {@link oj.Converter}. Or an object literal containing 
     * the following properties.
     * {@ojinclude "name":"inputBaseConverterOptionDoc"} 
     * 
     * @property {string} type - the converter type registered with the oj.ConverterFactory. 
     * Supported types are 'number' and 'datetime'. See {@link oj.ConverterFactory} for details. 
     * <br/>
     * E.g., <code class="prettyprint">converter='{"type": "number"}'</code>
     * @property {Object=} options - optional Object literal of options that the converter expects. 
     * See {@link oj.IntlNumberConverter} for options supported by the number converter. See 
     * {@link oj.IntlDateTimeConverter} for options supported by the date time converter. <br/>
     * E.g., <code class="prettyprint">converter='{"type": "number", "options": {"style": "decimal"}}'</code>
     * 
     * @example <caption>Initialize the component with a number converter instance:</caption>
     * &lt;oj-text-area converter="[[salaryConverter]]">&lt;/oj-text-area><br/>
     * // Initialize converter instance using currency options
     * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);
     * 
     * @example <caption>Initialize the component with converter object literal:</caption>
     * &lt;oj-text-area converter='{"type": "number", "options": {"style": "decimal"}}'>&lt;/oj-text-area>
     * 
     * @example <caption>Get or set the <code class="prettyprint">converter</code> 
     * property after initialization:</caption>
     * // getter
     * var converter = myComp.converter;
     *
     * // setter
     * myComp.converter = myConverter;
     * @expose 
     * @access public
     * @instance
     * @memberof! oj.ojTextArea
     * @ojsignature {
     *    target: "Type",
     *    value: "oj.Converter<any>|oj.Validation.FactoryRegisteredValidatorOrConverter|null"}
     * @type {Object|undefined}
     */    
    converter: undefined,
    /**
     * Regular expression pattern which will be used to validate the component's value.
     * <p>
     * When pattern is set to true, an implicit regExp validator is created using the validator
     * factory -
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP).createValidator()</code>.
     * </p>
     *
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">pattern</code> attribute:</caption>
     * &lt;oj-text-area pattern="[a-zA-Z0-9]{3,}">&lt;/oj-text-area><br/>
     * 
     * @example <caption>Get or set the <code class="prettyprint">pattern</code> property after initialization:</caption>
     * // getter
     * var pattern = myComp.pattern;
     *
     * // setter
     * myComp.pattern = "[0-9]{3,}";
     *
     * @expose
     * @instance
     * @memberof! oj.ojTextArea
     * @type {string|undefined}
     * @ignore
     */
    pattern: "",
     /** 
     * The number of visible text lines in the textarea. It can also be used to 
     * give specific height to the textarea.
     * 
     * @example <caption>Initialize component with <code class="prettyprint">rows</code> attribute:</caption>
     * &lt;oj-some-element rows="5">&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">rows</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.rows;
     *
     * // setter
     * myComp.rows = 5;
     * 
     * @expose
     * @instance
     * @memberof! oj.ojTextArea
     * @type {number}
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    rows: undefined,
     /** 
     * Setting the value of this attribute to true indicates that the element needs to have its 
     * spelling and grammar checked. The value default indicates that the element is to act according
     * to a default behavior, possibly based on the parent element's own spellcheck value. 
     * The value false indicates that the element should not be checked.
     * 
     * @example <caption>Initialize component with <code class="prettyprint">spellcheck</code> attribute:</caption>
     * &lt;oj-some-element spellcheck>&lt;/oj-some-element>
     * 
     * @example <caption>Get or set the <code class="prettyprint">spellcheck</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.spellcheck;
     *
     * // setter
     * myComp.spellcheck = false;
     * 
     * @expose
     * @instance
     * @memberof! oj.ojTextArea
     * @default false
     * @type {boolean}
     * @ojextension {_ATTRIBUTE_ONLY: true, _COPY_TO_INNER_ELEM: true}
     */
    spellcheck: false

    // Events

    /**
     * Triggered when the ojTextArea is created.
     *
     * @event
     * @name create
     * @memberof oj.ojTextArea
     * @instance
     * @property {Event} event event object
     * @property {Object} ui Currently empty
     * @ignore
     *
     * @example <caption>Initialize the ojTextArea with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojTextArea({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-textarea-input") {
        node = this.element ? this.element[0] : null;
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
  },

  /**
   * @instance
   * @memberof! oj.ojTextArea
   * @override
   * @protected
   * @return {string}
   */
  _GetDefaultStyleClass : function ()
  {
    return "oj-textarea";
  },

  /**
   * @protected
   * @override
   * @instance
   * @memberof! oj.ojTextArea
   */
  _GetTranslationsSectionName: function()
  {
    return "oj-inputBase";
  }

});

  // Fragments:

	/**
	 * <table class="keyboard-table">
	 *   <thead>
	 *     <tr>
	 *       <th>Target</th>
	 *       <th>Gesture</th>
	 *       <th>Action</th>
	 *     </tr>
	 *   </thead>
	 *   <tbody>
	 *    <tr>
	 *       <td>TextArea</td>
	 *       <td><kbd>Tap</kbd></td>
	 *       <td>Sets focus to textarea. If hints, help.instruction or messages exist in a notewindow,
   *       popup the notewindow.</td>
	 *     </tr>
	 *   </tbody>
	 *  </table>
	 *
	 *
	 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
	 * @memberof oj.ojTextArea
	 */

   /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>TextArea</td>
   *       <td><kbd>Tab In</kbd></td>
   *       <td>Set focus to the textarea. 
   *       If hints, help.instruction or messages exist in a notewindow, 
   *        pop up the notewindow.</td>
   *     </tr> 
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojTextArea
   */


//////////////////     SUB-IDS     //////////////////
/**
 * <p>Sub-ID for the ojTextArea component's textarea element.</p>
 * 
 * @ojsubid oj-textarea-input
 * @ignore
 * @memberof oj.ojTextArea
 * @deprecated 4.0.0  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myComp.getNodeBySubId("oj-textarea-input");
 */

(function() {
var inputBaseMeta = {
  "properties": {
    "autocomplete": {
      "type": "string",
      "enumValues": ["off", "on"],
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "autofocus": {
      "type": "boolean",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "name": {
      "type": "string",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "readOnly": true,
      "writeback": true
    },
    "readonly": {
      "type": "boolean"
    },
    "required": {
      "type": "boolean"
    },
    "translations": {
      "type": "Object",
      "properties": {
        "regexp": {
          "type": "Object",
          "properties": {
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "required": {
          "type": "Object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        }
      }
    },
    "validators": {
      "type": "Array"
    }
  },
  "methods": {
    "validate": {}
  },
  "extension": {
    _INNER_ELEM: 'input',
    _WIDGET_NAME: "inputBase",
    _GLOBAL_TRANSFER_ATTRS: ["accesskey", "aria-label", "tabindex"],
    _ALIASED_PROPS: {"readonly": "readOnly"}
  }
};
oj.CustomElementBridge.registerMetadata('inputBase', 'editableValue', inputBaseMeta);
})();

(function() {
var ojInputPasswordMeta = {
  "properties": {
    "value": {
      "type": "string",
      "writeback": true
    }
  },
  "methods": {},
  "extension": {
    _WIDGET_NAME: "ojInputPassword"
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-password', 'inputBase', ojInputPasswordMeta);
oj.CustomElementBridge.register('oj-input-password', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-password')});
})();

(function() {
var ojInputTextMeta = {
  "properties": {
    "clearIcon": {
      "type": "string",
      "enumValues": ["always", "conditional", "never"]
    },
    "converter": {
      "type": "Object"
    },
    "list": {
      "type": "string",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "spellcheck": {
      "type": "boolean",
      "extension": {
        _ATTRIBUTE_ONLY: true,
        _COPY_TO_INNER_ELEM: true
      }
    },
    "value": {
      "type": "any",
      "writeback": true
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": ["auto", "email", "number", "search", "tel", "text", "url"]
    }
  },
  "methods": {},
  "extension": {
    _WIDGET_NAME: "ojInputText"
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-text', 'inputBase', ojInputTextMeta);
oj.CustomElementBridge.register('oj-input-text', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-text')});
})();

(function() {
var ojTextAreaMeta = {
  "properties": {
    "converter": {
      "type": "Object"
    },
    "rows": {
      "type": "number",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "spellcheck": {
      "type": "boolean",
      "extension": {
        _ATTRIBUTE_ONLY: true,
        _COPY_TO_INNER_ELEM: true
      }
    },
    "value": {
      "type": "any",
      "writeback": true
    }
  },
  "methods": {},
  "extension": {
    _INNER_ELEM: 'textarea',
    _WIDGET_NAME: "ojTextArea"
  }
};
oj.CustomElementBridge.registerMetadata('oj-text-area', 'inputBase', ojTextAreaMeta);
oj.CustomElementBridge.register('oj-text-area', {'metadata': oj.CustomElementBridge.getMetadata('oj-text-area')});
})();
});