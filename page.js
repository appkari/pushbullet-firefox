'use strict'

// Create a proxy pb object that communicates with the background page
window.pb = {
    local: {},
    settings: {},
    notifier: { active: {} },
    browser: 'firefox',
    www: 'https://www.pushbullet.com',
    
    // Proxy methods that send messages to background
    dispatchEvent: function(eventName, details) {
        chrome.runtime.sendMessage({
            type: 'dispatchEvent',
            eventName: eventName,
            details: details
        }).catch(function(e) {
            console.error('Error dispatching event:', e)
        })
    },
    
    track: function(data) {
        chrome.runtime.sendMessage({
            type: 'track',
            data: data
        }).catch(function(e) {
            console.error('Error tracking:', e)
        })
    },
    
    addEventListener: function(eventName, listener) {
        window.addEventListener(eventName, listener, false)
    },
    
    removeEventListener: function(eventName, listener) {
        window.removeEventListener(eventName, listener)
    },
    
    // Forward method calls to background
    saveSettings: function() {
        console.log('saveSettings called with settings:', this.settings)
        chrome.runtime.sendMessage({ 
            type: 'saveSettings',
            settings: this.settings 
        })
    },
    
    openTab: function(url) {
        chrome.runtime.sendMessage({ type: 'openTab', url: url })
    },
    
    signOut: function() {
        chrome.runtime.sendMessage({ type: 'signOut' })
    },
    
    popOutPanel: function() {
        chrome.runtime.sendMessage({ type: 'popOutPanel' })
    },
    
    setAwake: function(source, awake) {
        chrome.runtime.sendMessage({ type: 'setAwake', source: source, awake: awake })
    },
    
    snooze: function() {
        chrome.runtime.sendMessage({ type: 'snooze' })
    },
    
    unsnooze: function() {
        chrome.runtime.sendMessage({ type: 'unsnooze' })
    },
    
    sendPush: function(push) {
        chrome.runtime.sendMessage({ type: 'sendPush', push: push })
    },
    
    sendSms: function(data) {
        chrome.runtime.sendMessage({ type: 'sendSms', data: data })
    },
    
    getThreads: function(deviceIden, callback) {
        chrome.runtime.sendMessage({ type: 'getThreads', deviceIden: deviceIden }, callback)
    },
    
    getThread: function(deviceIden, threadId, callback) {
        chrome.runtime.sendMessage({ type: 'getThread', deviceIden: deviceIden, threadId: threadId }, callback)
    },
    
    getPhonebook: function(deviceIden, callback) {
        chrome.runtime.sendMessage({ type: 'getPhonebook', deviceIden: deviceIden }, callback)
    },
    
    setActiveChat: function(tabId, data) {
        chrome.runtime.sendMessage({ type: 'setActiveChat', tabId: tabId, data: data })
    },
    
    clearActiveChat: function(tabId) {
        chrome.runtime.sendMessage({ type: 'clearActiveChat', tabId: tabId })
    },
    
    openChat: function(mode, other) {
        chrome.runtime.sendMessage({ type: 'openChat', mode: mode, other: other })
    }
}

// Listen for messages from service worker
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'pbUpdate') {
        // Update pb object with data from service worker
        Object.assign(window.pb, message.data)
    } else if (message.type === 'dispatchEvent') {
        window.dispatchEvent(new CustomEvent(message.eventName, { detail: message.details }))
    }
})

var focused = true, onFocusChanged
window.addEventListener('focus', function() {
    focused = true

    if (onFocusChanged) {
        onFocusChanged()
    }

    if (window.pb) {
        pb.dispatchEvent('active')
    }
})
window.addEventListener('blur', function() {
    focused = false

    if (onFocusChanged) {
        onFocusChanged()
    }
})

var onload = function() {
    onload = null
    
    console.log('page.js onload called')
    
    // Request pb data from service worker
    chrome.runtime.sendMessage({ type: 'getPbData' }, function(response) {
        console.log('getPbData response:', response)
        
        if (response && response.pbData) {
            Object.assign(window.pb, response.pbData)
            console.log('pb data assigned:', window.pb)
        } else {
            console.error('No pbData in response')
        }
        
        ready()
    })
}

var ready = function() {
    console.log('ready() called')
    console.log('window.pb:', window.pb)
    console.log('pb.local:', pb.local)
    console.log('pb.settings:', pb.settings)
    
    if (!window.pb) {
        console.error('pb is not available')
        return
    }

    addBodyCssClasses()

    console.log('Calling window.init()')
    window.init()

    pb.dispatchEvent('active')
}

var addBodyCssClasses = function() {
    if (pb.local && pb.local.user) {
        document.body.classList.add('signed-in')
    } else {
        document.body.classList.add('not-signed-in')
    }

    if (pb.browser == 'chrome') {
        document.body.classList.add('chrome')
    } else {
        document.body.classList.add('not-chrome')
    }

    if (pb.browser == 'edge') {
        document.body.classList.add('edge')
    } else {
        document.body.classList.add('not-edge')
    }

    if (pb.browser == 'opera') {
        document.body.classList.add('opera')
    } else {
        document.body.classList.add('not-opera')
    }

    if (pb.browser == 'safari') {
        document.body.classList.add('safari')
    } else {
        document.body.classList.add('not-safari')
    }

    if (pb.browser == 'firefox') {
        document.body.classList.add('firefox')
    } else {
        document.body.classList.add('not-firefox')
    }

    if (navigator.platform.indexOf('MacIntel') != -1) {
        document.body.classList.add('mac')
    } else {
        document.body.classList.add('not-mac')
    }

    if (navigator.platform.toLowerCase().indexOf('win') != -1) {
        document.body.classList.add('windows')
    } else {
        document.body.classList.add('not-windows')
    }
}

document.addEventListener('DOMContentLoaded', onload)

window.onerror = function(message, file, line, column, error) {
    if (window.pb && pb.track) {
        pb.track({
            'name': 'error',
            'stack': error ? error.stack : file + ':' + line + ':' + column,
            'message': message
        })
    } else {
        console.error('Error occurred but pb.track is not available:', message)
    }
}
