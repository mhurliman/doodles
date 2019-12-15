
// Vector2
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    translate(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    }

    inverse() {
        return new Vector2(1.0 / this.x, 1.0 / this.y);
    }

    scale(value) {
        return new Vector2(this.x * value, this.y * value);
    }

    negate() {
        return new Vector2(-this.x, -this.y);
    }

    static add(v0, v1) {
        return new Vector2(v0.x + v1.x, v0.y + v1.y);
    }

    static subtract(v0, v1) {
        return new Vector2(v0.x - v1.x, v0.y - v1.y);
    }

    static zero() {
        return new Vector2();
    }

    static one() {
        return new Vector2(1, 1);
    }

    static right() {
        return new Vector2(1, 0);
    }

    static up() {
        return new Vector2(0, 1);
    }
}

// Matrix3x3
export class Matrix3x3 {
    constructor(
        m00 = 1, m01 = 0, m02 = 0, 
        m10 = 0, m11 = 1, m12 = 0, 
        m20 = 0, m21 = 0, m22 = 1) {
        this.v = [
            m00, m01, m02,
            m10, m11, m12,
            m20, m21, m22,
        ]
    }

    determinant() {
        return this.v[0] * (this.v[4] * this.v[8] - this.v[5] * this.v[7])
             - this.v[1] * (this.v[3] * this.v[8] - this.v[5] * this.v[6])
             + this.v[2] * (this.v[3] * this.v[7] - this.v[4] * this.v[6]);
    }

    inverse() {
        var det = this.determinant();
        return new Matrix3x3(
            (this.v[4] * this.v[8] - this.v[5] * this.v[7]) / det,
            (this.v[2] * this.v[7] - this.v[1] * this.v[8]) / det,
            (this.v[1] * this.v[5] - this.v[2] * this.v[4]) / det,
            
            (this.v[5] * this.v[6] - this.v[3] * this.v[8]) / det,
            (this.v[0] * this.v[8] - this.v[2] * this.v[6]) / det,
            (this.v[2] * this.v[3] - this.v[0] * this.v[5]) / det,
            
            (this.v[3] * this.v[7] - this.v[4] * this.v[6]) / det,
            (this.v[1] * this.v[6] - this.v[0] * this.v[7]) / det,
            (this.v[0] * this.v[4] - this.v[1] * this.v[3]) / det,
        );
    }

    static matmul(x, y) {
        return new Matrix3x3(
            x.v[0] * y.v[0] + x.v[1] * y.v[3] + x.v[2] * y.v[6],
            x.v[0] * y.v[1] + x.v[1] * y.v[4] + x.v[2] * y.v[7],
            x.v[0] * y.v[2] + x.v[1] * y.v[5] + x.v[2] * y.v[8],

            x.v[3] * y.v[0] + x.v[4] * y.v[3] + x.v[5] * y.v[6],
            x.v[3] * y.v[1] + x.v[4] * y.v[4] + x.v[5] * y.v[7],
            x.v[3] * y.v[2] + x.v[4] * y.v[5] + x.v[5] * y.v[8],

            x.v[6] * y.v[0] + x.v[7] * y.v[3] + x.v[8] * y.v[6],
            x.v[6] * y.v[1] + x.v[7] * y.v[4] + x.v[8] * y.v[7],
            x.v[6] * y.v[2] + x.v[7] * y.v[5] + x.v[8] * y.v[8],
        );
    }

    static transformPoint(mat, vec) {
        return new Vector2(
            mat.v[0] * vec.x + mat.v[1] * vec.y + mat.v[2],
            mat.v[3] * vec.x + mat.v[4] * vec.y + mat.v[5],
        );
    }

    static transformVec(mat, vec) {
        return new Vector2(
            mat.v[0] * vec.x + mat.v[1] * vec.y,
            mat.v[3] * vec.x + mat.v[4] * vec.y,
        );
    }

    static composite(trans, rot, scale) {
        return new Matrix3x3(
            Math.cos(rot) * scale.x, Math.sin(rot), trans.x,
            -Math.sin(rot), Math.cos(rot) * scale.y, trans.y,
            0, 0, 1,
        );
    }

    static translateScale(trans, scale) {
        return new Matrix3x3(
            scale.x, 0, trans.x,
            0, scale.y, trans.y,
            0, 0, 1,
        );
    }

    static rotation(rot) {
        return new Matrix3x3(
            Math.cos(rot), Math.sin(rot), 0,
            -Math.sin(rot), Math.cos(rot), 0,
            0, 0, 1,
        );
    }

    static translation(vec) {
        return new Matrix3x3(
            1, 0, vec.x,
            0, 1, vec.y,
            0, 0, 1,
        );
    }

    static scale(vec) {
        return new Matrix3x3(
            vec.x, 0, 0,
            0, vec.y, 0,
            0, 0, 1,
        );
    }
}