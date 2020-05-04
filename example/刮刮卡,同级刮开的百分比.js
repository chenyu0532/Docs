
const CALC_RECT_WIDTH = 20;
const CLEAR_LINE_WIDTH = 20;
cc.Class({
    extends: cc.Component,

    properties: {
        ticketNode: cc.Node,
        maskNode: cc.Mask,
        progerss: cc.Label,
    },

    onLoad() {

        this.reset();
        this.node.on('touchstart', this.touchStart, this);
        this.node.on('touchmove', this.touchMove, this);
        this.node.on('touchend', this.touchEnd, this);

    },
    touchStart(event) {
        let point = this.node.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
    },
    touchMove(event) {
        let point = this.node.convertToNodeSpaceAR(event.getLocation());
        this.clearMask(point);
    },
    touchEnd(event) {
        this.tempDrawPoints = [];
        this.calcProgress();
    },
    clearMask(pos) {
        let mask = this.maskNode.getComponent(cc.Mask);
        let stencil = mask._graphics;
        const len = this.tempDrawPoints.length;
        this.tempDrawPoints.push(pos);
    
        if (len <= 1) {
            // 只有一个点，用圆来清除涂层
            stencil.circle(pos.x, pos.y, CLEAR_LINE_WIDTH / 2);
            stencil.fill();

            //点所在的格子
            this.polygonPointsList.forEach((item) => {
                if (item.isHit) return;
                const xFlag = pos.x > item.rect.x && pos.x < item.rect.x + item.rect.width;
                const yFlag = pos.y > item.rect.y && pos.y < item.rect.y + item.rect.height;
                if (xFlag && yFlag) {
                    item.isHit = true;
                }
            });
    
        } else {
            // 存在多个点，用线段来清除涂层
            let prevPos = this.tempDrawPoints[len - 2];
            let curPos = this.tempDrawPoints[len - 1];
        
            stencil.moveTo(prevPos.x, prevPos.y);
            stencil.lineTo(curPos.x, curPos.y);
            stencil.lineWidth = CLEAR_LINE_WIDTH;
            stencil.lineCap = cc.Graphics.LineCap.ROUND;
            stencil.lineJoin = cc.Graphics.LineJoin.ROUND;
            stencil.strokeColor = cc.color(255, 255, 255, 255);
            stencil.stroke();
            
            // 记录线段经过的格子
            this.polygonPointsList.forEach((item) => {
                item.isHit = item.isHit || cc.Intersection.lineRect(prevPos, curPos, item.rect);
            });
        }
    },
    reset() {
        this.tempDrawPoints = [];
        this.polygonPointsList = [];
        // 生成小格子，用来辅助统计涂层的刮开比例
        for (let x = 0; x < this.ticketNode.width; x += CALC_RECT_WIDTH) {
            for (let y = 0; y < this.ticketNode.height; y += CALC_RECT_WIDTH) {
            this.polygonPointsList.push({
                rect: cc.rect(x - this.ticketNode.width / 2, y - this.ticketNode.height / 2, CALC_RECT_WIDTH, CALC_RECT_WIDTH),
                isHit: false
            });
            }
        }
    },
    calcProgress() {
        let hitItemCount = 0;
        this.polygonPointsList.forEach((item) => {
          if (!item.isHit) return;
          hitItemCount += 1;
        });
    
        this.progerss.string = `已经刮开了 ${Math.ceil((hitItemCount / this.polygonPointsList.length) * 100)}%`;
      }
});
