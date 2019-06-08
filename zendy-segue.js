// Namespace for package
Segue = {};

Segue.history = new ReactiveVar([]);

Segue.addToHistory = function( routeName ){
    var priorHistory = Segue.history.get();
    priorHistory.push( routeName.href );
    Segue.history.set( priorHistory );
}
Segue.removeFromHistory = function(){
    var priorHistory = Segue.history.get();
    priorHistory.pop();
    Segue.history.set( priorHistory );
}
Segue.clearHistory = function() {
    Segue.history.set([]);
}

// Events for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.events(Segue.events);
Segue.events = {
    'click a': function ( evt ) {
        Segue.transition = 'segue-fade';
    },
    'click a.fade-keep-history': function(){
        Segue.transition = 'segue-fade-keep-history';
    },
    'click a.icon-right-nav': function () {
        Segue.addToHistory(Iron.Location.get());
        Segue.transition = 'segue-right-to-left';
    },
    'click a.navigate-right': function () {
        Segue.addToHistory(Iron.Location.get());
        Segue.transition = 'segue-right-to-left';
    },
    'click a.transition-right': function () {
        Segue.addToHistory(Iron.Location.get());
        Segue.transition = 'segue-right-to-left';
    },
    'click a.icon-left-nav': function () {
        Segue.removeFromHistory();
        Segue.transition = 'segue-left-to-right';
    },
    'click a.navigate-left': function () {
        Segue.removeFromHistory();
        Segue.transition = 'segue-left-to-right';
    },
    'click a.transition-left': function () {
        Segue.removeFromHistory();
        Segue.transition = 'segue-left-to-right';
    },
    'click a.toggle': function( event ){
        var toggle = $(event.target);
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    },
    'click a.toggle-handle': function( event ){
        var toggle = $(event.target).parent();
        if( toggle.hasClass( 'active' ) ){
            toggle.removeClass( 'active' );
        }else{
            toggle.addClass( 'active' );
        }
    }

};

// Helpers for layout template
// Add the following to your Meteor app:
// Template.myLayoutTemplateName.helpers(Segue.helpers);
Segue.helpers = {
    transition: function () {
        return function (from, to, element) {
            return Segue.transition || 'segue-fade';
        }
    }
};

// Spacebar helpers
if( Meteor.isClient ) {

    UI.registerHelper('getPreviousPage', function () {
        var history = Segue.history.get();
        return history[history.length-1];
    });
    UI.registerHelper('isActive', function (args) {
        return args.hash.menu === args.hash.active ? 'active' : '';
    });
    UI.registerHelper('getCurrentRoute', function () {
        return Router.current().route.getName();
    });
    // XXX: make this a plugin itself?
    var sideToSide = function(fromX, toX) {
        return function(options) {
            options = _.extend({
                duration: 500,
                easing: 'ease-in-out'
            }, options);

            return {
                insertElement: function(node, next, done) {
                    var $node = $(node);

                    $node
                        .css('transform', 'translateX(' + fromX + ')')
                        .insertBefore(next)
                        .velocity({
                            translateX: [0, fromX]
                        }, {
                            easing: options.easing,
                            duration: options.duration,
                            queue: false,
                            complete: function() {
                                //console.log('complete');
                                $node.css('transform', '');
                                done();
                            }
                        });
                },
                removeElement: function(node, done) {
                    var $node = $(node);

                    $node
                        .velocity({
                            translateX: [toX]
                        }, {
                            duration: options.duration,
                            easing: options.easing,
                            complete: function() {
                                $node.remove();
                                done();
                            }
                        });
                }
            }
        }
    }
    Momentum.registerPlugin('segue-right-to-left', sideToSide('100%', '-100%'));
    Momentum.registerPlugin('segue-left-to-right', sideToSide('-100%', '100%'));
    Momentum.registerPlugin('segue-fade', function(options) {
        Segue.clearHistory();
        return {
            insertElement: function(node, next) {
                $(node)
                    .css('opacity', '0')
                    .insertBefore(next)
                    .velocity('fadeIn');
            },
            removeElement: function(node) {
                $(node).velocity('fadeOut', function() {
                    $(this).remove();
                });
            }
        }
    });
    Momentum.registerPlugin('segue-fade-keep-history', function(options) {
        // Segue.clearHistory();
        return {
            insertElement: function(node, next) {
                $(node)
                    .css('opacity', '0')
                    .insertBefore(next)
                    .velocity('fadeIn');
            },
            removeElement: function(node) {
                $(node).velocity('fadeOut', function() {
                    $(this).remove();
                });
            }
        }
    });

    Template.body.onRendered(function() {
        var device = null;

        if (/iPad|iPhone/.test(navigator.userAgent))
            device = 'ios';
        else if (/Android/.test(navigator.userAgent))
            device = 'android';
        if (device) {
            document.body.classList.add(device);
        }
    });
}
