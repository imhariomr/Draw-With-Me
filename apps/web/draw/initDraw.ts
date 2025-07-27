interface baseShape {
    id: number;
    type: 'rectangle' | 'circle' | 'line';
    X: number;
    y: number;
    slug?: string;
  }
  
  interface RectangleShape extends baseShape {
    type: 'rectangle';
    drawX: number;
    drawY: number;
  }

  interface lineShape extends baseShape {
    type: 'line';
    lineX: number;
    lineY: number;
  }
  
  interface CircleShape extends baseShape {
    type: 'circle';
    radius: number;
  }
  
  export type Shape = RectangleShape | CircleShape | lineShape;
  
  export class initDraw {
    private canvas: HTMLCanvasElement;
    private ctx: any;
    private isMouseDown = false;
    private startX = 0;
    private startY = 0;
    private drawX = 0;
    private drawY = 0;
    private lastTouchX?: number;
    private lastTouchY?: number;
    public selectedShape!: string;
    private id = 0;
    private roomSlug!: string;
    private socketRef?: WebSocket;
    private shapes: Shape[];
  
    constructor(
      canvas: HTMLCanvasElement,
      shapes: Shape[],
      selectedShape: string,
      socketRef: any,
      roomSlug: any
    ) {
      this.canvas = canvas;
      this.shapes = shapes;
      this.socketRef = socketRef;
      this.selectedShape = selectedShape;
      this.roomSlug = roomSlug;
      this.ctx = canvas.getContext('2d');
      this.setUpCanvas();
      this.renderShapes(this.shapes);
      this.drawShapes();
  
      if (this.socketRef) {
        this.socketRef.onmessage = (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data);
            if (data?.type === 'rectangle' || data?.type === 'circle' || data?.type==='line') {
              this.shapes.push(data);
              this.renderShapes(this.shapes);
            } else if (data?.type === 'shapeDeleted') {
              this.shapes = this.shapes.filter((shape: any) => shape?.id !== data?.id);
              this.renderShapes(this.shapes);
            }
          } catch (err) {
            console.error('Failed to parse incoming WS shape:', err);
          }
        };
      }
    }
  
    public setSelectedShape(shape: string) {
      this.selectedShape = shape;
    }
  
    private setUpCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      if (!this.ctx) return;
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    private drawShapes() {
      // Mouse Events
      this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
        this.isMouseDown = true;
        const { x, y } = this.getEventPosition(event);
        this.startX = x;
        this.startY = y;
      });
  
      this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
        if (!this.isMouseDown) return;
        this.isMouseDown = false;
        const { x, y } = this.getEventPosition(event);
        this.drawX = x - this.startX;
        this.drawY = y - this.startY;
        this.drawCanvas();
      });
  
      // Touch Events
      this.canvas.addEventListener(
        'touchstart',
        (event: TouchEvent) => {
          event.preventDefault();
          this.isMouseDown = true;
          const { x, y } = this.getEventPosition(event);
          this.startX = x;
          this.startY = y;
        },
        { passive: false }
      );
  
      this.canvas.addEventListener(
        'touchmove',
        (event: TouchEvent) => {
          event.preventDefault();
          const { x, y } = this.getEventPosition(event);
          this.lastTouchX = x;
          this.lastTouchY = y;
        },
        { passive: false }
      );
  
      this.canvas.addEventListener(
        'touchend',
        (event: TouchEvent) => {
          if (this.selectedShape === 'eraser') {
            this.handleTouchEndForEraser(event);
            return;
          }
      
          if (!this.isMouseDown) return;
          this.isMouseDown = false;
      
          const x = this.lastTouchX ?? this.startX;
          const y = this.lastTouchY ?? this.startY;
      
          this.drawX = x - this.startX;
          this.drawY = y - this.startY;
          this.drawCanvas();
        },
        { passive: false }
      );
      
  
      this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    }
  
    private getEventPosition(event: MouseEvent | TouchEvent): { x: number; y: number } {
      let clientX = 0,
        clientY = 0;
  
      if (event instanceof TouchEvent) {
        clientX = event.touches[0]?.clientX ?? 0;
        clientY = event.touches[0]?.clientY ?? 0;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
  
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    }
  
    private drawCanvas() {
      if (!this.ctx) return;
      this.ctx.fillStyle = 'black';
  
      if (this.selectedShape === 'rectangle') {
        this.ctx.strokeStyle = 'white';
        this.ctx.strokeRect(this.startX, this.startY, this.drawX, this.drawY);
  
        let rectShape: RectangleShape = {
          id: this.id++,
          type: 'rectangle',
          X: this.startX,
          y: this.startY,
          drawX: this.drawX,
          drawY: this.drawY,
        };
  
        if (this.socketRef?.readyState === WebSocket.OPEN) {
          rectShape = { ...rectShape, slug: this.roomSlug };
          this.socketRef.send(
            JSON.stringify({
              type: 'drawShape',
              payload: rectShape,
            })
          );
        }
      } else if (this.selectedShape === 'circle') {
        const dx = this.drawX;
        const dy = this.drawY;
        const centerX = this.startX + dx / 2;
        const centerY = this.startY + dy / 2;
        const radius = Math.sqrt(dx * dx + dy * dy) / 2;
  
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.stroke();
  
        let circleShape: CircleShape = {
          id: this.id++,
          type: 'circle',
          X: centerX,
          y: centerY,
          radius: radius,
        };
  
        if (this.socketRef?.readyState === WebSocket.OPEN) {
          circleShape = { ...circleShape, slug: this.roomSlug };
          this.socketRef.send(
            JSON.stringify({
              type: 'drawShape',
              payload: circleShape,
            })
          );
        }
      } else if(this.selectedShape === 'line'){
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(this.startX + this.drawX, this.startY + this.drawY);
        this.ctx.stroke();
        let lineShape: lineShape = {
            id: this.id++,
            type: 'line',
            X: this.startX,
            y: this.startY,
            lineX: this.startX + this.drawX,
            lineY:this.startY + this.drawY
          };
        if (this.socketRef?.readyState === WebSocket.OPEN) {
            lineShape = { ...lineShape, slug: this.roomSlug };
            this.socketRef.send(
              JSON.stringify({
                type: 'drawShape',
                payload: lineShape,
              })
            );
          }
      }
    }
  
    private handleCanvasClick(event: MouseEvent) {
      if (this.selectedShape !== 'eraser') return;
  
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      const clickedShape = this.getClickedShape(mouseX, mouseY);
      if (!clickedShape) return;
  
      if (this.socketRef?.readyState === WebSocket.OPEN) {
        this.socketRef.send(
          JSON.stringify({
            type: 'deleteShape',
            payload: { id: clickedShape.id, slug: this.roomSlug },
          })
        );
      }
    }

    private handleTouchEndForEraser(event: TouchEvent) {
        if (this.selectedShape !== 'eraser') return;
      
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const touch:any = event.changedTouches[0];
      
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;
      
        const clickedShape = this.getClickedShape(touchX, touchY);
        if (!clickedShape) return;
      
        if (this.socketRef?.readyState === WebSocket.OPEN) {
          this.socketRef.send(
            JSON.stringify({
              type: 'deleteShape',
              payload: { id: clickedShape.id, slug: this.roomSlug },
            })
          );
        }
      }
      
  
    private renderShapes(shapes: any[]) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  
      for (let shape of shapes) {
        if (shape?.type === 'rectangle') {
          this.ctx.strokeStyle = 'white';
          this.ctx.strokeRect(shape?.X, shape?.y, shape?.drawX, shape?.drawY);
        } else if (shape?.type === 'circle') {
          this.ctx.beginPath();
          this.ctx.strokeStyle = 'white';
          this.ctx.arc(shape?.X, shape?.y, shape?.radius, 0, Math.PI * 2);
          this.ctx.stroke();
        }else if(shape?.type === 'line'){
            this.ctx.beginPath();
            this.ctx.moveTo(shape.X, shape.y);
            this.ctx.lineTo(shape.lineX, shape.lineY);
            this.ctx.stroke();
        }
      }
    }
  
    private getClickedShape(mouseX: number, mouseY: number) {
      for (let shape of this.shapes) {
        if (shape.type === 'rectangle') {
          if (
            mouseX >= shape.X &&
            mouseX <= shape.X + shape.drawX &&
            mouseY >= shape.y &&
            mouseY <= shape.y + shape.drawY
          ) {
            return shape;
          }
        } else if (shape.type === 'circle') {
          const dx = mouseX - shape.X;
          const dy = mouseY - shape.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist <= shape.radius) {
            return shape;
          }
        }else if (shape.type === 'line') {
            const dist = this.pointToLineDistance(
              { x: shape.X, y: shape.y },
              { x: shape.lineX, y: shape.lineY },
              { x: mouseX, y: mouseY }
            );
            if (dist <= 5) return shape; 
          }
      }
    }
  
    private cleanCanvas() {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private pointToLineDistance(p1: any, p2: any, p: any): number {
        const A = p.x - p1.x;
        const B = p.y - p1.y;
        const C = p2.x - p1.x;
        const D = p2.y - p1.y;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        let xx, yy;
        if (param < 0) {
            xx = p1.x;
            yy = p1.y;
        } else if (param > 1) {
            xx = p2.x;
            yy = p2.y;
        } else {
            xx = p1.x + param * C;
            yy = p1.y + param * D;
        }
        const dx = p.x - xx;
        const dy = p.y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
  }
  