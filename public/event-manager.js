const EventManager = (function createEventManager () {
  const events = {}

  return {
    subscribe (event, handler) {
      if (event in events) {
        events[event].push(handler)
        return
      }

      events[event] = [handler]
    },

    unsubscribe (event, handler) {
      if (event in events) {
        events[event] = events[event].filter(
          eventHandler => eventHandler !== handler
        )
      }
    },

    trigger (event, args) {
      const params = args ? JSON.parse(args) : ''
      events[event].forEach(handler => handler(params))
    }
  }
}())

exports = EventManager
