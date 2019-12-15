import { Vector2, Matrix3x3 } from "./math.js"
import { Rect, RoundRect } from "./shape.js"

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}


// NodeView
export class NodeView {
    constructor(position, size, color, shape) {
        this.node = null;
        this.position = position;
        this.size = size;
        this.idleColor = color;
        this.highlightColor = 'yellow';
        this.color = color
        this.shape = shape;
        this.zOrder = 0;

        this.isDragging = false;
    }

    intersects(point) {
        return this.position.x < point.x &&
            this.position.y < point.y &&
            this.position.x + this.size.x > point.x &&
            this.position.y + this.size.y > point.y;
    }

    onMouseEnter(point) {
        this.color = this.highlightColor
    }

    onMouseLeave(point) {
        this.color = this.idleColor
    }

    onMouseDown(point) {
        this.isDragging = true;
    }

    onMouseMove(delta) {
        if (this.isDragging) {
            this.position.translate(delta);
        }
    }

    onMouseUp(point) {
        this.isDragging = false;
    }

    createTransform() {
        return Matrix3x3.composite(this.position, 0, this.size)
    }

    render(ctx, viewProj) {
        var worldViewProj = Matrix3x3.matmul(viewProj, this.createTransform());

        this.shape.draw(ctx, worldViewProj, this.color, this.color)
    }
}

export class EdgeView {
    constructor() {

    }

    render(ctx, viewProj) {
        
    }
}

export class GraphRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d')
        this.graph = null;

        this.position = new Vector2(0, 0);
        this.rotation = 0;
        this.scale = GraphRenderer.defaultScale();

        this.nodeViews = [
            new NodeView(new Vector2(5, 5), new Vector2(3.5, 3.5), "grey", new RoundRect()),
            new NodeView(new Vector2(0, 0), new Vector2(3.5, 2.5), "blue", new Rect()),
        ];
        this.intersectNodes = new Set()

        this.gridColor = "#B0B0B0";
        this.minorLineColor = "#bbbbbb"
        this.minorLineWidth = 1;
        
        this.majorLineColor = "#cccccc"
        this.majorLineWidth = 2;

        this.axisLineColor = "#ffffff"
        this.axisLineWidth = 4;

        this.initEvents();
    }

    resetView() {
        this.position = new Vector2(0, 0);
        this.rotation = 0;
        this.scale = GraphRenderer.defaultScale();
    }

    initEvents() {
        var that = this;

        var isDragging = false;
        var dragStart = new Vector2();

        $(this.canvas)
        .bind('mousewheel DOMMouseScroll', function (e) {
            var value = e.originalEvent.detail;

            if (value < 0) {
                that.scale = that.scale.scale(1.25 * (-value / 3.0));
            }
            else {
                that.scale = that.scale.scale(0.8 * (value / 3.0));
            }
            
            return false; 
        })
        .dblclick(function(e) {
            that.resetView();
        })
        .mousedown(function(e) {
            if (that.intersectNodes.size == 0) {
                isDragging = true;
            } 
            else {
                var projInv = that.getProjTransform().inverse();
                var viewInv = that.getViewTransform().inverse();
                var viewProjInv = Matrix3x3.matmul(viewInv, projInv);

                var position = new Vector2(e.originalEvent.x - e.currentTarget.offsetLeft, e.originalEvent.y - e.currentTarget.offsetTop)
                position = Matrix3x3.transformPoint(viewProjInv, position);

                that.intersectNodes.forEach(function (n) {
                    n.onMouseDown(position);
                });
            }
        })
        .mousemove(function(e) {
            var projInv = that.getProjTransform().inverse();
            var viewInv = that.getViewTransform().inverse();
            var viewProjInv = Matrix3x3.matmul(viewInv, projInv);

            if (isDragging) {
                var delta = new Vector2(e.originalEvent.movementX, e.originalEvent.movementY);
                delta = Matrix3x3.transformVec(projInv, delta);

                that.position.translate(delta)
            }
            else {
                var position = new Vector2(e.originalEvent.x - e.currentTarget.offsetLeft, e.originalEvent.y - e.currentTarget.offsetTop)
                position = Matrix3x3.transformPoint(viewProjInv, position);

                for (var i = 0; i < that.nodeViews.length; ++i) {
                    var node = that.nodeViews[i]

                    var delta = new Vector2(e.originalEvent.movementX, e.originalEvent.movementY);
                    delta = Matrix3x3.transformVec(viewProjInv, delta);

                    node.onMouseMove(delta);

                    if (node.intersects(position)) {

                        if (!that.intersectNodes.has(node)) {
                            node.onMouseEnter(position);
                            that.intersectNodes.add(node);
                        }
                    }
                    else {
                        if (that.intersectNodes.has(node)) {
                            node.onMouseLeave(position);
                            that.intersectNodes.delete(node);
                        }
                    }
                }
            }
        })
        .mouseup(function(e) {
            isDragging = false;
            
            var projInv = that.getProjTransform().inverse();
            var viewInv = that.getViewTransform().inverse();
            var viewProjInv = Matrix3x3.matmul(viewInv, projInv);

            var position = new Vector2(e.originalEvent.x - e.currentTarget.offsetLeft, e.originalEvent.y - e.currentTarget.offsetTop)
            position = Matrix3x3.transformPoint(viewProjInv, position);

            that.intersectNodes.forEach(function (n) {
                n.onMouseUp(position);
            });
        })
        .contextmenu(function(e) {
            console.log(e, 'fish')
            e.preventDefault()
        });
    }

    getViewTransform() {
        return Matrix3x3.composite(this.position, this.rotation, this.scale);
    }

    getProjTransform() {
        var offset = this.getCanvasSize().scale(0.5);
        var scale = clone(offset);
        scale.y *= -1;

        return Matrix3x3.translateScale(offset, scale);
    }

    getCanvasSize() {
        return new Vector2(this.canvas.scrollWidth, this.canvas.scrollHeight);
    }

    update(dt) {

    }

    render() {
        var proj = this.getProjTransform();
        var view = this.getViewTransform();
        var viewProj = Matrix3x3.matmul(proj, view);

        this.drawGrid(this.context, viewProj)

        for (var i = 0; i < this.nodeViews.length; ++i) {
            this.nodeViews[i].render(this.context, viewProj);
        }
    }

    drawGrid(ctx, viewProj) {
        var size = this.getCanvasSize();

        // Find the world-space view bounds by inverse view projection.
        var viewProjInv = viewProj.inverse();
        var start = Matrix3x3.transformPoint(viewProjInv, new Vector2(0, size.y));
        var end = Matrix3x3.transformPoint(viewProjInv, new Vector2(size.x, 0));

        ctx.fillStyle = this.gridColor;
        ctx.fillRect(0, 0, size.x, size.y);

        this.drawLines(ctx, viewProj, start, end, 0.25, this.minorLineColor, this.minorLineWidth);
        this.drawLines(ctx, viewProj, start, end, 1.0, this.majorLineColor, this.majorLineWidth);
        this.drawLines(ctx, viewProj, start, end, 10000000.0, this.axisLineColor, this.axisLineWidth);
    }

    drawLines(ctx, viewProj, start, end, interval, color, width) {
        // Begin line pass
        ctx.beginPath();

        // Vertical lines along x-axis
        var sign = Math.sign(start.x);
        var xCurr = Math.floor(sign * start.x / interval) * sign * interval;
        for (; xCurr < end.x; xCurr += interval) {
            var s = Matrix3x3.transformPoint(viewProj, new Vector2(xCurr, start.y));
            var e = Matrix3x3.transformPoint(viewProj, new Vector2(xCurr, end.y));

            ctx.moveTo(s.x, s.y);
            ctx.lineTo(e.x, e.y);
        }
        
        // Horizontal lines along y-axis
        var sign = Math.sign(start.y);
        var yCurr = Math.floor(sign * start.y / interval) * sign * interval;
        for (; yCurr < end.y; yCurr += interval) {
            var s = Matrix3x3.transformPoint(viewProj, new Vector2(start.x, yCurr));
            var e = Matrix3x3.transformPoint(viewProj, new Vector2(end.x, yCurr));
            
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(e.x, e.y);
        }
        ctx.closePath();
        
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    static defaultScale() {
        return new Vector2(5, 5).inverse();
    }
}
