interact('.resize').resizable({
    // resize from left
    edges: { left: true },

    listeners: {
        move(event) {
            var target = event.target;
            var x = parseFloat(target.getAttribute('data-x')) || 0;

            // update the element's style
            target.style.width = event.rect.width + 'px';

            // translate when resizing left edges
            x += event.deltaRect.left;

            target.setAttribute('data-x', x);
        },
    },
    modifiers: [
        // keep the edges inside the parent
        interact.modifiers.restrictEdges({
            outer: 'parent',
        }),

        // minimum size
        interact.modifiers.restrictSize({
            min: { width: 300 },
        }),
    ],

    inertia: true,
});
