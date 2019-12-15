import { GraphRenderer } from "./GraphRenderer.js"


$(function() {
    var renderer = new GraphRenderer(document.getElementById('canvas'));

    setInterval(function() {
        renderer.render();
    }, 30);
})