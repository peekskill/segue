Segue Meteor Package
============================

## VelocityJS page transitions

Segue adds native-feeling page transitions to your Meteor app; built on [VelocityJS](http://julian.com/research/velocity/), [Momentum](https://github.com/percolatestudio/meteor-momentum), and [Iron Router](http://eventedmind.github.io/iron-router/).

##### Page transitions

The default page transition is `segue-fade`.

Wrap all of the page content in a div with the `.content` class.

For right-to-left page transitions, add the `.segue-right-to-left`.

For left-to-right page transitions, add the `.segue-left-to-right`.

##### Layout Template

Wrap the Iron Router's `yield` helper with the `momentum` helper:
```
{{#momentum plugin='iron-router' options=transition}}
  {{>yield}}
{{/momentum}}
```

For UI elements that should not be animated during page transitions, like a header navbar or footer menu, you can add extra template below the `yield` helper:
```
{{#momentum plugin='iron-router' options=transition}}
  {{>yield}}
  {{>myFooterTemplateName}}
{{/momentum}}
```

##### Template Events & Helpers

To hook up Segue's helpers and events to your Meteor app, add following code to your layout template:
```
Template.myLayoutTemplateName.events(Segue.events);
Template.myLayoutTemplateName.helpers(Segue.helpers);
```

##### Previous Page Helper

To create a back button or link use `getPreviousPage` helper. Example:
```
<a href="{{getPreviousPage}}">Back</a>
```

