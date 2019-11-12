import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.page.html',
  styleUrls: ['./draw.page.scss'],
})
export class DrawPage implements OnInit {
  // Canvas stuff
  @ViewChild('imageCanvas', { static: false }) canvas: ElementRef;

  private ctx: CanvasRenderingContext2D;
  private position: DOMRect;

  saveX: number;
  saveY: number;

  // Make Canvas sticky at the top stuff
  @ViewChild(IonContent, { static: false }) content: IonContent;
  @ViewChild('fixedContainer', { static: false }) fixedContainer: any;

  // Color Stuff
  selectedColor = '#9e2956';
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3'];

  // size Stuff
  selectedSize = 2;

  //extra
  imageObj = new Image();
  imageName: string;
  myDraw: any;
  key: any;
  public brushUsed: boolean = false;
  public myColor: string = "#000";

  constructor(private router: Router,
    private activatedroute: ActivatedRoute,
    public alertController: AlertController) {
    this.activatedroute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.myDraw = this.router.getCurrentNavigation().extras.state.draw;
        this.imageName = "../." + this.myDraw.image;
      }
    });
  }

  async ngOnInit() {
    this.imageObj.src = this.imageName;
    setTimeout(e => this.draw(), 500);
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.ctx.stroke();
  }

  ionViewDidEnter() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.position = this.canvas.nativeElement.getBoundingClientRect();
  }

  startDrawing(ev) {
    this.brushUsed = true;
    this.saveX = ev.touches[0].pageX - this.position.x;
    this.saveY = ev.touches[0].pageY - this.position.y
  }

  moved(ev) {
    const currentX = ev.touches[0].pageX - this.position.x;
    const currentY = ev.touches[0].pageY - this.position.y;

    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = this.selectedColor;
    this.ctx.lineWidth = this.selectedSize;

    this.ctx.beginPath();
    this.ctx.moveTo(this.saveX, this.saveY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.closePath();

    this.ctx.stroke();

    this.saveX = currentX;
    this.saveY = currentY;
    this.isTransparent(currentX, currentY);
  }

  clear() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas
    this.ctx.drawImage(this.imageObj, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  draw() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height); // Clears the canvas
    this.ctx.drawImage(this.imageObj, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  brushSize(rangeValue: { detail: { value: number; }; }) {
    this.selectedSize = rangeValue.detail.value;
  }

  // assumes ctx is defined
  // returns true if pixel is fully transparent
  isTransparent(x, y) { // x, y coordinate of pixel
    console.log("isTransparent: ", this.ctx.getImageData(x, y, 1, 1).data[3] === 0)
    return this.ctx.getImageData(x, y, 1, 1).data[3] === 0; // 3rd byte is alpha
  }
}
