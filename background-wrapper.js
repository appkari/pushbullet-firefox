'use strict'

// Handle messages from popup/options pages
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'getPbData') {
        // Send pb data to requesting page
        sendResponse({
            pbData: {
                local: pb.local || {},
                settings: pb.settings || {},
                notifier: pb.notifier || { active: {} },
                browser: pb.browser,
                version: pb.version,
                userAgent: pb.userAgent,
                www: pb.www
            }
        })
        return true
    } else if (message.type === 'checkCookie') {
        // Manually check for cookie (useful after sign-in)
        chrome.cookies.get({ 'url': 'https://www.pushbullet.com', 'name': 'api_key' }, function(cookie) {
            if (cookie && cookie.value && cookie.value !== 'undefined' && cookie.value !== 'null') {
                console.log('Manual cookie check found api_key:', cookie.value)
                localStorage.apiKey = cookie.value
                
                delete localStorage.hasShownSignInNotification
                
                if (typeof main === 'function') {
                    main()
                }
                
                sendResponse({ success: true, apiKey: cookie.value })
            } else {
                sendResponse({ success: false })
            }
        })
        return true
    } else if (message.type === 'dispatchEvent') {
        if (pb.dispatchEvent) {
            pb.dispatchEvent(message.eventName, message.details)
        }
    } else if (message.type === 'track') {
        if (pb.track) {
            pb.track(message.data)
        }
    } else if (message.type === 'saveSettings') {
        console.log('saveSettings message received with settings:', message.settings)
        
        // Update pb.settings with the new values
        if (message.settings) {
            Object.assign(pb.settings, message.settings)
            console.log('Updated pb.settings:', pb.settings)
        }
        
        if (pb.saveSettings) {
            pb.saveSettings()
            console.log('pb.saveSettings() called')
        }
        
        // Notify all pages of the update
        notifyPbUpdate()
    } else if (message.type === 'openTab') {
        if (pb.openTab) {
            pb.openTab(message.url)
        }
    } else if (message.type === 'signOut') {
        if (pb.signOut) {
            pb.signOut()
        }
    } else if (message.type === 'popOutPanel') {
        if (pb.popOutPanel) {
            pb.popOutPanel()
        }
    } else if (message.type === 'setAwake') {
        if (pb.setAwake) {
            pb.setAwake(message.source, message.awake)
        }
    } else if (message.type === 'snooze') {
        if (pb.snooze) {
            pb.snooze()
        }
    } else if (message.type === 'unsnooze') {
        if (pb.unsnooze) {
            pb.unsnooze()
        }
    } else if (message.type === 'sendPush') {
        if (pb.sendPush) {
            pb.sendPush(message.push)
        }
    } else if (message.type === 'sendSms') {
        if (pb.sendSms) {
            pb.sendSms(message.data)
        }
    } else if (message.type === 'getThreads') {
        if (pb.getThreads) {
            pb.getThreads(message.deviceIden, function(response) {
                sendResponse(response)
            })
            return true
        }
    } else if (message.type === 'getThread') {
        if (pb.getThread) {
            pb.getThread(message.deviceIden, message.threadId, function(response) {
                sendResponse(response)
            })
            return true
        }
    } else if (message.type === 'getPhonebook') {
        if (pb.getPhonebook) {
            pb.getPhonebook(message.deviceIden, function(response) {
                sendResponse(response)
            })
            return true
        }
    } else if (message.type === 'setActiveChat') {
        if (pb.setActiveChat) {
            pb.setActiveChat(message.tabId, message.data)
        }
    } else if (message.type === 'clearActiveChat') {
        if (pb.clearActiveChat) {
            pb.clearActiveChat(message.tabId)
        }
    } else if (message.type === 'openChat') {
        if (pb.openChat) {
            pb.openChat(message.mode, message.other)
        }
    }
    return true
})

// Notify all extension pages when pb data changes
var notifyPbUpdate = function() {
    chrome.runtime.sendMessage({
        type: 'pbUpdate',
        data: {
            local: pb.local || {},
            settings: pb.settings || {},
            notifier: pb.notifier || { active: {} },
            browser: pb.browser,
            www: pb.www
        }
    }).catch(function() {
        // Ignore errors if no pages are listening
    })
}

// Hook into pb events to notify pages
if (pb.addEventListener) {
    pb.addEventListener('signed_in', notifyPbUpdate)
    pb.addEventListener('signed_out', notifyPbUpdate)
}

// Listen for cookie changes to detect sign-in
if (chrome.cookies && chrome.cookies.onChanged) {
    chrome.cookies.onChanged.addListener(function(changeInfo) {
        console.log('Cookie changed:', changeInfo.cookie.name, changeInfo.cookie.domain, 'removed:', changeInfo.removed)
        
        if (changeInfo.cookie.name === 'api_key' && 
            changeInfo.cookie.domain.indexOf('pushbullet.com') !== -1 &&
            !changeInfo.removed) {
            // API key cookie was set, reload the extension state
            console.log('API key cookie detected:', changeInfo.cookie.value)
            pb.log('API key cookie detected, reloading...')
            localStorage.apiKey = changeInfo.cookie.value
            
            // Clear the signed-out state
            delete localStorage.hasShownSignInNotification
            
            // Trigger a reload of the main function
            if (typeof main === 'function') {
                console.log('Calling main() to reload')
                main()
            } else {
                console.error('main function not found')
            }
            
            // Notify all pages
            notifyPbUpdate()
        }
    })
} else {
    console.error('chrome.cookies.onChanged not available')
}

// Periodically check for cookie if not signed in (fallback mechanism)
setInterval(function() {
    if (!localStorage.apiKey || !pb.local || !pb.local.user) {
        chrome.cookies.get({ 'url': 'https://www.pushbullet.com', 'name': 'api_key' }, function(cookie) {
            if (cookie && cookie.value && cookie.value !== 'undefined' && cookie.value !== 'null') {
                if (localStorage.apiKey !== cookie.value) {
                    console.log('Periodic check found api_key cookie:', cookie.value)
                    localStorage.apiKey = cookie.value
                    
                    delete localStorage.hasShownSignInNotification
                    
                    if (typeof main === 'function') {
                        console.log('Calling main() after periodic check')
                        main()
                    }
                    
                    notifyPbUpdate()
                }
            }
        })
    }
}, 3000) // Check every 3 seconds

// Debug: Log current state on load
console.log('Background wrapper loaded')
console.log('localStorage.apiKey:', localStorage.apiKey)
console.log('pb.local:', pb.local)
console.log('pb.settings:', pb.settings)
