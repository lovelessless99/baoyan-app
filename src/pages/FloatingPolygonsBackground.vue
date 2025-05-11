<template>
        <canvas ref="canvas" class="floating-shapes-background"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

interface Shape {
        type: number;
        x: number;
        y: number;
        size: number;
        color: string;
        alpha: number;
        speedX: number;
        speedY: number;
        rotation: number;
        rotationSpeed: number;
}

interface Point {
        x: number;
        y: number;
}

export default defineComponent({
        name: 'FloatingShapesBackground',

        props: {
                shapeCount: {
                        type: Number,
                        default(): number {
                                return window.innerWidth < 768 ? 15 : 30;
                        }
                },
                colors: {
                        type: Array,
                        default(): string[] {
                                return [
                                        '#AF8C76', // 褐色
                                        '#C6B5A8', // 淺褐色
                                        '#8A6E5A', // 深褐色
                                        '#68A978', // 綠色
                                        '#89C497'  // 淺綠色
                                ];
                        }
                },
                backgroundColor: {
                        type: String,
                        default: '#F5F0E6'
                }
        },

        data() {
                return {
                        canvas: null as HTMLCanvasElement | null,
                        ctx: null as CanvasRenderingContext2D | null,
                        shapes: [] as Shape[],
                        animationFrameId: null as number | null
                };
        },

        mounted() {
                this.initCanvas();
                this.initShapes();
                this.startAnimation();
                // 使用箭頭函數來保持 'this' 上下文
                window.addEventListener('resize', () => this.handleResize());
        },

        beforeUnmount() {
                this.stopAnimation();
                // 使用箭頭函數來保持 'this' 上下文
                window.removeEventListener('resize', () => this.handleResize());
        },

        methods: {
                initCanvas(): void {
                        this.canvas = this.$refs.canvas as HTMLCanvasElement;
                        const context = this.canvas.getContext('2d');
                        if (context) {
                                this.ctx = context;
                                this.canvas.width = window.innerWidth;
                                this.canvas.height = window.innerHeight;
                        }
                },

                initShapes(): void {
                        this.shapes = [];

                        for (let i = 0; i < this.shapeCount; i++) {
                                const shape = this.createShape(i, this.shapeCount);
                                this.shapes.push(shape);
                        }
                },

                createShape(index: number, totalCount: number): Shape {
                        if (!this.canvas) {
                                // 提供合理的默認值，避免返回undefined
                                return {
                                        type: 0,
                                        x: 0,
                                        y: 0,
                                        size: 30,
                                        color: '#AF8C76',
                                        alpha: 0.1,
                                        speedX: 0.1,
                                        speedY: 0.1,
                                        rotation: 0,
                                        rotationSpeed: 0.01
                                };
                        }

                        // 隨機形狀類型: 0 = 圓, 1 = 三角形, 2 = 正方形, 3 = 五邊形, 4 = 六邊形
                        const shapeType = Math.floor(Math.random() * 5);

                        // 隨機大小
                        const size = 20 + Math.random() * 50;

                        // 計算網格位置以均勻分布
                        const gridSize = Math.ceil(Math.sqrt(totalCount));
                        const cellWidth = this.canvas.width / gridSize;
                        const cellHeight = this.canvas.height / gridSize;

                        // 計算網格中的行列位置
                        const col = index % gridSize;
                        const row = Math.floor(index / gridSize);

                        // 在各自的網格單元中隨機位置
                        const x = col * cellWidth + Math.random() * cellWidth;
                        const y = row * cellHeight + Math.random() * cellHeight;

                        // 隨機顏色
                        const colorIndex = Math.floor(Math.random() * this.colors.length);
                        // 確保顏色是字符串類型
                        const color = typeof this.colors[colorIndex] === 'string'
                                ? this.colors[colorIndex]
                                : '#AF8C76';

                        // 隨機透明度
                        const alpha = 0.05 + Math.random() * 0.1;

                        // 隨機移動和旋轉速度
                        const speedX = (Math.random() - 0.5) * 0.5;
                        const speedY = (Math.random() - 0.5) * 0.5;
                        const rotationSpeed = (Math.random() - 0.5) * 0.02;

                        return {
                                type: shapeType,
                                x,
                                y,
                                size,
                                color,
                                alpha,
                                speedX,
                                speedY,
                                rotation: Math.random() * Math.PI * 2, // 隨機初始旋轉
                                rotationSpeed
                        };
                },

                drawShape(shape: Shape): void {
                        if (!this.ctx) return;

                        this.ctx.globalAlpha = shape.alpha;
                        this.ctx.fillStyle = shape.color;

                        // 保存當前狀態
                        this.ctx.save();

                        // 平移到形狀位置
                        this.ctx.translate(shape.x, shape.y);

                        // 旋轉
                        this.ctx.rotate(shape.rotation);

                        // 根據形狀類型繪製
                        switch (shape.type) {
                                case 0: // 圓形
                                        this.ctx.beginPath();
                                        this.ctx.arc(0, 0, shape.size, 0, Math.PI * 2);
                                        this.ctx.fill();
                                        break;

                                case 1: // 三角形（帶圓角）
                                        this.drawRoundedPolygon(3, shape.size, shape.size * 0.15);
                                        break;

                                case 2: { // 正方形（帶圓角）
                                        // 使用區塊作用域避免 ESLint no-case-declarations 錯誤
                                        this.ctx.beginPath();
                                        const rectSize = shape.size;
                                        const cornerRadius = shape.size * 0.15; // 圓角大小

                                        // 繪製圓角矩形
                                        this.roundRect(
                                                -rectSize / 2,
                                                -rectSize / 2,
                                                rectSize,
                                                rectSize,
                                                cornerRadius
                                        );

                                        this.ctx.fill();
                                        break;
                                }

                                case 3: // 五邊形（帶圓角）
                                        this.drawRoundedPolygon(5, shape.size, shape.size * 0.15);
                                        break;

                                case 4: // 六邊形（帶圓角）
                                        this.drawRoundedPolygon(6, shape.size, shape.size * 0.15);
                                        break;
                        }

                        // 恢復狀態
                        this.ctx.restore();

                        // 重置透明度
                        this.ctx.globalAlpha = 1;
                },

                // 新方法：繪製帶圓角的多邊形
                drawRoundedPolygon(sides: number, size: number, cornerRadius: number): void {
                        if (!this.ctx) return;

                        const angleStep = (Math.PI * 2) / sides;
                        const points: Array<Point> = [];

                        // 計算多邊形頂點
                        for (let i = 0; i < sides; i++) {
                                const angle = i * angleStep;
                                points.push({
                                        x: 0 + size * Math.cos(angle),
                                        y: 0 + size * Math.sin(angle)
                                });
                        }

                        this.ctx.beginPath();

                        // 確保數組不為空並且有足夠的元素
                        if (points.length >= 2) {
                                // 繪製第一條曲線的起點
                                const firstPoint = points[0];
                                const lastPoint = points[sides - 1];
                                if (firstPoint && lastPoint) {
                                        const startPoint = this.getMiddlePoint(firstPoint, lastPoint, cornerRadius);
                                        this.ctx.moveTo(startPoint.x, startPoint.y);

                                        // 繪製每個頂點的圓角
                                        for (let i = 0; i < sides; i++) {
                                                const current = points[i];
                                                const next = points[(i + 1) % sides];

                                                if (current && next) {
                                                        // 計算當前點和下一個點之間的中點
                                                        const endPoint = this.getMiddlePoint(current, next, cornerRadius);

                                                        // 使用二次貝塞爾曲線來創建圓角效果
                                                        this.ctx.quadraticCurveTo(current.x, current.y, endPoint.x, endPoint.y);
                                                }
                                        }
                                }
                        }

                        this.ctx.closePath();
                        this.ctx.fill();
                },

                // 輔助方法：計算兩點之間根據圓角距離的中點
                getMiddlePoint(p1: Point, p2: Point, cornerRadius: number): Point {
                        // 計算兩點之間的距離
                        const dx = p2.x - p1.x;
                        const dy = p2.y - p1.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        // 避免除以零
                        if (distance === 0) {
                                return { x: p1.x, y: p1.y };
                        }

                        // 計算從點p1朝向p2方向移動cornerRadius距離的點
                        const ratio = cornerRadius / distance;

                        return {
                                x: p1.x + dx * ratio,
                                y: p1.y + dy * ratio
                        };
                },

                // 繪製圓角矩形的方法
                roundRect(x: number, y: number, width: number, height: number, radius: number): void {
                        if (!this.ctx) return;

                        this.ctx.beginPath();
                        this.ctx.moveTo(x + radius, y);
                        this.ctx.lineTo(x + width - radius, y);
                        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                        this.ctx.lineTo(x + width, y + height - radius);
                        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                        this.ctx.lineTo(x + radius, y + height);
                        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                        this.ctx.lineTo(x, y + radius);
                        this.ctx.quadraticCurveTo(x, y, x + radius, y);
                        this.ctx.closePath();
                },

                updateShape(shape: Shape): void {
                        if (!this.canvas) return;

                        // 更新位置
                        shape.x += shape.speedX;
                        shape.y += shape.speedY;

                        // 更新旋轉
                        shape.rotation += shape.rotationSpeed;

                        // 邊界檢查與循環
                        if (shape.x < -shape.size) shape.x = this.canvas.width + shape.size;
                        if (shape.x > this.canvas.width + shape.size) shape.x = -shape.size;
                        if (shape.y < -shape.size) shape.y = this.canvas.height + shape.size;
                        if (shape.y > this.canvas.height + shape.size) shape.y = -shape.size;
                },

                animate(): void {
                        if (!this.ctx || !this.canvas) return;

                        // 清除畫布
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                        // 更新和繪製所有形狀
                        for (const shape of this.shapes) {
                                // 使用for...of確保我們只獲取存在的元素
                                this.updateShape(shape);
                                this.drawShape(shape);
                        }

                        // 請求下一幀
                        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
                },

                startAnimation(): void {
                        this.animate();
                },

                stopAnimation(): void {
                        if (this.animationFrameId !== null) {
                                cancelAnimationFrame(this.animationFrameId);
                                this.animationFrameId = null;
                        }
                },

                handleResize(): void {
                        if (this.canvas) {
                                this.canvas.width = window.innerWidth;
                                this.canvas.height = window.innerHeight;

                                // 重新初始化形狀位置
                                this.initShapes();
                        }
                }
        }
});
</script>

<style scoped>
.floating-shapes-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
}
</style>