// 事件集合 (加上ON为了与设计定义相应)
export const EventEnum = {
    ONBLUR: 'blur',
    ONCHANGE: 'change',
    ONCLICK: 'click',
    ONDOUBLECLICK: 'doubleclick',
    ONFOCUS: 'focus',
    ONKEYDOWN: 'keydown',
    ONKEYPRESS: 'keypress',
    ONKEYUP: 'keyup',
    ONTOUCHSTART: 'touchstart',
    ONTOUCHMOVE: 'touchmove',
    ONTOUCHEND: 'touchend',
    ONPARAMETERSCHANGED: 'parameterschanged',
    ONINITIALIZE: 'initialize',
    ONREADY: 'ready',
    ONRENDER: 'render',
    ONDESTROY: 'destroy',
    ONSCROLLENDING: 'scrollending',
    ONSORT: 'sort',
    ONINPUT: 'input'
}

// v-model
export const UPDATE_MODEL_EVENT = 'update:modelValue'
export const MODEL_VALUE = 'modelValue'
