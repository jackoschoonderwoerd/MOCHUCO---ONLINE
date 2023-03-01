import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-venue-qr-code-png',
  templateUrl: './venue-qr-code-png.component.html',
  styleUrls: ['./venue-qr-code-png.component.scss']
})
export class VenueQrCodePngComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // qrdata = 'Initial QR code data string';

  // saveAsImage(parent) {
  //   // fetches base 64 date from image
  //   const parentElement = parent.el.nativeElement.querySelector("img").src;

  //   // converts base 64 encoded image to blobData
  //   let blobData = this.convertBase64ToBlob(parentElement);

  //   // saves as image
  //   if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { //IE
  //     (window.navigator as any).msSaveOrOpenBlob(blobData, 'Qrcode');
  //   } else { // chrome
  //     const blob = new Blob([blobData], { type: "image/png" });
  //     const url = window.URL.createObjectURL(blob);
  //     // window.open(url);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'Qrcode';
  //     link.click();
  //   }

  // }

  // private convertBase64ToBlob(Base64Image: any) {
  //   // SPLIT INTO TWO PARTS
  //   const parts = Base64Image.split(';base64,');
  //   // HOLD THE CONTENT TYPE
  //   const imageType = parts[0].split(':')[1];
  //   // DECODE BASE64 STRING
  //   const decodedData = window.atob(parts[1]);
  //   // CREATE UNIT8ARRAY OF SIZE SAME AS ROW DATA LENGTH
  //   const uInt8Array = new Uint8Array(decodedData.length);
  //   // INSERT ALL CHARACTER CODE INTO UINT8ARRAY
  //   for (let i = 0; i < decodedData.length; ++i) {
  //     uInt8Array[i] = decodedData.charCodeAt(i);
  //   }
  //   // RETURN BLOB IMAGE AFTER CONVERSION
  //   return new Blob([uInt8Array], { type: imageType });
  // }

}

