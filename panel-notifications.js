'use strict'

// Store auto-dismiss timers
var autoDismissTimers = {}

var setUpNotificationsContent = function() {
    notificationsChangedListener()
    pb.addEventListener('notifications_changed', notificationsChangedListener)
    
    // Set up auto-dismiss for existing notifications
    setupAutoDismiss()
}

var tearDownNotificationsContent = function() {
    pb.removeEventListener('notifications_changed', notificationsChangedListener)
    
    // Clear all auto-dismiss timers
    Object.keys(autoDismissTimers).forEach(function(key) {
        clearTimeout(autoDismissTimers[key])
    })
    autoDismissTimers = {}
}

var setupAutoDismiss = function() {
    var now = Date.now()
    var twoMinutes = 2 * 60 * 1000 // 2 minutes in milliseconds
    
    Object.keys(pb.notifier.active).forEach(function(key) {
        var notification = pb.notifier.active[key]
        
        // Skip if already has a timer
        if (autoDismissTimers[key]) {
            return
        }
        
        // Calculate time remaining
        var age = now - notification.created
        var timeRemaining = twoMinutes - age
        
        if (timeRemaining <= 0) {
            // Already older than 2 minutes, dismiss immediately
            clearNotification(notification)
        } else {
            // Set timer to dismiss after remaining time
            autoDismissTimers[key] = setTimeout(function() {
                if (pb.notifier.active[key]) {
                    console.log('Auto-dismissing notification after 2 minutes:', key)
                    clearNotification(notification)
                }
                delete autoDismissTimers[key]
            }, timeRemaining)
        }
    })
}

var notificationsChangedListener = function() {
    if (!window) {
        return
    }

    var count = Object.keys(pb.notifier.active).length
    var tab = document.getElementById('notifications-tab-label')
    if (count > 0) {
        tab.textContent = chrome.i18n.getMessage('notifications') + ' (' + count + ')'
    } else {
        tab.textContent = chrome.i18n.getMessage('notifications')
    }
    
    updateNotifications()
    
    // Set up auto-dismiss for any new notifications
    setupAutoDismiss()
}

var updateNotifications = function() {
    var notificationsHolder = document.getElementById('notifications-holder')
    var emptyHolder = document.getElementById('notifications-empty')

    while (notificationsHolder.firstChild) {
        notificationsHolder.removeChild(notificationsHolder.firstChild)
    }

    var keys = Object.keys(pb.notifier.active)
    if (keys.length > 0) {
        notificationsHolder.style.display = 'block'
        emptyHolder.style.display = 'none'

        keys.forEach(function(key) {
            var options = pb.notifier.active[key]

            notificationsHolder.insertBefore(fakeNotifications.renderNotification(options, function() {
                clearNotification(options)
            }), notificationsHolder.firstChild)
        })
    } else {
        notificationsHolder.style.display = 'none'
        emptyHolder.style.display = 'block'
    }
}

var clearNotification = function(options) {
    // Clear the auto-dismiss timer if it exists
    if (autoDismissTimers[options.key]) {
        clearTimeout(autoDismissTimers[options.key])
        delete autoDismissTimers[options.key]
    }
    
    chrome.notifications.clear(options.key, function(wasCleared) {
        delete pb.notifier.active[options.key]
        pb.dispatchEvent('notifications_changed')
        if (options.onclose) {
            options.onclose()
        }
    })
}
