/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojmoduleanimations'],
  function(oj) {
     function ControllerViewModel() {
      var self = this;

      // Save the theme so we can perform platform specific navigational animations
      var platform = oj.ThemeUtils.getThemeTargetPlatform();

      // Router setup
      self.router = oj.Router.rootInstance;

      self.router.configure({
       'dashboard': {label: 'Dashboard', isDefault: true},
       'incidents': {label: 'Incidents'},
       'customers': {label: 'Customers'},
       'profile': {label: 'Profile'},
       'about': {label: 'About'}
      });

      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
      // Callback function that can return different animations based on application logic.
      function switcherCallback(context) {
        if (platform === 'android')
          return 'fade';
        return null;
      };

      function mergeConfig(original) {
        return $.extend(true, {}, original, {
          'animation': oj.ModuleAnimations.switcher(switcherCallback)
        });
      }

      self.moduleConfig = mergeConfig(self.router.moduleConfig);

      // Navigation setup
      var navData = [
      {name: 'Dashboard', id: 'dashboard',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
      {name: 'Incidents', id: 'incidents',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-fire-icon-24'},
      {name: 'Customers', id: 'customers',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-people-icon-24'},
      {name: 'Profile', id: 'profile',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'},
      {name: 'About', id: 'about',
       iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'}
      ];

      self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});

      // Header Setup
      self.getHeaderModel = function() {
        var headerFactory = {
          createViewModel: function(params, valueAccessor) {
            var model =  {
              pageTitle: self.router.currentState().label,
              handleBindingsApplied: function(info) {
                // Adjust content padding after header bindings have been applied
                self.adjustContentPadding();
              }
            };
            return Promise.resolve(model);
          }
        }
        return headerFactory;
      }

      // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions. 
      // This method should be called whenever your fixed region height may change.  The application
      // can also adjust content paddings with css classes if the fixed region height is not changing between 
      // views.
      self.adjustContentPadding = function () {
        var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

        if (topElem) {
          contentElem.style.paddingTop = topElem.offsetHeight+'px';
        }
        if (bottomElem) {
          contentElem.style.paddingBottom = bottomElem.offsetHeight+'px';
        }
        // Add oj-complete marker class to signal that the content area can be unhidden.
        // See the override.css file to see when the content area is hidden.
        contentElem.classList.add('oj-complete');
      }
    }

    return new ControllerViewModel();
  }
);
